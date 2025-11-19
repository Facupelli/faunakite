import * as z from 'zod';
import './chunks/virtual_DUIBJoFs.mjs';
import { G as GoogleSheetsBookingRepository } from './chunks/google-sheet-booking.repository_pRCOeguo.mjs';
import { c as createBookingEntity, R as ReferralSource, D as DetailedSkillLevel, S as SkillLevel, C as CourseType, G as Gender } from './chunks/booking.entity_B7ROh_NS.mjs';
import { c as createUrlQr } from './chunks/index_CKRDITY1.mjs';
import { auth, calendar } from '@googleapis/calendar';
import { G as GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, a as GOOGLE_SERVICE_ACCOUNT_EMAIL, b as GOOGLE_CALENDAR_ID, c as GOOGLE_APP_PASSWORD, S as SENDER_NET_ACCESS_TOKEN } from './chunks/server_BrWQYfF7.mjs';
import { u as useTranslations } from './chunks/utils_Bi7ZFkQJ.mjs';
import nodemailer from 'nodemailer';
import { l as logo } from './chunks/FaunaKite_LogoBlanco-03_kZLZTqr_.mjs';
import { d as defineAction } from './chunks/server_DCgRcbzF.mjs';
import { A as ActionError } from './chunks/astro-designed-error-pages_CrRPH3XS.mjs';

async function createBookingUseCase(dependencies, input) {
  const { bookingRepository } = dependencies;
  const booking = createBookingEntity(input);
  const bookingId = await bookingRepository.create(booking);
  const persistedBooking = { ...booking, id: bookingId };
  return {
    bookingId,
    booking: persistedBooking,
    message: `Booking created successfully for ${input.customerName}`
  };
}
function createBookingUseCaseFactory(dependencies) {
  return (input) => createBookingUseCase(dependencies, input);
}

const createBooking = createBookingUseCaseFactory({
  bookingRepository: GoogleSheetsBookingRepository
});

class GoogleCalendarError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.name = "GoogleCalendarError";
  }
}
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly"
];
class GoogleCalendarClient {
  calendar;
  config;
  constructor(config) {
    this.config = config;
    this.calendar = this.initializeClient();
  }
  initializeClient() {
    try {
      const authentication = new auth.GoogleAuth({
        credentials: this.config.credentials,
        scopes: SCOPES
      });
      return calendar({ version: "v3", auth: authentication });
    } catch (error) {
      throw new GoogleCalendarError(
        "Failed to initialize Google Sheets client",
        void 0,
        error
      );
    }
  }
  async createEvent(event) {
    try {
      const response = await this.calendar.events.insert({
        calendarId: this.config.calendarId,
        requestBody: event,
        sendUpdates: "all"
        // Send notifications to attendees
      });
      return {
        success: true,
        eventId: response.data.id,
        eventLink: response.data.htmlLink,
        data: response.data
      };
    } catch (error) {
      this.handleApiError("Failed to create event", error);
    }
  }
  handleApiError(message, error) {
    console.error("Google Calendar API Error:", error);
    let statusCode;
    let details = "Unknown error";
    if (error && typeof error === "object" && "status" in error) {
      statusCode = error.status;
    }
    if (error && typeof error === "object" && "message" in error) {
      details = error.message;
    }
    throw new GoogleCalendarError(`${message}: ${details}`, statusCode, error);
  }
}

const calendarId = GOOGLE_CALENDAR_ID;
const clientEmail = GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
const googleCalendarClient = new GoogleCalendarClient({
  calendarId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n")
  }
});
async function createCalendarEvent(input) {
  const response = await googleCalendarClient.createEvent({
    summary: `${input.customerName} - ${input.courseType ?? ""} ${input.hoursReserved ?? ""}`,
    start: {
      dateTime: input.arrivalDate.toISOString(),
      timeZone: "America/Argentina/Buenos_Aires"
    },
    end: {
      dateTime: input.departureDate.toISOString(),
      timeZone: "America/Argentina/Buenos_Aires"
    },
    description: `
Alumno: ${input.customerName}
Teléfono: ${input.customerPhone}
Tipo de clase: ${input.courseType}
Horas reservadas: ${input.hoursReserved}
Estadía: ${input.arrivalDate.toISOString()} → ${input.departureDate.toISOString()}
Hora de llegada: ${input.arrivalTime}
Hora de partida: ${input.departureTime}
Peso (kg): ${input.weightKg}
Altura (cm): ${input.heightCm}
Nivel actual: ${input.currentLevel}
Objetivo principal: ${input.mainObjective}
Notas: ${input.additionalNotes}
            `
  });
  return response;
}

