import nodemailer from "nodemailer";
import { GOOGLE_APP_PASSWORD } from "astro:env/server";
import { SITE_URL } from "astro:env/client";

export class NodemailerError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown,
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
  qrBuffer: Buffer,
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
                            <img src="${SITE_URL}/logos/logo-blanco-horizontal.png" alt="Fauna Kite Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <h1 style="margin: 0 0 20px 0; color: #051d26; font-size: 28px; font-weight: bold; line-height: 1.3;">
                               Tu reserva está confirmada!
                            </h1>
                            <p style="margin: 0 0 30px 0; color: #3c2005; font-size: 16px; line-height: 1.6;">
                                Estamos muy contentos de que formes parte de nuestra comunidad y no vemos la hora de estar en el agua.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0px 40px 0px 40px;">
                            <p style="margin: 0 0 30px 0; color: #3c2005; font-size: 16px; line-height: 1.6;">
                                A continuación, el código QR de tu reserva para que accedas a los beneficios y descuentos exlusivos de nuestra comunidad.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- QR Code Section -->
                    <tr>
                        <td style="padding: 20px 40px 30px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa; border-radius: 8px; border: 2px solid #051d26;">
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
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 20px 40px 30px 40px; text-align: center;">
                            <a href="${SITE_URL}/es/allies" target="_blank" style="display: inline-block; padding: 16px 40px; background-color: #d7f9f9; color: #051d26; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0, 0.2);">
                                Conocé tus beneficios
                            </a>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="border-top: 2px solid #f0f0f0;"></div>
                        </td>
                    </tr>

                    <!-- Prepará tu mochila Section -->
                    <tr>
                        <td style="padding: 35px 40px 20px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #051d26; font-size: 22px; font-weight: bold;">
                                Prepará tu mochila!
                            </h2>
                            <p style="margin: 0 0 15px 0; color: #3c2005; font-size: 15px; line-height: 1.6;">
                                Durante las clases te damos todo el equipo necesario (traje de neoprene, chaleco y casco). Solo necesitás traer:
                            </p>
                            <ul style="margin: 0 0 20px 20px; padding: 0; color: #3c2005; font-size: 15px; line-height: 1.8;">
                                <li style="margin-bottom: 8px;">Ropa cómoda, traje de baño y toalla</li>
                                <li style="margin-bottom: 8px;">Protector solar, lentes de sol y gorra</li>
                                <li style="margin-bottom: 8px;">Abrigo para las noches (puede refrescar bastante)</li>
                                <li style="margin-bottom: 8px;">Mate, agua y buena onda</li>
                            </ul>
                            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5; font-style: italic;">
                                Si tenés tu traje de neoprene propio, un 4/3 largo es ideal, o 3/2 en diciembre y enero.
                            </p>
                        </td>
                    </tr>

                    <!-- Cómo Llegar Section -->
                    <tr>
                        <td style="padding: 20px 40px 35px 40px;">
                            <h2 style="margin: 0 0 15px 0; color: #051d26; font-size: 22px; font-weight: bold;">
                                Cómo Llegar
                            </h2>
                            <p style="margin: 0 0 15px 0; color: #3c2005; font-size: 15px; line-height: 1.6;">
                                Nos encontramos en la playa del Dique Cuesta del Viento, San Juan.
                            </p>
                            <a href="https://maps.app.goo.gl/2GH4EQ4TK24zeBLp7" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #f8f9fa; color: #051d26; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: bold; border: 2px solid #051d26;">
                                📌 Ver en Google Maps
                            </a>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="border-top: 2px solid #f0f0f0;"></div>
                        </td>
                    </tr>
                    
                    <!-- Footer Message -->
                    <tr>
                        <td style="padding: 35px 40px 40px 40px;">
                            <p style="margin: 0 0 15px 0; color: #3c2005; font-size: 15px; line-height: 1.6;">
                                Nos vemos en el agua!
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
