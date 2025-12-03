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

// TODO: make idempotent
export const book = {
  createBooking: defineAction({
    accept: "form",
    input: z
      .object({
        "cf-turnstile-response": z
          .string()
          .min(1, "Captcha verification required"),
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

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return arrival > today;
          },
          {
            message: "Arrival date must be after today",
          }
        ),
        arrivalTime: z
          .string()
          .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida"),
        departureDate: z.coerce.date(),
        departureTime: z
          .string()
          .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida")
          .optional(),

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
        newsletterOptIn: z.coerce.boolean().default(false),
      })
      .refine((data) => data.departureDate > data.arrivalDate, {
        message: "Departure date must be after arrival date",
        path: ["departureDate"],
      }),
    handler: async (input, context) => {
      const turnstileToken = input["cf-turnstile-response"];

      console.log({ turnstileToken });

      try {
        const verificationResponse = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secret: TURNSTILE_BOOKED_SECRET_KEY,
              response: turnstileToken,
            }),
          }
        );

        const verification = await verificationResponse.json();

        console.log({ verification });

        if (!verification.success) {
          throw new Error("Captcha verification failed");
        }
      } catch (error) {
        console.error("Turnstile validation error:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Captcha Error",
        });
      }

      let bookingResult: CreateBookingResult | undefined;

      try {
        bookingResult = await createBooking(input);
      } catch (error) {
        console.error("[BOOKING FORM ERROR] create booking:", error);

        const t = useTranslations(context.currentLocale as "es" | "en");

        if (error instanceof Error && error.message.includes("Invalid")) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: t("booked.error.internal-server"),
        });
      }

      try {
        await createCalendarEvent(input);
      } catch (error) {
        console.error("[BOOKING FORM ERROR] create calendar event:", error);

        if (error instanceof GoogleCalendarError) {
          console.log("GOOGLE CALENDAR EVENT NOT CREATED");
          // TODO: send email to admin
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
          // TODO: send email to admin
        }
      }

      return {
        success: true,
      };
    },
  }),
};
