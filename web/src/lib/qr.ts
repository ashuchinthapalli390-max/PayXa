import QRCode from "qrcode";

/**
 * Real, standards-compliant QR matrix. The payload is a plain text notice,
 * not a UPI payment URI, so scanning it can never move money.
 */
export const QR_TEXT = "PayXa test checkout PXA-20481 - this code does not collect payments.";

const cache = new Map<string, { size: number; on: (x: number, y: number) => boolean }>();

export function getQr(text: string = QR_TEXT) {
  let q = cache.get(text);
  if (!q) {
    const m = QRCode.create(text, { errorCorrectionLevel: "H" }).modules;
    const size = m.size;
    const data = m.data;
    q = { size, on: (x: number, y: number) => !!data[y * size + x] };
    cache.set(text, q);
  }
  return q;
}
