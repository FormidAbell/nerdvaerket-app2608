/**
 * Protocol Engine til LOY PLAY-paritet
 * Håndterer kommando parsing, encoding og transport-agnostisk kommunikation
 */

// Import protocol configuration inline to avoid JSON import issues
const protocolConfig = {
  "version": "1.0.0",
  "description": "LOY PLAY-paritet protocol definition",
  "profiles": {
    "uart": {
      "serviceUUID": "49535343-fe7d-4ae5-8fa9-9fafd205e455",
      "writeChar": "49535343-6daa-4d02-abf6-19569aca69fe",
      "writeNoResponseChar": "49535343-8841-43f4-a8d4-ecbe34729bb3",
      "notifyChar": "49535343-1e4d-4bd9-ba61-23c647249616"
    },
    "fallback": {
      "serviceUUID": "0000fff0-0000-1000-8000-00805f9b34fb", 
      "writeChar": "0000fff2-0000-1000-8000-00805f9b34fb",
      "notifyChar": "0000fff1-0000-1000-8000-00805f9b34fb"
    }
  },
  "commands": {
    "power": {
      "on": {
        "targetChar": "writeChar",
        "writeMode": "withResponse",
        "payloadTemplate": "CC{brightness:02X}33C33C",
        "params": {
          "brightness": {"type": "uint8", "min": 0, "max": 255, "default": 255}
        },
        "terminator": "",
        "crc": false,
        "description": "Power on with brightness"
      },
      "off": {
        "targetChar": "writeChar", 
        "writeMode": "withResponse",
        "payloadTemplate": "CC2433C33C",
        "params": {},
        "terminator": "",
        "crc": false,
        "description": "Power off"
      }
    },
    "brightness": {
      "set": {
        "targetChar": "writeChar",
        "writeMode": "withResponse",
        "payloadTemplate": "CC{value:02X}33C33C", 
        "params": {
          "value": {"type": "uint8", "min": 0, "max": 100, "default": 50}
        },
        "terminator": "",
        "crc": false,
        "description": "Set brightness 0-100%"
      }
    },
    "color": {
      "rgb": {
        "targetChar": "writeChar",
        "writeMode": "withResponse",
        "payloadTemplate": "CC{r:02X}{g:02X}{b:02X}33C33C",
        "params": {
          "r": {"type": "uint8", "min": 0, "max": 255, "default": 255},
          "g": {"type": "uint8", "min": 0, "max": 255, "default": 255}, 
          "b": {"type": "uint8", "min": 0, "max": 255, "default": 255}
        },
        "terminator": "",
        "crc": false,
        "description": "Set RGB color"
      }
    },
    "scene": {
      "static": {
        "targetChar": "writeChar",
        "writeMode": "withResponse",
        "payloadTemplate": "CC{r:02X}{g:02X}{b:02X}0133C33C",
        "params": {
          "r": {"type": "uint8", "min": 0, "max": 255, "default": 255},
          "g": {"type": "uint8", "min": 0, "max": 255, "default": 255},
          "b": {"type": "uint8", "min": 0, "max": 255, "default": 255}
        },
        "terminator": "",
        "crc": false,
        "description": "Static color scene"
      },
      "breathe": {
        "targetChar": "writeChar",
        "writeMode": "withResponse",
        "payloadTemplate": "CC{r:02X}{g:02X}{b:02X}0233C33C",
        "params": {
          "r": {"type": "uint8", "min": 0, "max": 255, "default": 255},
          "g": {"type": "uint8", "min": 0, "max": 255, "default": 255},
          "b": {"type": "uint8", "min": 0, "max": 255, "default": 255}
        },
        "terminator": "",
        "crc": false,
        "description": "Breathing effect"
      }
    }
  }
};

import { Buffer } from 'buffer';

export interface ProtocolConfig {
  version: string;
  description: string;
  profiles: Record<string, any>;
  commands: Record<string, Record<string, CommandDefinition>>;
  icTypes: Record<string, string>;
}

