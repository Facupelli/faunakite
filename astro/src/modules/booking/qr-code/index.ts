import QRCode from "qrcode";

export class QrGenerationError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "QrCodeError";
  }
}

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
  } catch (error) {
    console.error("QR generation error:", error);
    throw new QrGenerationError("Failed to generate QR Code", undefined, error);
  }
}
