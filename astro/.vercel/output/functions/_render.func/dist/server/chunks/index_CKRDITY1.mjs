import QRCode from 'qrcode';

const DEFAULT_QR_OPTIONS = {
  type: "png",
  errorCorrectionLevel: "M",
  width: 300,
  margin: 1
};
async function createUrlQr(urlToEncode) {
  try {
    const buffer = await QRCode.toBuffer(urlToEncode, DEFAULT_QR_OPTIONS);
    return buffer;
  } catch (err) {
    console.error("QR generation error:", err);
    throw err;
  }
}

export { createUrlQr as c };
