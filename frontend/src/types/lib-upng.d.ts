declare module 'lib-upng' {
  export function decode(buffer: ArrayBuffer): any;
  export function toRGBA8(png: any): Uint8Array;
}