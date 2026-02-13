import { z } from "astro/zod";
import {
  Gender,
  CourseType,
  DetailedSkillLevel,
  SkillLevel,
  ReferralSource,
  MainObjective,
  CourseMode,
} from "../../modules/booking/booking.entity";

const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

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
    courseMode: z
      .preprocess(
        (val) => (val === "" ? undefined : val),
        z.nativeEnum(CourseMode).optional(),
      )
      .nullish(),
    hoursReserved: z.coerce.number().optional(),
    arrivalDate: z.string().refine(
      (val) => {
        // Validate YYYY-MM-DD format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;

        const arrival = parseLocalDate(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return arrival > today;
      },
      { message: "Arrival date must be after today" },
    ),
    arrivalTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida"),
    departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
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
    mainObjective: z
      .preprocess(
        (val) => (val === "" ? undefined : val),
        z.nativeEnum(MainObjective).optional(),
      )
      .nullish(),
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
  })
  .refine(
    (data) => {
      if (
        data.courseType === CourseType.ZERO_TO_HERO ||
        data.courseType === CourseType.INITIAL
      ) {
        return data.courseMode !== undefined && data.courseMode !== null;
      }
      return true;
    },
    {
      message: "Please select a course mode",
      path: ["courseMode"],
    },
  );

export type ReservationFormData = z.infer<typeof reservationSchema>;
