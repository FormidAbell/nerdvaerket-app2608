// Device detection for iDot enheder - læser skærmstørrelse automatisk
export type ScreenSize = '16x16' | '32x32' | '64x64';

export interface DeviceInfo {
  screenSize: ScreenSize;
  model: string;
  firmware?: string;
  maxColors?: number;
  refreshRate?: number;
  capabilities: string[];
}

// BLE kommandoer til at læse device info
export const DEVICE_COMMANDS = {
  GET_DEVICE_INFO: 'A5010100', // Spørg om device specifikationer
  GET_SCREEN_SIZE: 'A5010200', // Spørg specifikt om skærmstørrelse
  GET_CAPABILITIES: 'A5010300', // Spørg om supporterede features
};

// Parse device info response fra BLE
export const parseDeviceInfo = (hexResponse: string): DeviceInfo | null => {
  try {
    // Standard response format: A5 [CMD] [SIZE] [DATA...]
    if (!hexResponse.startsWith('A5') || hexResponse.length < 8) {
      return null;
    }

    const cmd = hexResponse.substring(2, 4);
    const size = parseInt(hexResponse.substring(4, 6), 16);
    const data = hexResponse.substring(6);

    if (cmd === '01') { // Device info response
      return parseDeviceInfoData(data);
    }

    return null;
  } catch (error) {
    console.error('Error parsing device info:', error);
    return null;
  }
};

const parseDeviceInfoData = (data: string): DeviceInfo => {
  // Parse device data baseret på format
  const screenSizeCode = data.substring(0, 2);
  const modelCode = data.substring(2, 4);
  const firmwareCode = data.substring(4, 8);
  
  let screenSize: ScreenSize = '16x16'; // default
  let model = 'iDot-3';
  const capabilities: string[] = [];

  // Decode screen size
  switch (screenSizeCode) {
    case '01':
      screenSize = '16x16';
      model = 'iDot-3 Mini';
      break;
    case '02':
      screenSize = '32x32';
      model = 'iDot-3 Standard';
      capabilities.push('extended_animations', 'detailed_images');
      break;
    case '03':
      screenSize = '64x64';
      model = 'iDot-3 Pro';
      capabilities.push('extended_animations', 'detailed_images', 'video_playback', 'advanced_games');
      break;
    default:
      // Fallback detection baseret på model code
      switch (modelCode) {
        case '10':
          screenSize = '16x16';
          break;
        case '20':
          screenSize = '32x32';
          break;
        case '30':
          screenSize = '64x64';
          break;
      }
  }

  return {
    screenSize,
    model,
    firmware: firmwareCode || undefined,
    maxColors: getMaxColors(screenSize),
    refreshRate: getRefreshRate(screenSize),
    capabilities
  };
};

const getMaxColors = (screenSize: ScreenSize): number => {
  switch (screenSize) {
    case '16x16': return 256; // 256 farver
    case '32x32': return 65536; // 16-bit farver
    case '64x64': return 16777216; // 24-bit farver
    default: return 256;
  }
};

const getRefreshRate = (screenSize: ScreenSize): number => {
  switch (screenSize) {
    case '16x16': return 30; // 30 FPS
    case '32x32': return 25; // 25 FPS
    case '64x64': return 20; // 20 FPS
    default: return 30;
  }
};

// Simuleret detection for test/demo (når ingen rigtig enhed)
export const simulateDeviceDetection = (): DeviceInfo => {
  // Simuler forskellige enheder for test
  const devices: DeviceInfo[] = [
    {
      screenSize: '16x16',
      model: 'iDot-3 Mini (Simuleret)',
      firmware: 'v1.2.0',
      maxColors: 256,
      refreshRate: 30,
      capabilities: []
    },
    {
      screenSize: '32x32',
      model: 'iDot-3 Standard (Simuleret)',
      firmware: 'v1.3.0',
      maxColors: 65536,
      refreshRate: 25,
      capabilities: ['extended_animations', 'detailed_images']
    },
    {
      screenSize: '64x64',
      model: 'iDot-3 Pro (Simuleret)',
      firmware: 'v1.4.0',
      maxColors: 16777216,
      refreshRate: 20,
      capabilities: ['extended_animations', 'detailed_images', 'video_playback', 'advanced_games']
    }
  ];

  // Vælg tilfældig enhed for demo
  return devices[Math.floor(Math.random() * devices.length)];
};

// Tjek om content er kompatibel med screen size
export const isContentCompatible = (
  contentSize: ScreenSize, 
  deviceSize: ScreenSize
): boolean => {
  const sizes = ['16x16', '32x32', '64x64'];
  const contentIndex = sizes.indexOf(contentSize);
  const deviceIndex = sizes.indexOf(deviceSize);
  
  // Content kan vises hvis device er samme størrelse eller større
  return deviceIndex >= contentIndex;
};

// Get passende content størrelse for device
export const getOptimalContentSize = (deviceSize: ScreenSize): ScreenSize[] => {
  switch (deviceSize) {
    case '16x16':
      return ['16x16'];
    case '32x32':
      return ['16x16', '32x32'];
    case '64x64':
      return ['16x16', '32x32', '64x64'];
    default:
      return ['16x16'];
  }
};