/**
 * Global GATT-kø til sekventielle BLE operationer
 * Sikrer at alle BLE operationer kører i rækkefølge uden overlapping
 */

interface QueueItem {
  id: string;
  operation: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timeout: number;
  timeoutHandle?: NodeJS.Timeout;
  type: 'connect' | 'discover' | 'read' | 'write' | 'notify' | 'other';
  priority: number; // 0 = højest prioritet
}

class GattQueue {
  private queue: QueueItem[] = [];
  private running = false;
  private currentOperation: QueueItem | null = null;
  private operationCounter = 0;

  // Timeouts som specificeret
  private readonly TIMEOUTS = {
    connect: 15000,    // 15s
    discover: 10000,   // 10s
    read: 5000,        // 5s
    write: 5000,       // 5s
    notify: 5000,      // 5s
    other: 10000       // 10s
  };

  // Prioriteter (lavere tal = højere prioritet)
  private readonly PRIORITIES = {
    connect: 0,
    discover: 1,
    notify: 2,
    write: 3,
    read: 4,
    other: 5
  };

  /**
   * Tilføj operation til kø
   */
  enqueue<T>(
    operation: () => Promise<T>,
    type: QueueItem['type'] = 'other',
    customTimeout?: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = `op_${++this.operationCounter}`;
      const timeout = customTimeout || this.TIMEOUTS[type];
      const priority = this.PRIORITIES[type];

      const item: QueueItem = {
        id,
        operation,
        resolve,
        reject,
        timeout,
        type,
        priority
      };

      // Indsæt i kø sorteret efter prioritet
      const insertIndex = this.queue.findIndex(q => q.priority > priority);
      if (insertIndex === -1) {
        this.queue.push(item);
      } else {
        this.queue.splice(insertIndex, 0, item);
      }

      console.log(`[GATT Queue] Enqueued ${type} operation ${id}, queue length: ${this.queue.length}`);
      this.processQueue();
    });
  }

  /**
   * Proces næste operation i køen
   */
  private async processQueue(): Promise<void> {
    if (this.running || this.queue.length === 0) {
      return;
    }

    this.running = true;
    const item = this.queue.shift()!;
    this.currentOperation = item;

    console.log(`[GATT Queue] Processing ${item.type} operation ${item.id}`);

    // Sæt timeout
    item.timeoutHandle = setTimeout(() => {
      console.log(`[GATT Queue] Operation ${item.id} timed out after ${item.timeout}ms`);
      item.reject(new Error(`Operation timed out after ${item.timeout}ms`));
      this.finishOperation();
    }, item.timeout);

    try {
      const result = await item.operation();
      console.log(`[GATT Queue] Operation ${item.id} completed successfully`);
      
      if (item.timeoutHandle) {
        clearTimeout(item.timeoutHandle);
      }
      
      item.resolve(result);
    } catch (error) {
      console.log(`[GATT Queue] Operation ${item.id} failed:`, error);
      
      if (item.timeoutHandle) {
        clearTimeout(item.timeoutHandle);
      }
      
      item.reject(error);
    }

    this.finishOperation();
  }

  private finishOperation(): void {
    this.currentOperation = null;
    this.running = false;
    
    // Proces næste operation efter kort delay
    setTimeout(() => this.processQueue(), 10);
  }

  /**
   * Få status på køen
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      currentOperation: this.currentOperation?.type || null,
      running: this.running
    };
  }

  /**
   * Ryd køen (kun for emergency use)
   */
  clear(): void {
    console.log(`[GATT Queue] Clearing queue with ${this.queue.length} items`);
    
    // Reject alle ventende operationer
    this.queue.forEach(item => {
      if (item.timeoutHandle) {
        clearTimeout(item.timeoutHandle);
      }
      item.reject(new Error('Queue cleared'));
    });
    
    this.queue = [];
    
    // Stop nuværende operation
    if (this.currentOperation?.timeoutHandle) {
      clearTimeout(this.currentOperation.timeoutHandle);
      this.currentOperation.reject(new Error('Queue cleared'));
    }
    
    this.currentOperation = null;
    this.running = false;
  }

  /**
   * Vent indtil køen er tom
   */
  async waitUntilEmpty(timeout = 30000): Promise<void> {
    const startTime = Date.now();
    
    while (this.queue.length > 0 || this.running) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Timeout waiting for GATT queue to empty');
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

// Global singleton instance
export const gattQueue = new GattQueue();

// Convenience wrappers for almindelige operationer
export const queueConnect = (operation: () => Promise<any>) => 
  gattQueue.enqueue(operation, 'connect');

export const queueDiscover = (operation: () => Promise<any>) => 
  gattQueue.enqueue(operation, 'discover');

export const queueWrite = (operation: () => Promise<any>) => 
  gattQueue.enqueue(operation, 'write');

export const queueRead = (operation: () => Promise<any>) => 
  gattQueue.enqueue(operation, 'read');

export const queueNotify = (operation: () => Promise<any>) => 
  gattQueue.enqueue(operation, 'notify');