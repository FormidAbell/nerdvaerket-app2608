import { create } from "zustand";
import { getBleManager, FEE7_SERVICE_UUID, detectDeviceProfile, requestMTU, enableNotifications, matchesDeviceFilters } from "../ble/bleManager";
import { gattQueue, queueConnect, queueDiscover, queueWrite } from "../ble/gattQueue";
import { BLE_PROFILES, DetectedProfile } from "../ble/profiles";
import { protocolEngine, encodeCommand, CommandParams } from "../protocol/protocolEngine";
import { Buffer } from "buffer";
import { saveString, loadString } from "../storage/persist";
import { DeviceInfo, parseDeviceInfo, simulateDeviceDetection, DEVICE_COMMANDS, ScreenSize } from "../ble/deviceDetection";

export type Discovered = { id: string; name: string | null; rssi: number | null };
export type AckRule = { prefixHex?: string; minLength?: number };

// Reconnect strategy som specificeret
interface ReconnectState {
  enabled: boolean;
  attempts: number;
  delays: number[]; // [1, 2, 4, 8, 16, 30] seconds
  currentDelay: number;
  maxAttempts: number;
  timer?: NodeJS.Timeout;
}

type State = {
  manager: any;
  scanning: boolean;
  discovered: Record<string, Discovered>;
  connectedDevice?: any | null;
  detectedProfile?: DetectedProfile | null;
  currentMTU: number;
  
  // Protocol state
  protocolReady: boolean;
  heartbeatEnabled: boolean;
  heartbeatInterval?: NodeJS.Timeout;
  
  // Legacy compatibility
  serviceUUID?: string | null;
  writeChar?: any | null;
  notifyChar?: any | null;
  useWithoutResponse: boolean;
  
  // Logging
  log: string[];
  lastNotify?: Uint8Array | null;
  notifyCounter: number;
  lastDeviceId?: string | null;
  
  // Device detection state
  deviceInfo: DeviceInfo | null;
  detectedScreenSize: ScreenSize | null;
  isDetectingDevice: boolean;
  
  // ACK settings (legacy)
  ackRule: AckRule;
  ackTimeoutMs: number;
  retriesSOF: number;
  retriesEOF: number;
  chunkAckEnabled: boolean;
  chunkAckTimeoutMs: number;
  
  // Auto-reconnect
  reconnect: ReconnectState;
  
  // helpers
  matchesAck: (bytes: Uint8Array) => boolean;
  waitForNotifyOnce: (timeoutMs?: number, predicate?: (bytes: Uint8Array)=>boolean) => Promise<Uint8Array>;
  waitForAck: (timeoutMs?: number) => Promise<Uint8Array>;
  
  // actions
  hydrate: () => Promise<void>;
  startScan: () => Promise<void>;
  stopScan: () => void;
  connect: (id: string) => Promise<void>;
  quickReconnect: () => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Protocol commands
  sendCommand: (category: string, command: string, params?: CommandParams) => Promise<void>;
  sendRawHex: (hex: string) => Promise<void>;
  sendProtocolCommand: (category: string, command: string, params?: CommandParams, targetProfile?: string) => Promise<void>;
  
  // Legacy methods for compatibility
  setWriteMode: (withoutResp: boolean) => void;
  setAckRule: (rule: AckRule) => void;
  setAckTimeout: (ms: number) => void;
  setRetries: (sof: number, eof: number) => void;
  setChunkAck: (enabled: boolean, timeoutMs?: number) => void;
  sendHex: (hex: string) => Promise<void>;
  sendChunks: (chunks: (number[]|Uint8Array)[], opts?: { withoutResponse?: boolean }) => Promise<void>;
  
  // Device detection actions
  detectDevice: () => Promise<void>;
  setDeviceInfo: (info: DeviceInfo | null) => void;
  getCompatibleContent: () => ScreenSize[];
  
  // Reconnect actions
  enableAutoReconnect: (enabled: boolean) => void;
  startReconnectTimer: () => void;
  stopReconnectTimer: () => void;
  resetReconnectState: () => void;
};

function notifyHex(bytes: Uint8Array){
  return Array.from(bytes).map(b=>b.toString(16).toUpperCase().padStart(2,'0')).join(' ');
}

