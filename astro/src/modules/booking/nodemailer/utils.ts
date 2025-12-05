import nodemailer from "nodemailer";
import { GOOGLE_APP_PASSWORD } from "astro:env/server";
import { SITE_URL } from "astro:env/client";

export class NodemailerError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "NodemailerError";
  }
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "faunacomunidad@gmail.com",
    pass: GOOGLE_APP_PASSWORD,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  template: string,
  qrBuffer: Buffer
) => {
  try {
    const mailOptions = {
      from: "Fauna Kite faunacomunidad@gmail.com",
      to,
      subject,
      html: template,
      attachments: [
        {
          filename: "course-qr-code.png",
          content: qrBuffer,
          cid: "qrcode",
        },
      ],
    };

    const mail = await transporter.sendMail(mailOptions);
    return mail;
  } catch (error) {
    console.log("Failed to send mail", { error });
    throw new NodemailerError("Failed to send mail", undefined, error);
  }
};

export function getBookingEmailTemplate() {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enrollment Confirmation - Fauna Kite</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="background-color: #051d26; padding: 30px 40px; text-align: center;">
                            <img src="${SITE_URL}/logo-blanco-horizontal.png" alt="Fauna Kite Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <h1 style="margin: 0 0 20px 0; color: #051d26; font-size: 28px; font-weight: bold; line-height: 1.3;">
                                Recibimos Tus Datos!
                            </h1>
                            <p style="margin: 0 0 30px 0; color: #3c2005; font-size: 16px; line-height: 1.6;">
                                ¡Felicidades! Estamos muy contentos de que te hayas unido a nosotros en Fauna Kite.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- QR Code Section -->
                    <tr>
                        <td style="padding: 20px 40px 30px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 8px; border: 2px solid #496807;">
                                <tr>
                                    <td style="padding: 30px; text-align: center;">
                                        <h2 style="margin: 0 0 15px 0; color: #051d26; font-size: 20px; font-weight: bold;">
                                            Codigo QR de tu reserva
                                        </h2>
                                        <p style="margin: 0 0 25px 0; color: #3c2005; font-size: 14px; line-height: 1.5;">
                                            Accede a tus beneficios utilizando este código QR
                                        </p>
                                        
                                        <!-- QR Code Image -->
                                        <img src="cid:qrcode" alt="Your Course QR Code" style="max-width: 300px; width: 100%; height: auto; display: block; margin: 0 auto; border: 4px solid #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer Message -->
                    <tr>
                        <td style="padding: 20px 40px 40px 40px;">
                            <p style="margin: 0 0 15px 0; color: #3c2005; font-size: 15px; line-height: 1.6;">
                                Nos vemos en el agua! 🪁🌊
                            </p>
                            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
                              Si tenes alguna pregunta, no dudes en ponerte en contacto con nosotros.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #051d26; padding: 25px 40px; text-align: center;">
                            <p style="margin: 0; color: white; font-size: 14px; line-height: 1.5;">
                                <strong>Fauna Kite</strong>
                            </p>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 13px; line-height: 1.5;">
                                Comunidad de Vientos
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