export interface CommandDefinition {
  targetChar: string;
  writeMode: 'withResponse' | 'withoutResponse';
  payloadTemplate: string;
  params: Record<string, ParameterDefinition>;
  terminator: string;
  crc: boolean;
  description: string;
}

export interface ParameterDefinition {
  type: 'uint8' | 'uint16' | 'int8' | 'int16' | 'string' | 'bytes';
  min?: number;
  max?: number;
  default?: any;
  length?: number;
}

export interface CommandParams {
  [key: string]: any;
}

export interface EncodedCommand {
  payload: Uint8Array;
  targetChar: string;
  writeMode: 'withResponse' | 'withoutResponse';
  description: string;
}

class ProtocolEngine {
  private config: ProtocolConfig;

  constructor() {
    this.config = protocolConfig as ProtocolConfig;
  }

  /**
   * Encode kommando til bytes
   */
  encodeCommand(category: string, command: string, params: CommandParams = {}): EncodedCommand {
    const commandDef = this.getCommandDefinition(category, command);
    if (!commandDef) {
      throw new Error(`Unknown command: ${category}.${command}`);
    }

    // Valider og merge parametre med defaults
    const finalParams = this.validateAndMergeParams(commandDef.params, params);
    
    // Parse payload template
    const payload = this.parsePayloadTemplate(commandDef.payloadTemplate, finalParams);
    
    // Tilføj terminator hvis specificeret
    let finalPayload = payload;
    if (commandDef.terminator) {
      const terminator = this.parseHexString(commandDef.terminator);
      finalPayload = new Uint8Array([...payload, ...terminator]);
    }

    // Beregn CRC hvis påkrævet
    if (commandDef.crc) {
      const crc = this.calculateCRC16(finalPayload);
      finalPayload = new Uint8Array([...finalPayload, crc & 0xFF, (crc >> 8) & 0xFF]);
    }

    return {
      payload: finalPayload,
      targetChar: commandDef.targetChar,
      writeMode: commandDef.writeMode,
      description: commandDef.description
    };
  }

  /**
   * Få kommando definition
   */
  private getCommandDefinition(category: string, command: string): CommandDefinition | null {
    return this.config.commands[category]?.[command] || null;
  }

  /**
   * Valider og merge parametre
   */
  private validateAndMergeParams(paramDefs: Record<string, ParameterDefinition>, params: CommandParams): CommandParams {
    const result: CommandParams = {};

    for (const [key, def] of Object.entries(paramDefs)) {
      let value = params[key] !== undefined ? params[key] : def.default;

      if (value === undefined) {
        throw new Error(`Missing required parameter: ${key}`);
      }

      // Type validation og conversion
      switch (def.type) {
        case 'uint8':
          value = Math.max(def.min || 0, Math.min(def.max || 255, Math.floor(value)));
          if (value < 0 || value > 255) throw new Error(`${key} must be 0-255`);
          break;
        case 'uint16':
          value = Math.max(def.min || 0, Math.min(def.max || 65535, Math.floor(value)));
          if (value < 0 || value > 65535) throw new Error(`${key} must be 0-65535`);
          break;
        case 'int8':
          value = Math.max(def.min || -128, Math.min(def.max || 127, Math.floor(value)));
          if (value < -128 || value > 127) throw new Error(`${key} must be -128-127`);
          break;
        case 'int16':
          value = Math.max(def.min || -32768, Math.min(def.max || 32767, Math.floor(value)));
          if (value < -32768 || value > 32767) throw new Error(`${key} must be -32768-32767`);
          break;
      }

      result[key] = value;
    }

    return result;
  }

