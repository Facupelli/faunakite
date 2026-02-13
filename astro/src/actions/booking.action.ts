import { defineAction } from "astro:actions";
import { ActionError } from "astro:actions";
import { createBooking } from "../modules/booking/use-cases/create-booking";
import { createUrlQr, QrGenerationError } from "../modules/booking/qr-code";
import { GoogleCalendarError } from "../modules/booking/google-calendar/google-calendar-client";
import { createCalendarEvent } from "../modules/booking/google-calendar/create-event";
import { useTranslations } from "../i18n/utils";
import {
  getBookingEmailTemplate,
  NodemailerError,
  sendMail,
} from "../modules/booking/nodemailer/utils";
import type { CreateBookingResult } from "../modules/booking/use-cases/create-booking.use-case";
import {
  createBookingCreationProblem,
  createCalendarEventProblem,
  createEmailDeliveryProblem,
  createInvalidInputProblem,
  createQRGenerationProblem,
  formatProblemForLog,
  generateCorrelationId,
} from "../problem-details";
import { notifyDeveloper, notifyDeveloperSafe } from "../error-notification";
import { reservationSchema } from "../components/booking/booking-form.schema";
import { logCanonicalLine, type BookingContext } from "./booking.action.types";

const SITE_URL = import.meta.env.SITE_URL;

// TODO: make idempotent
export const book = {
  createBooking: defineAction({
    accept: "form",
    input: reservationSchema,
    handler: async (input, context) => {
      const correlationId = generateCorrelationId();

      const bookingContext: BookingContext = {
        correlation_id: correlationId,
        customer_email: input.customerEmail,
        arrival_date: input.arrivalDate,
        departure_date: input.departureDate,
        locale: input.locale,
        started_at: Date.now(),
        result: "success",
        steps: {},
        degraded_services: [],
      };

      // ═══════════════════════════════════════════════════════════════════
      // STEP 1: CAPTCHA VERIFICATION (CRITICAL)
      // ═══════════════════════════════════════════════════════════════════
      // const turnstileToken = input["cf-turnstile-response"];

      // try {
      //   const verificationResponse = await fetch(
      //     "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      //     {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({
      //         secret: TURNSTILE_BOOKED_SECRET_KEY,
      //         response: turnstileToken,
      //       }),
      //     },
      //   );

      //   const verification = await verificationResponse.json();

      //   if (!verification.success) {
      //     const problem = createCaptchaVerificationProblem(
      //       `Turnstile verification failed. Success: ${verification.success}. Error codes: ${verification["error-codes"]?.join(", ") || "none"}`,
      //       correlationId,
      //     );

      //     await notifyDeveloperSafe(
      //       problem,
      //       new Error(
      //         `Turnstile verification failed: ${JSON.stringify(verification)}`,
      //       ),
      //     );

      //     console.error(formatProblemForLog(problem));

      //     throw new ActionError({
      //       code: "BAD_REQUEST",
      //       message: "Captcha verification failed. Please try again.",
      //     });
      //   }
      // } catch (error) {
      //   if (error instanceof ActionError) {
      //     throw error;
      //   }

      //   const problem = createCaptchaVerificationProblem(
      //     `Unexpected error during captcha verification: ${error instanceof Error ? error.message : "Unknown error"}`,
      //     correlationId,
      //   );

      //   await notifyDeveloper(problem, error);
      //   console.error(formatProblemForLog(problem));

      //   throw new ActionError({
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Captcha Error",
      //   });
      // }

      // ═══════════════════════════════════════════════════════════════════
      // STEP 2: BOOKING CREATION (CRITICAL)
      // ═══════════════════════════════════════════════════════════════════
      let bookingResult: CreateBookingResult | undefined;

      try {
        bookingResult = await createBooking(input);

        bookingContext.steps.booking_creation = {
          success: true,
        };
        bookingContext.booking_id = bookingResult.bookingId;
      } catch (error) {
        const t = useTranslations(context.currentLocale as "es" | "en");

        // Check if it's a validation error from the use case
        if (error instanceof Error && error.message.includes("Invalid")) {
          const problem = createInvalidInputProblem(
            error.message,
            correlationId,
            { inputData: { ...input, "cf-turnstile-response": "[REDACTED]" } },
          );

          throw new ActionError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        const problem = createBookingCreationProblem(
          `Booking creation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          correlationId,
          {
            customerEmail: input.customerEmail,
            arrivalDate: input.arrivalDate,
            departureDate: input.departureDate,
          },
        );

        await notifyDeveloper(problem, error);

        bookingContext.steps.booking_creation = {
          success: false,
          error: problem,
        };

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: t("booked.error.internal-server"),
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // STEP 3: CALENDAR EVENT CREATION
      // ═══════════════════════════════════════════════════════════════════
      try {
        await createCalendarEvent(input);

        bookingContext.steps.calendar_event = {
          success: true,
        };
      } catch (error) {
        const problem = createCalendarEventProblem(
          `Calendar event creation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          correlationId,
          bookingResult.bookingId,
        );

        await notifyDeveloperSafe(problem, error);

        bookingContext.steps.calendar_event = {
          success: false,
          error: problem,
        };
      }

      // ═══════════════════════════════════════════════════════════════════
      // STEP 4: QR CODE & EMAIL DELIVERY
      // ═══════════════════════════════════════════════════════════════════
      try {
        const qrBuffer = await createUrlQr(
          `${SITE_URL}/es/verify/${bookingResult.bookingId}`,
        );

        bookingContext.steps.qr_generation = {
          success: true,
        };

        const template = getBookingEmailTemplate(input.locale);
        await sendMail({
          to: input.customerEmail,
          subject: "Bienvenido!",
          html: template,
          attachments: [
            {
              content: qrBuffer,
              filename: "qrcode.png",
              cid: "qrcode",
            },
          ],
        });

        bookingContext.steps.email_delivery = {
          success: true,
        };
      } catch (error) {
        if (error instanceof QrGenerationError) {
          const problem = createQRGenerationProblem(
            `QR code generation failed: ${error.message}`,
            correlationId,
            bookingResult.bookingId,
          );

          bookingContext.steps.qr_generation = {
            success: false,
            error: problem,
          };
        } else if (error instanceof NodemailerError) {
          const problem = createEmailDeliveryProblem(
            `Email delivery failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            correlationId,
            bookingResult.bookingId,
            input.customerEmail,
          );

          bookingContext.steps.email_delivery = {
            success: false,
            error: problem,
          };

          await notifyDeveloperSafe(problem, error);
        } else {
          const problem = createEmailDeliveryProblem(
            `QR/Email delivery failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            correlationId,
            bookingResult.bookingId,
            input.customerEmail,
          );

          await notifyDeveloperSafe(problem, error);

          bookingContext.steps.qr_generation = {
            success: false,
          };

          bookingContext.steps.email_delivery = {
            success: false,
            error: problem,
          };

          bookingContext.degraded_services.push(
            "qr_generation",
            "email_delivery",
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════
      // SUCCESS - BOOKING COMPLETED
      // ═══════════════════════════════════════════════════════════════════
      logCanonicalLine(bookingContext);

      return {
        success: true,
        bookingId: bookingResult.bookingId,
        correlationId,
      };
    },
  }),
};