class NodemailerError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.name = "NodemailerError";
  }
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "faunacomunidad@gmail.com",
    pass: GOOGLE_APP_PASSWORD
  }
});
const sendMail = async (to, subject, template, qrBuffer) => {
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
          cid: "qrcode"
        }
      ]
    };
    const mail = await transporter.sendMail(mailOptions);
    return mail;
  } catch (error) {
    console.log("Failed to send mail", { error });
    throw new NodemailerError("Failed to send mail", void 0, error);
  }
};
function getBookingEmailTemplate() {
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
                            <img src="${logo.src}" alt="Fauna Kite Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />
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

const book = {
  createBooking: defineAction({
    accept: "form",
    input: z.object({
      // SECTION 1: Personal Data
      customerName: z.string().min(1, "El nombre es requerido"),
      birthDate: z.coerce.date(),
      gender: z.nativeEnum(Gender).optional(),
      customerEmail: z.string().email("Email inválido"),
      province: z.string().min(1, "La provincia es requerida"),
      customerPhone: z.string().optional(),
      // SECTION 2: Reservation Details
      courseType: z.nativeEnum(CourseType).optional(),
      hoursReserved: z.coerce.number().positive().optional(),
      arrivalDate: z.coerce.date().refine(
        (date) => {
          const arrival = new Date(date);
          arrival.setHours(0, 0, 0, 0);
          const today = /* @__PURE__ */ new Date();
          today.setHours(0, 0, 0, 0);
          return arrival > today;
        },
        {
          message: "Arrival date must be after today"
        }
      ),
      arrivalTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida"),
      departureDate: z.coerce.date(),
      departureTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida").optional(),
      // SECTION 3: Sports Profile
      weightKg: z.coerce.number().positive().optional(),
      heightCm: z.coerce.number().positive().optional(),
      currentLevel: z.nativeEnum(SkillLevel).optional(),
      // SECTION 4: Detailed Skill Level
      detailedSkillLevel: z.nativeEnum(DetailedSkillLevel).optional(),
      // SECTION 5: Goals & Preferences
      mainObjective: z.string().optional(),
      additionalNotes: z.string().optional(),
      // SECTION 6: Marketing
      referralSource: z.nativeEnum(ReferralSource).optional(),
      referralSourceOther: z.string().optional(),
      newsletterOptIn: z.coerce.boolean().default(false)
    }).refine((data) => data.departureDate > data.arrivalDate, {
      message: "Departure date must be after arrival date",
      path: ["departureDate"]
    }),
    handler: async (input, context) => {
      let bookingResult;
      try {
        bookingResult = await createBooking(input);
      } catch (error) {
        console.error("[BOOKING FORM ERROR] create booking:", error);
        const t = useTranslations(context.currentLocale);
        if (error instanceof Error && error.message.includes("Invalid")) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: error.message
          });
        }
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: t("booked.error.internal-server")
        });
      }
      try {
        await createCalendarEvent(input);
      } catch (error) {
        console.error("[BOOKING FORM ERROR] create calendar event:", error);
        if (error instanceof GoogleCalendarError) {
          console.log("GOOGLE CALENDAR EVENT NOT CREATED");
        }
      }
      try {
        const qrBuffer = await createUrlQr(
          `http://localhost:4321/es/verify/${bookingResult.bookingId}`
        );
        const template = getBookingEmailTemplate();
        await sendMail(input.customerEmail, "Bienvenido!", template, qrBuffer);
      } catch (error) {
        console.error("[BOOKING FORM ERROR] send email to customer:", error);
        if (error instanceof NodemailerError) {
          console.log("EMAIL TO CUSTOMER NOT SENT");
        }
      }
      return {
        success: true
      };
    }
  })
};

const accessToken = SENDER_NET_ACCESS_TOKEN;
const url = new URL("https://api.sender.net/v2/subscribers");
let headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
  Accept: "application/json"
};
async function createSubscriber(data) {
  try {
    const result = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    const response = await result.json();
    return response;
  } catch (error) {
    console.log("[SENDER NET] CREATE SUBSCRIBER ERROR:", error);
    return {
      success: false,
      message: "Error al crear el suscriptor",
      data: null
    };
  }
}

const newsletter = {
  subscribe: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email("Please enter a valid email address"),
      name: z.string().optional(),
      source: z.string().optional().default("website")
    }),
    handler: async (input) => {
      try {
        const result = await createSubscriber({
          email: input.email,
          firstname: input.name
        });
        if (!result.success) {
          throw new Error(result.message);
        }
        return {
          success: true,
          message: result.message,
          subscriptionId: result.data.id
        };
      } catch (error) {
        console.error("Newsletter subscription error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to subscribe to newsletter. Please try again.";
        throw new Error(errorMessage);
      }
    }
  })
};

const server = {
  book,
  newsletter
};

export { server };
