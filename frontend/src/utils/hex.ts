export function bytesToHex(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).toUpperCase().padStart(2, "0")).join("");
}
export function hexToBytes(hex: string): number[] {
  const clean = hex.replace(/\s+/g, "").replace(/^0x/i, "");
  const out: number[] = [];
  for (let i = 0; i < clean.length; i += 2) out.push(parseInt(clean.substr(i, 2), 16));
  return out;
}