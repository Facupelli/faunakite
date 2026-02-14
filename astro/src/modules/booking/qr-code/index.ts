import { generate } from "@juit/qrcode";

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
  level: 1,
  scale: 8,
};

export async function createUrlQr(urlToEncode: string): Promise<Buffer> {
  try {
    const uint8Array = await generate(urlToEncode, "png", DEFAULT_QR_OPTIONS);
    return Buffer.from(uint8Array);
  } catch (error) {
    console.error("QR generation error:", error);
    throw new QrGenerationError("Failed to generate QR Code", undefined, error);
  }
}