  /**
   * Parse payload template med parametre
   */
  private parsePayloadTemplate(template: string, params: CommandParams): Uint8Array {
    let result = template;

    // Erstat parametre i template
    for (const [key, value] of Object.entries(params)) {
      const patterns = [
        `{${key}:02X}`, // 8-bit hex
        `{${key}:04X}`, // 16-bit hex
        `{${key}}`,     // Raw value
      ];

      for (const pattern of patterns) {
        if (result.includes(pattern)) {
          let replacement: string;
          
          if (pattern.includes('02X')) {
            replacement = (value as number).toString(16).toUpperCase().padStart(2, '0');
          } else if (pattern.includes('04X')) {
            // 16-bit value, little endian
            const val = value as number;
            const low = val & 0xFF;
            const high = (val >> 8) & 0xFF;
            replacement = low.toString(16).toUpperCase().padStart(2, '0') + 
                         high.toString(16).toUpperCase().padStart(2, '0');
          } else {
            replacement = String(value);
          }
          
          result = result.replace(new RegExp(`\\{${key}(:02X|:04X)?\\}`, 'g'), replacement);
        }
      }
    }

    return this.parseHexString(result);
  }

  /**
   * Parse hex string til bytes
   */
  private parseHexString(hex: string): Uint8Array {
    const clean = hex.replace(/\s+/g, '').replace(/^0x/i, '');
    if (clean.length % 2 !== 0) {
      throw new Error(`Invalid hex string length: ${hex}`);
    }

    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
      const byte = parseInt(clean.substr(i, 2), 16);
      if (isNaN(byte)) {
        throw new Error(`Invalid hex byte: ${clean.substr(i, 2)}`);
      }
      bytes[i / 2] = byte;
    }

    return bytes;
  }

  /**
   * Beregn CRC16-CCITT
   */
  private calculateCRC16(data: Uint8Array): number {
    let crc = 0xFFFF;
    
    for (const byte of data) {
      crc ^= byte << 8;
      
      for (let i = 0; i < 8; i++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc = crc << 1;
        }
      }
    }
    
    return crc & 0xFFFF;
  }

  /**
   * Få tilgængelige kommandoer
   */
  getAvailableCommands(): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    
    for (const [category, commands] of Object.entries(this.config.commands)) {
      result[category] = Object.keys(commands);
    }
    
    return result;
  }

  /**
   * Få kommando beskrivelse
   */
  getCommandDescription(category: string, command: string): string {
    const def = this.getCommandDefinition(category, command);
    return def?.description || 'No description available';
  }

  /**
   * Få parametre for kommando
   */
  getCommandParameters(category: string, command: string): Record<string, ParameterDefinition> {
    const def = this.getCommandDefinition(category, command);
    return def?.params || {};
  }

  /**
   * Få IC type navn
   */
  getIcTypeName(type: number): string {
    return this.config.icTypes[type.toString()] || `Unknown (${type})`;
  }

  /**
   * Få alle IC typer
   */
  getIcTypes(): Record<string, string> {
    return this.config.icTypes;
  }

  /**
   * Chunk payload hvis det er for stort
   */
  chunkPayload(payload: Uint8Array, mtu: number = 247): Uint8Array[] {
    const maxChunkSize = mtu - 3; // Reserve plads til ATT header
    
    if (payload.length <= maxChunkSize) {
      return [payload];
    }

    const chunks: Uint8Array[] = [];
    for (let i = 0; i < payload.length; i += maxChunkSize) {
      const end = Math.min(i + maxChunkSize, payload.length);
      chunks.push(payload.slice(i, end));
    }

    return chunks;
  }

  /**
   * Format bytes til læsbar hex string
   */
  formatBytes(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
  }
}

// Singleton instance
export const protocolEngine = new ProtocolEngine();

// Convenience functions
export const encodeCommand = (category: string, command: string, params?: CommandParams) =>
  protocolEngine.encodeCommand(category, command, params);

export const getAvailableCommands = () => protocolEngine.getAvailableCommands();
export const getCommandDescription = (category: string, command: string) =>
  protocolEngine.getCommandDescription(category, command);
export const getCommandParameters = (category: string, command: string) =>
  protocolEngine.getCommandParameters(category, command);

// Export types for external use
export type { CommandParams, ParameterDefinition, EncodedCommand };