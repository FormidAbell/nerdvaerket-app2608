import { useBleStore } from "../store/bleStore";

// Simple command bus that mirrors LOY PLAY-like frames using current best-known templates
// Adjust here when we finalize exact frames captured from device

function toHex2(n: number) { return Math.max(0, Math.min(255, n|0)).toString(16).toUpperCase().padStart(2, '0'); }

export const commandBus = {
  powerOn: async () => {
    // AA55 A5 01 55AA
    const hex = `AA55A50155AA`;
    await useBleStore.getState().sendHex(hex);
  },
  powerOff: async () => {
    const hex = `AA55A50055AA`;
    await useBleStore.getState().sendHex(hex);
  },
  setBrightness: async (pct: number) => {
    const P = Math.max(0, Math.min(100, pct|0));
    const hex = `AA55B0${toHex2(P)}55AA`;
    await useBleStore.getState().sendHex(hex);
  },
  setColorRGB: async (r: number, g: number, b: number) => {
    const hex = `AA55CC${toHex2(r)}${toHex2(g)}${toHex2(b)}55AA`;
    await useBleStore.getState().sendHex(hex);
  },
  setAnimation: async (mode: 'rainbow' | 'marquee' | 'blink' | 'waves' | 'noise', opts: { speed?: number; bright?: number; r?: number; g?: number; b?: number } = {}) => {
    const speed = Math.max(0, Math.min(255, opts.speed ?? 32));
    const bright = Math.max(0, Math.min(255, opts.bright ?? 128));
    const r = Math.max(0, Math.min(255, opts.r ?? 0));
    const g = Math.max(0, Math.min(255, opts.g ?? 128));
    const b = Math.max(0, Math.min(255, opts.b ?? 255));

    let hex = '';
    switch (mode) {
      case 'rainbow':
        // AA55 01 SS BB 55AA
        hex = `AA5501${toHex2(speed)}${toHex2(bright)}55AA`; break;
      case 'marquee':
        // AA55 02 SS BB RR GG BB 55AA
        hex = `AA5502${toHex2(speed)}${toHex2(bright)}${toHex2(r)}${toHex2(g)}${toHex2(b)}55AA`; break;
      case 'blink':
        hex = `AA5503${toHex2(speed)}${toHex2(bright)}${toHex2(r)}${toHex2(g)}${toHex2(b)}55AA`; break;
      case 'waves':
        hex = `AA5504${toHex2(speed)}${toHex2(bright)}${toHex2(r)}${toHex2(g)}${toHex2(b)}55AA`; break;
      case 'noise':
        hex = `AA5505${toHex2(speed)}${toHex2(bright)}55AA`; break;
    }
    await useBleStore.getState().sendHex(hex);
  },
};