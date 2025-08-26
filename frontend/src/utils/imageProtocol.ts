import UPNG from "lib-upng";
import { Buffer } from "buffer";

export type PixelFormat = "RGB565LE" | "RGB888" | "GRB888";

export function crc16ccitt(buf: Uint8Array, poly = 0x1021, init = 0xffff, xorout = 0x0000): number {
  let crc = init;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i] << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ poly; else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return (crc ^ xorout) & 0xffff;
}

export function toRGB565LE(rgba: Uint8Array): Uint8Array {
  const out = new Uint8Array((rgba.length / 4) * 2);
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 2) {
    const r = rgba[i] >> 3; // 5 bits
    const g = rgba[i + 1] >> 2; // 6 bits
    const b = rgba[i + 2] >> 3; // 5 bits
    const value = (r << 11) | (g << 5) | b;
    out[j] = value & 0xff; // LE
    out[j + 1] = (value >> 8) & 0xff;
  }
  return out;
}

export function toRGB888(rgba: Uint8Array): Uint8Array {
  const out = new Uint8Array((rgba.length / 4) * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4) {
    out[j++] = rgba[i];
    out[j++] = rgba[i + 1];
    out[j++] = rgba[i + 2];
  }
  return out;
}

export function toGRB888(rgba: Uint8Array): Uint8Array {
  const out = new Uint8Array((rgba.length / 4) * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4) {
    const g = rgba[i + 1];
    const r = rgba[i];
    const b = rgba[i + 2];
    out[j++] = g; out[j++] = r; out[j++] = b;
  }
  return out;
}

export function decodePngBase64ToRgba(base64: string): { width: number; height: number; rgba: Uint8Array } {
  const bin = Uint8Array.from(Buffer.from(base64, 'base64'));
  const img = UPNG.decode(bin.buffer);
  const rgbaFrames = UPNG.toRGBA8(img);
  const rgba = Array.isArray(rgbaFrames) ? rgbaFrames[0] : rgbaFrames;
  return { width: img.width, height: img.height, rgba: new Uint8Array(rgba) };
}

export function buildSOF(frameId: number, width: number, height: number, pixelFmt: PixelFormat, chunkTotal: number) {
  const pf = pixelFmt === 'RGB565LE' ? 0x0001 : pixelFmt === 'RGB888' ? 0x0002 : 0x0003; // GRB888 = 0x0003
  const header = new Uint8Array([
    0xAA, 0x55, 0x49, 0x4D, 0x01, // AA 55 'IM' 0x01
    frameId & 0xff,
    width & 0xff, (width >> 8) & 0xff,
    height & 0xff, (height >> 8) & 0xff,
    pf & 0xff, (pf >> 8) & 0xff,
    chunkTotal & 0xff, (chunkTotal >> 8) & 0xff,
  ]);
  const crc = crc16ccitt(header);
  const out = new Uint8Array(header.length + 2);
  out.set(header, 0);
  out[header.length] = crc & 0xff;
  out[header.length + 1] = (crc >> 8) & 0xff;
  return out;
}

export function buildCHUNK(frameId: number, rowStart: number, rowCount: number, payload: Uint8Array) {
  const header = new Uint8Array([
    0xA1, 0xC1,
    frameId & 0xff,
    rowStart & 0xff, (rowStart >> 8) & 0xff,
    0x00, 0x00, // reserved
    rowCount & 0xff, (rowCount >> 8) & 0xff,
    payload.length & 0xff, (payload.length >> 8) & 0xff,
  ]);
  const body = new Uint8Array(header.length + payload.length);
  body.set(header, 0); body.set(payload, header.length);
  const crc = crc16ccitt(body);
  const out = new Uint8Array(body.length + 2);
  out.set(body, 0);
  out[body.length] = crc & 0xff;
  out[body.length + 1] = (crc >> 8) & 0xff;
  return out;
}

export function buildEOF(frameId: number, chunkTotal: number) {
  const header = new Uint8Array([
    0xA2, 0xC2,
    frameId & 0xff,
    chunkTotal & 0xff, (chunkTotal >> 8) & 0xff,
  ]);
  const crc = crc16ccitt(header);
  const out = new Uint8Array(header.length + 2);
  out.set(header, 0);
  out[header.length] = crc & 0xff;
  out[header.length + 1] = (crc >> 8) & 0xff;
  return out;
}

export function packPixels(rgba: Uint8Array, fmt: PixelFormat) {
  if (fmt === 'RGB565LE') return toRGB565LE(rgba);
  if (fmt === 'RGB888') return toRGB888(rgba);
  return toGRB888(rgba);
}