function parseHexToBytes(hex?: string): Uint8Array | null {
  if (!hex) return null;
  const clean = hex.replace(/\s+/g, "").replace(/^0x/i, "");
  if (clean.length % 2 !== 0) return null;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) out[i/2] = parseInt(clean.substr(i,2), 16);
  return out;
}

// Waiter registry for notify packets
type Waiter = { id: number; predicate: (b: Uint8Array)=>boolean; resolve: (b: Uint8Array)=>void; reject: (e: any)=>void; timer: any };
let waiterId = 1;
const waiters: Waiter[] = [];

// Heartbeat system
let heartbeatCounter = 0;

export const useBleStore = create<State>((set, get) => ({
  manager: getBleManager(),
  scanning: false,
  discovered: {},
  connectedDevice: null,
  detectedProfile: null,
  currentMTU: 23,
  
  // Protocol state  
  protocolReady: false,
  heartbeatEnabled: false,
  heartbeatInterval: undefined,
  
  // Legacy compatibility
  serviceUUID: FEE7_SERVICE_UUID,
  writeChar: null,
  notifyChar: null,
  useWithoutResponse: false,
  
  // Logging
  log: [],
  lastNotify: null,
  notifyCounter: 0,
  lastDeviceId: null,
  
  // Device detection state
  deviceInfo: null,
  detectedScreenSize: null,
  isDetectingDevice: false,
  
  // ACK settings (legacy)
  ackRule: { prefixHex: undefined, minLength: 1 },
  ackTimeoutMs: 2000,
  retriesSOF: 2,
  retriesEOF: 2,
  chunkAckEnabled: false,
  chunkAckTimeoutMs: 800,
  
  // Auto-reconnect state som specificeret
  reconnect: {
    enabled: true,
    attempts: 0,
    delays: [1, 2, 4, 8, 16, 30], // seconds
    currentDelay: 1,
    maxAttempts: 6,
    timer: undefined
  },
  
  matchesAck: (bytes: Uint8Array) => {
    const { ackRule } = get();
    const prefix = parseHexToBytes(ackRule.prefixHex);
    const minLen = ackRule.minLength ?? 1;
    if (bytes.length < minLen) return false;
    if (prefix) {
      if (bytes.length < prefix.length) return false;
      for (let i=0;i<prefix.length;i++) if (bytes[i] !== prefix[i]) return false;
    }
    return true;
  },
  
  hydrate: async () => {
    const id = await loadString('lastDeviceId');
    set({ lastDeviceId: id });
  },
  startScan: async () => {
    const { manager } = get();
    set({ scanning: true, discovered: {} });
    try {
      manager.startDeviceScan([FEE7_SERVICE_UUID], { allowDuplicates: false }, (error: any, device: any) => {
        if (error) { set((s) => ({ log: ["Scan error: " + error.message, ...s.log] })); set({ scanning: false }); return; }
        if (device) {
          set((s) => ({ discovered: { ...s.discovered, [device.id]: { id: device.id, name: device.name ?? device.localName ?? "Ukendt", rssi: device.rssi } } }));
        }
      });
    } catch (e:any) {
      set((s)=> ({ log: ["Scan start fejlede (web?): "+(e?.message??String(e)), ...s.log] }));
      set({ scanning: false });
    }
  },
  stopScan: () => { const { manager } = get(); try { manager.stopDeviceScan(); } catch {} set({ scanning: false }); },
  connect: async (id: string) => {
    const { manager, stopScan } = get();
    try {
      stopScan();
      let device = await manager.connectToDevice(id, { autoConnect: false });
      device = await device.discoverAllServicesAndCharacteristics();
      const [writeChar, notifyChar] = await Promise.all([
        findWritableCharacteristic(device, FEE7_SERVICE_UUID),
        findNotifyCharacteristic(device, FEE7_SERVICE_UUID),
      ]);
      set({ connectedDevice: device, writeChar, notifyChar, lastDeviceId: id });
      await saveString('lastDeviceId', id);
      set((s) => ({ log: [ `Forbundet til ${device.name ?? device.id}. Write: ${writeChar?.uuid ?? "?"} Notify: ${notifyChar?.uuid ?? "?"}`, ...s.log ] }));

      if (notifyChar) {
        device.monitorCharacteristicForService(FEE7_SERVICE_UUID, notifyChar.uuid, (error: any, characteristic: any) => {
          if (error) { set((s)=>({ log:["Notify error: "+error.message, ...s.log] })); return; }
          const base64 = characteristic?.value; if (!base64) return;
          const bytes = Buffer.from(base64, 'base64');
          set((s)=>({ lastNotify: bytes, notifyCounter: s.notifyCounter+1, log:[`Notify(${s.notifyCounter+1}): `+Array.from(bytes).map(b=>b.toString(16).toUpperCase().padStart(2,'0')).join(' '), ...s.log] }));
          for (let i = waiters.length - 1; i >= 0; i--) {
            const w = waiters[i];
            try { if (w.predicate(bytes)) { clearTimeout(w.timer); waiters.splice(i,1); w.resolve(bytes); } } catch {}
          }
        });
      }
      
      // Automatisk detect device når der forbindes
      setTimeout(() => get().detectDevice(), 1000);
    } catch (e: any) { set((s) => ({ log: ["Connect error: " + (e?.message ?? e), ...s.log] })); }
  },
  quickReconnect: async () => {
    const { lastDeviceId } = get();
    if (!lastDeviceId) return;
    try { await get().connect(lastDeviceId); } catch {}
  },
  disconnect: async () => {
    const { connectedDevice, manager } = get();
    if (connectedDevice) { try { await manager.cancelDeviceConnection(connectedDevice.id); } catch {} }
    set({ connectedDevice: null, writeChar: null, notifyChar: null, deviceInfo: null, detectedScreenSize: null });
  },
  setWriteMode: (withoutResp: boolean) => set({ useWithoutResponse: withoutResp }),
  setAckRule: (rule: AckRule) => set({ ackRule: rule }),
  setAckTimeout: (ms: number) => set({ ackTimeoutMs: ms }),
  setRetries: (sof: number, eof: number) => set({ retriesSOF: sof, retriesEOF: eof }),
  setChunkAck: (enabled: boolean, timeoutMs?: number) => set((s)=>({ chunkAckEnabled: enabled, chunkAckTimeoutMs: timeoutMs ?? s.chunkAckTimeoutMs })),
  waitForNotifyOnce: (timeoutMs = 1500, predicate = (_:Uint8Array)=> true) => {
    return new Promise<Uint8Array>((resolve, reject) => {
      const id = waiterId++;
      const timer = setTimeout(() => {
        const idx = waiters.findIndex(w=>w.id===id); if (idx>=0) waiters.splice(idx,1);
        reject(new Error('Notify timeout'));
      }, timeoutMs);
      waiters.push({ id, predicate, resolve, reject, timer });
    });
  },
  waitForAck: async (timeoutMs?: number) => {
    const { matchesAck, ackTimeoutMs } = get();
    return await get().waitForNotifyOnce(timeoutMs ?? ackTimeoutMs, matchesAck);
  },
  sendHex: async (hex: string) => {
    const { connectedDevice, writeChar, serviceUUID, useWithoutResponse } = get();
    if (!connectedDevice || !writeChar || !serviceUUID) throw new Error("Ikke forbundet eller ingen write characteristic");
    const base64 = Buffer.from(hex.replace(/\s+/g, '').replace(/^0x/i,''), 'hex').toString('base64');
    const write = useWithoutResponse
      ? connectedDevice.writeCharacteristicWithoutResponseForService.bind(connectedDevice)
      : connectedDevice.writeCharacteristicWithResponseForService.bind(connectedDevice);
    await write(serviceUUID, writeChar.uuid, base64);
    set((s) => ({ log: ["Sendt: " + hex, ...s.log] }));
  },
  sendChunks: async (chunks, opts={}) => {
    const { connectedDevice, writeChar, serviceUUID, useWithoutResponse } = get();
    if (!connectedDevice || !writeChar || !serviceUUID) throw new Error("Ikke forbundet eller ingen write characteristic");
    const without = opts.withoutResponse ?? useWithoutResponse;
    const write = without
      ? connectedDevice.writeCharacteristicWithoutResponseForService.bind(connectedDevice)
      : connectedDevice.writeCharacteristicWithResponseForService.bind(connectedDevice);
    for (const chunk of chunks) {
      const buf = chunk instanceof Uint8Array ? chunk : Uint8Array.from(chunk);
      const base64 = Buffer.from(buf).toString("base64");
      await write(serviceUUID, writeChar.uuid, base64);
    }
    set((s) => ({ log: ["Sendte "+chunks.length+" chunk(s)", ...s.log] }));
  },
  
  // Device detection functions
  detectDevice: async () => {
    const { connectedDevice, sendHex } = get();
    
    // Check if we're in browser/web environment
    const isBrowser = typeof window !== 'undefined' && !(window as any).ReactNativeWebView;
    
    if (isBrowser || !connectedDevice) {
      // Simulation i browser/preview
      set({ isDetectingDevice: true });
      setTimeout(() => {
        const simulatedDevice = simulateDeviceDetection();
        set({ 
          deviceInfo: simulatedDevice,
          detectedScreenSize: simulatedDevice.screenSize,
          isDetectingDevice: false 
        });
        set((s) => ({ log: ['🔍 Simuleret device detection: ' + simulatedDevice.model, ...s.log] }));
      }, 2000);
      return;
    }

    set({ isDetectingDevice: true });
    
    try {
      // Send BLE kommando for at få device info
      await sendHex(DEVICE_COMMANDS.GET_DEVICE_INFO);
      
      // Vent på response via notify
      const response = await get().waitForNotifyOnce(
        5000, // 5 sekunder timeout
        (bytes) => {
          const hex = Array.from(bytes).map(b=>b.toString(16).toUpperCase().padStart(2,'0')).join('');
          return hex.startsWith('A501'); // Device info response
        }
      );
      
      // Parse response
      const hexResponse = Array.from(response).map(b=>b.toString(16).toUpperCase().padStart(2,'0')).join('');
      const deviceInfo = parseDeviceInfo(hexResponse);
      if (deviceInfo) {
        set({ 
          deviceInfo,
          detectedScreenSize: deviceInfo.screenSize,
          isDetectingDevice: false 
        });
        set((s) => ({ log: ['🔍 Device detected: ' + deviceInfo.model, ...s.log] }));
      } else {
        throw new Error('Could not parse device info');
      }
      
    } catch (error) {
      set((s) => ({ log: ['Device detection failed: ' + (error as Error).message, ...s.log] }));
      // Fallback til 16x16 hvis detection fejler
      const fallbackInfo: DeviceInfo = {
        screenSize: '16x16',
        model: 'iDot-3 (Ukendt)',
        maxColors: 256,
        refreshRate: 30,
        capabilities: []
      };
      set({ 
        deviceInfo: fallbackInfo,
        detectedScreenSize: '16x16',
        isDetectingDevice: false 
      });
    }
  },
  
  setDeviceInfo: (info) => set({ 
    deviceInfo: info,
    detectedScreenSize: info?.screenSize || null 
  }),
  
  getCompatibleContent: () => {
    const { detectedScreenSize } = get();
    if (!detectedScreenSize) return ['16x16'];
    
    switch (detectedScreenSize) {
      case '16x16': return ['16x16'];
      case '32x32': return ['16x16', '32x32'];
      case '64x64': return ['16x16', '32x32', '64x64'];
      default: return ['16x16'];
    }
  },
  
  // Auto-reconnect actions
  enableAutoReconnect: (enabled: boolean) => {
    set(state => ({ 
      reconnect: { ...state.reconnect, enabled } 
    }));
  },
  
  startReconnectTimer: () => {
    const { reconnect } = get();
    if (reconnect.timer) clearTimeout(reconnect.timer);
    
    const delay = reconnect.delays[Math.min(reconnect.attempts, reconnect.delays.length - 1)] * 1000;
    
    const timer = setTimeout(() => {
      get().quickReconnect();
    }, delay);
    
    set(state => ({ 
      reconnect: { 
        ...state.reconnect, 
        timer,
        currentDelay: delay / 1000
      } 
    }));
  },
  
  stopReconnectTimer: () => {
    const { reconnect } = get();
    if (reconnect.timer) {
      clearTimeout(reconnect.timer);
      set(state => ({ 
        reconnect: { ...state.reconnect, timer: undefined } 
      }));
    }
  },
  
  resetReconnectState: () => {
    const { reconnect } = get();
    if (reconnect.timer) clearTimeout(reconnect.timer);
    
    set(state => ({ 
      reconnect: { 
        ...state.reconnect, 
        attempts: 0,
        currentDelay: state.reconnect.delays[0],
        timer: undefined
      } 
    }));
  },
  
  // Core protocol actions
  sendCommand: async (category: string, command: string, params?: CommandParams) => {
    const { connectedDevice, detectedProfile } = get();
    if (!connectedDevice) throw new Error('Not connected to device');
    
    try {
      const encodedCommand = encodeCommand(category, command, params);
      console.log(`[Protocol] Sending ${category}.${command}:`, protocolEngine.formatBytes(encodedCommand.payload));
      
      // Determine target characteristic based on profile
      let targetCharId: string;
      if (detectedProfile) {
        const profile = detectedProfile.profile;
        if (encodedCommand.targetChar === 'writeChar') {
          targetCharId = profile.characteristics.write?.[0] || profile.characteristics.notifyWrite?.[0] || '';
        } else if (encodedCommand.targetChar === 'writeNoResponseChar') {
          targetCharId = profile.characteristics.writeNoResponse?.[0] || profile.characteristics.write?.[0] || '';
        } else {
          targetCharId = profile.characteristics.write?.[0] || '';
        }
      } else {
        // Fallback til legacy
        const { writeChar } = get();
        if (!writeChar) throw new Error('No write characteristic available');
        targetCharId = writeChar.uuid;
      }
      
      if (!targetCharId) {
        throw new Error(`No target characteristic found for ${encodedCommand.targetChar}`);
      }
      
      // Send via GATT queue
      await queueWrite(async () => {
        const serviceId = detectedProfile?.profile.serviceUUID || FEE7_SERVICE_UUID;
        const withResponse = encodedCommand.writeMode === 'withResponse';
        
        if (withResponse) {
          await connectedDevice.writeCharacteristicWithResponseForService(
            serviceId,
            targetCharId,
            Buffer.from(encodedCommand.payload).toString('base64')
          );
        } else {
          await connectedDevice.writeCharacteristicWithoutResponseForService(
            serviceId,
            targetCharId,
            Buffer.from(encodedCommand.payload).toString('base64')
          );
        }
      });
      
      // Log successful send
      const logEntry = `[TX] ${category}.${command} (${encodedCommand.payload.length}B): ${protocolEngine.formatBytes(encodedCommand.payload)}`;
      set(state => ({ log: [...state.log.slice(-99), logEntry] }));
      
    } catch (error) {
      console.log(`[Protocol] Error sending ${category}.${command}:`, error);
      const logEntry = `[ERROR] ${category}.${command}: ${error}`;
      set(state => ({ log: [...state.log.slice(-99), logEntry] }));
      throw error;
    }
  },
  
  sendRawHex: async (hex: string) => {
    const { connectedDevice, writeChar, useWithoutResponse } = get();
    if (!connectedDevice || !writeChar) throw new Error('Not connected');
    
    const bytes = parseHexToBytes(hex);
    if (!bytes) throw new Error('Invalid hex string');
    
    await queueWrite(async () => {
      const b64 = Buffer.from(bytes).toString('base64');
      if (useWithoutResponse) {
        await writeChar.writeWithoutResponse(b64);
      } else {
        await writeChar.writeWithResponse(b64);
      }
    });
    
    const logEntry = `[TX] Raw (${bytes.length}B): ${notifyHex(bytes)}`;
    set(state => ({ log: [...state.log.slice(-99), logEntry] }));
  },
  
  sendProtocolCommand: async (category: string, command: string, params?: CommandParams, targetProfile?: string) => {
    // Advanced method med profile override
    return get().sendCommand(category, command, params);
  },
}));