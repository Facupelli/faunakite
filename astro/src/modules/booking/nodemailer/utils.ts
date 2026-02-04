import nodemailer from "nodemailer";
import { GOOGLE_APP_PASSWORD } from "astro:env/server";
import { SITE_URL } from "astro:env/client";
import { useTranslations } from "../../../i18n/utils";

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

interface Attachment {
  filename: string;
  content: Buffer | string;
  cid?: string; // Optional Content-ID for embedding in HTML
  contentType?: string; // MIME type
  encoding?: string; // e.g., 'base64'
}

interface EmailOptions {
  to: string | string[]; // Support multiple recipients
  subject: string;
  html?: string; // HTML content
  text?: string; // Plain text alternative
  from?: string; // Optional override
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Attachment[];
  replyTo?: string;
}

const DEFAULT_SENDER = "Fauna Kite <faunacomunidad@gmail.com>";

export const sendMail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: options.from || DEFAULT_SENDER,
      to: options.to,
      subject: options.subject,
      ...(options.html && { html: options.html }),
      ...(options.text && { text: options.text }),
      ...(options.cc && { cc: options.cc }),
      ...(options.bcc && { bcc: options.bcc }),
      ...(options.replyTo && { replyTo: options.replyTo }),
      ...(options.attachments && { attachments: options.attachments }),
    };

    const mail = await transporter.sendMail(mailOptions);
    return mail;
  } catch (error) {
    console.log("Failed to send mail", { error });
    throw new NodemailerError("Failed to send mail", undefined, error);
  }
};

export function getBookingEmailTemplate(locale: "es" | "en") {
  const t = useTranslations(locale);

  return `
  <!DOCTYPE html>
<html lang="${locale}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t("email.booking.title")}</title>
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
                               ${t("email.booking.title")}
                            </h1>
                            <p style="margin: 0 0 30px 0; color: #3c2005; font-size: 16px; line-height: 1.6;">
                                ${t("email.booking.welcome")}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0px 40px 0px 40px;">
                            <p style="margin: 0 0 30px 0; color: #3c2005; font-size: 16px; line-height: 1.6;">
                               ${t("email.booking.qr.intro")}
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
                                            ${t("email.booking.qr.title")}
                                        </h2>
                                        <p style="margin: 0 0 25px 0; color: #3c2005; font-size: 14px; line-height: 1.5;">
                                           ${t("email.booking.qr.description")}
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
                            <a href="${SITE_URL}/es/benefits" target="_blank" style="display: inline-block; padding: 16px 40px; background-color: #d7f9f9; color: #051d26; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0, 0.2);">
                               ${t("email.booking.cta.benefits")}
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
                                 ${t("email.booking.pack.title")}
                            </h2>
                            <p style="margin: 0 0 15px 0; color: #3c2005; font-size: 15px; line-height: 1.6;">
                               ${t("email.booking.pack.intro")}
                            </p>
                            <ul style="margin: 0 0 20px 20px; padding: 0; color: #3c2005; font-size: 15px; line-height: 1.8;">
                                <li style="margin-bottom: 8px;">${t("email.booking.pack.item1")}</li>
                                <li style="margin-bottom: 8px;">${t("email.booking.pack.item2")}</li>
                                <li style="margin-bottom: 8px;">${t("email.booking.pack.item3")}</li>
                                <li style="margin-bottom: 8px;">${t("email.booking.pack.item4")}</li>
                            </ul>
                            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5; font-style: italic;">
                                ${t("email.booking.pack.wetsuit")}
                            </p>
                        </td>
                    </tr>

                    <!-- Cómo Llegar Section -->
                    <tr>
                        <td style="padding: 20px 40px 35px 40px;">
                            <h2 style="margin: 0 0 15px 0; color: #051d26; font-size: 22px; font-weight: bold;">
                              ${t("email.booking.location.title")}
                            </h2>
                            <p style="margin: 0 0 15px 0; color: #3c2005; font-size: 15px; line-height: 1.6;">
                               ${t("email.booking.location.description")}
                            </p>
                            <a href="https://maps.app.goo.gl/2GH4EQ4TK24zeBLp7" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #f8f9fa; color: #051d26; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: bold; border: 2px solid #051d26;">
                                 ${t("email.booking.location.maps")}
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
                               ${t("email.booking.footer.greeting")}
                            </p>
                            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
                             ${t("email.booking.footer.contact")}
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
                                ${t("email.booking.footer.tagline")}
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
