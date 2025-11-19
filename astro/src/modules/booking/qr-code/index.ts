import QRCode from "qrcode";

const DEFAULT_QR_OPTIONS = {
  type: "png" as const,
  errorCorrectionLevel: "M" as const,
  width: 300,
  margin: 1,
};

export async function createUrlQr(urlToEncode: string) {
  try {
    const buffer = await QRCode.toBuffer(urlToEncode, DEFAULT_QR_OPTIONS);
    return buffer;
  } catch (err) {
    console.error("QR generation error:", err);
    throw err;
  }
}
