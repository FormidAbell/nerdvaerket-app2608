/**
 * BLE Profiler til LOY PLAY-paritet
 * Implementerer UART 4953... + Fallback FFF0 som specificeret
 */

export interface BleProfile {
  name: string;
  serviceUUID: string;
  characteristics: {
    notify?: string[];
    notifyWrite?: string[];
    write?: string[];
    writeNoResponse?: string[];
  };
  cccdUUID?: string;
}

// A) UART-service (primær profil)
export const UART_PROFILE: BleProfile = {
  name: 'UART_4953',
  serviceUUID: '49535343-fe7d-4ae5-8fa9-9fafd205e455',
  characteristics: {
    notify: ['49535343-1e4d-4bd9-ba61-23c647249616'],
    notifyWrite: ['49535343-aca3-481c-91ec-d85e28a60318'],
    write: ['49535343-6daa-4d02-abf6-19569aca69fe'],
    writeNoResponse: ['49535343-8841-43f4-a8d4-ecbe34729bb3']
  },
  cccdUUID: '00002902-0000-1000-8000-00805f9b34fb'
};

// B) Fallback (LOY-stil)
export const FALLBACK_PROFILE: BleProfile = {
  name: 'LOY_FFF0',
  serviceUUID: '0000fff0-0000-1000-8000-00805f9b34fb',
  characteristics: {
    notify: ['0000fff1-0000-1000-8000-00805f9b34fb'],
    write: ['0000fff2-0000-1000-8000-00805f9b34fb']
  },
  cccdUUID: '00002902-0000-1000-8000-00805f9b34fb'
};

// Legacy iDot-3 profil (eksisterende)
export const LEGACY_PROFILE: BleProfile = {
  name: 'LEGACY_FEE7',
  serviceUUID: '0000fee7-0000-1000-8000-00805f9b34fb',
  characteristics: {
    notify: ['000036f6-0000-1000-8000-00805f9b34fb'],
    write: ['000036f5-0000-1000-8000-00805f9b34fb']
  },
  cccdUUID: '00002902-0000-1000-8000-00805f9b34fb'
};

export const BLE_PROFILES = [UART_PROFILE, FALLBACK_PROFILE, LEGACY_PROFILE];

// Scan filter logik som specificeret
export const SCAN_FILTERS = {
  // Filtrér på navn der starter med YS
  nameStartsWith: ['YS'],
  // Advertised service 0xFEE7
  advertisedServices: ['0000fee7-0000-1000-8000-00805f9b34fb'],
  // Tilstedeværelse af 0xFFF0 efter connect
  postConnectServices: ['0000fff0-0000-1000-8000-00805f9b34fb']
};

export function normalizeUUID(uuid: string): string {
  return uuid.toLowerCase().replace(/-/g, '');
}

export function matchesDeviceFilter(deviceName: string | null): boolean {
  if (!deviceName) return false;
  return SCAN_FILTERS.nameStartsWith.some(prefix => 
    deviceName.toUpperCase().startsWith(prefix)
  );
}

export function getProfileByServiceUUID(serviceUUID: string): BleProfile | null {
  const normalized = normalizeUUID(serviceUUID);
  return BLE_PROFILES.find(profile => 
    normalizeUUID(profile.serviceUUID) === normalized
  ) || null;
}

export interface DetectedProfile {
  profile: BleProfile;
  availableCharacteristics: {
    notify: string[];
    notifyWrite: string[];
    write: string[];
    writeNoResponse: string[];
  };
}