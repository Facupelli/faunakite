import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { ActionError } from "astro:actions";
import { createBooking } from "../modules/booking/use-cases/create-booking";
import {
  CourseType,
  DetailedSkillLevel,
  Gender,
  ReferralSource,
  SkillLevel,
} from "../modules/booking/booking.entity";
import { createUrlQr } from "../modules/booking/qr-code";
import { GoogleCalendarError } from "../modules/booking/google-calendar/google-calendar-client";
import { createCalendarEvent } from "../modules/booking/google-calendar/create-event";
import { useTranslations } from "../i18n/utils";
import {
  getBookingEmailTemplate,
  NodemailerError,
  sendMail,
} from "../modules/booking/nodemailer/utils";
import type { CreateBookingResult } from "../modules/booking/use-cases/create-booking.use-case";
import { TURNSTILE_BOOKED_SECRET_KEY } from "astro:env/server";
import { SITE_URL } from "astro:env/client";
import {
  createBookingCreationProblem,
  createCalendarEventProblem,
  createCaptchaVerificationProblem,
  createEmailDeliveryProblem,
  createInvalidInputProblem,
  formatProblemForLog,
  generateCorrelationId,
} from "../problem-details";
import { notifyDeveloper, notifyDeveloperSafe } from "../error-notification";
import { reservationSchema } from "../components/booking/booking-form.schema";

// TODO: make idempotent
export const book = {
  createBooking: defineAction({
    accept: "form",
    input: reservationSchema,
    handler: async (input, context) => {
      const correlationId = generateCorrelationId();

      console.log(
        `[BOOKING START] Correlation ID: ${correlationId}, Email: ${input.customerEmail}`,
      );

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
        console.log(
          `[BOOKING SUCCESS] ID: ${bookingResult.bookingId}, Correlation ID: ${correlationId}`,
        );
      } catch (error) {
        const t = useTranslations(context.currentLocale as "es" | "en");

        // Check if it's a validation error from the use case
        if (error instanceof Error && error.message.includes("Invalid")) {
          const problem = createInvalidInputProblem(
            error.message,
            correlationId,
            { inputData: { ...input, "cf-turnstile-response": "[REDACTED]" } },
          );

          // Validation errors might not need immediate notification (user error)
          // but we log them for analysis
          console.error(formatProblemForLog(problem));

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
            arrivalDate: input.arrivalDate.toISOString(),
            departureDate: input.departureDate.toISOString(),
          },
        );

        await notifyDeveloper(problem, error);
        console.error(formatProblemForLog(problem));

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: t("booked.error.internal-server"),
        });
      }

      // ═══════════════════════════════════════════════════════════════════
      // STEP 3: CALENDAR EVENT CREATION (DEGRADED - NOT CRITICAL)
      // ═══════════════════════════════════════════════════════════════════
      try {
        await createCalendarEvent(input);
        console.log(
          `[CALENDAR SUCCESS] Booking ID: ${bookingResult.bookingId}, Correlation ID: ${correlationId}`,
        );
      } catch (error) {
        const problem = createCalendarEventProblem(
          `Calendar event creation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          correlationId,
          bookingResult.bookingId,
        );

        await notifyDeveloperSafe(problem, error);
        console.error(formatProblemForLog(problem));

        if (error instanceof GoogleCalendarError) {
          console.error(
            `[DEGRADED SERVICE] Google Calendar error: ${error.message}`,
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════
      // STEP 4: QR CODE & EMAIL DELIVERY (DEGRADED - NOT CRITICAL)
      // ═══════════════════════════════════════════════════════════════════
      try {
        const qrBuffer = await createUrlQr(
          `${SITE_URL}/es/verify/${bookingResult.bookingId}`,
        );

        console.log(
          `[QR CODE SUCCESS] Booking ID: ${bookingResult.bookingId}, Correlation ID: ${correlationId}`,
        );

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

        console.log(
          `[EMAIL SUCCESS] Sent to: ${input.customerEmail}, Booking ID: ${bookingResult.bookingId}, Correlation ID: ${correlationId}`,
        );
      } catch (error) {
        const problem = createEmailDeliveryProblem(
          `Email delivery failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          correlationId,
          bookingResult.bookingId,
          input.customerEmail,
        );

        await notifyDeveloperSafe(problem, error);
        console.error(formatProblemForLog(problem));

        if (error instanceof NodemailerError) {
          console.error(
            `[DEGRADED SERVICE] Email delivery error: ${error.message}`,
          );
        }
      }

      // ═══════════════════════════════════════════════════════════════════
      // SUCCESS - BOOKING COMPLETED
      // ═══════════════════════════════════════════════════════════════════
      console.log(
        `[BOOKING COMPLETE] ID: ${bookingResult.bookingId}, Correlation ID: ${correlationId}`,
      );

      return {
        success: true,
        bookingId: bookingResult.bookingId,
        correlationId,
      };
    },
  }),
};
