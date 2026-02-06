import { z } from "astro/zod";
import {
  Gender,
  CourseType,
  DetailedSkillLevel,
  SkillLevel,
  ReferralSource,
} from "../../modules/booking/booking.entity";

export const reservationSchema = z
  .object({
    // "cf-turnstile-response": z.string().min(1, "Captcha verification required"),
    locale: z.enum(["es", "en"]),
    // SECTION 1: Personal Data
    customerName: z.string().min(1, "El nombre es requerido"),
    birthDate: z.coerce.date(),
    gender: z
      .preprocess(
        (val) => (val === "" ? undefined : val),
        z.nativeEnum(Gender).optional(),
      )
      .nullish(),
    customerEmail: z.string().email("Email inválido"),
    province: z.string().min(1, "La provincia es requerida"),
    customerPhone: z.string().optional(),

    // SECTION 2: Reservation Details
    courseType: z
      .preprocess(
        (val) => (val === "" ? undefined : val),
        z.nativeEnum(CourseType).optional(),
      )
      .nullish(),
    hoursReserved: z.coerce.number().optional(),
    arrivalDate: z.coerce.date().refine(
      (date) => {
        const arrival = new Date(date);
        arrival.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return arrival > today;
      },
      { message: "Arrival date must be after today" },
    ),
    arrivalTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida"),
    departureDate: z.coerce.date(),
    departureTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida"),
    // SECTION 3: Sports Profile
    weightKg: z.coerce.number().optional(),
    heightCm: z.coerce.number().optional(),
    currentLevel: z
      .preprocess(
        (val) => (val === "" ? undefined : val),
        z.nativeEnum(SkillLevel).optional(),
      )
      .nullish(),

    // SECTION 4: Detailed Skill Level
    detailedSkillLevel: z
      .preprocess(
        (val) => (val === "" ? undefined : val),
        z.nativeEnum(DetailedSkillLevel).optional(),
      )
      .nullish(),

    // SECTION 5: Goals & Preferences
    mainObjective: z.string().optional(),
    additionalNotes: z.string().optional(),

    // SECTION 6: Marketing
    referralSource: z
      .preprocess(
        (val) => (val === "" ? undefined : val),
        z.nativeEnum(ReferralSource).optional(),
      )
      .nullish(),
    referralSourceOther: z.string().optional(),
    newsletterOptIn: z.coerce.boolean().default(false),
  })
  .refine((data) => data.departureDate > data.arrivalDate, {
    message: "Departure date must be after arrival date",
    path: ["departureDate"],
  });

export type ReservationFormData = z.infer<typeof reservationSchema>;
