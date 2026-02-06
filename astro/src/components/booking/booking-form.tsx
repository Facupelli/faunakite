import {
  CourseType,
  DetailedSkillLevel,
  Gender,
  ReferralSource,
  SkillLevel,
} from "../../modules/booking/booking.entity";
import type { StepConfig } from "../multi-step-form/use-multi-step-form";
import { useForm } from "react-hook-form";
import { MultiStepForm } from "../multi-step-form/multi-step-form";
import { FormProgressBar } from "../multi-step-form/form-progess-bar";
import { FormStep } from "../multi-step-form/form-step";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormNavigation } from "../multi-step-form/form-navigation";
import { useState } from "react";
import { useEnumTranslations, useTranslations } from "../../i18n/utils";
import {
  reservationSchema,
  type ReservationFormData,
} from "./booking-form.schema";
import { navigate } from "astro:transitions/client";

const stepsConfig: StepConfig<ReservationFormData>[] = [
  {
    step: 1,
    label: "Personal Data",
    description: "Basic information and contact details",
    fields: [
      "customerName",
      "birthDate",
      "gender",
      "customerEmail",
      "province",
      "customerPhone",
    ],
  },
  {
    step: 2,
    label: "Reservation Details",
    description: "Dates and course information",
    fields: [
      "courseType",
      "hoursReserved",
      "arrivalDate",
      "arrivalTime",
      "departureDate",
      "departureTime",
    ],
  },
  {
    step: 3,
    label: "Sports Profile",
    description: "Physical stats and skill level",
    fields: ["weightKg", "heightCm", "currentLevel"],
  },
  {
    step: 4,
    label: "Skill Level & Goals",
    description: "Detailed skill assessment and goals",
    fields: ["detailedSkillLevel", "mainObjective", "additionalNotes"],
  },
  {
    step: 5,
    label: "Marketing",
    description: "How did you find us?",
    fields: [
      "referralSource",
      "referralSourceOther",
      "newsletterOptIn",
      "locale",
    ],
  },
];

// Main component
export function BookingForm({ lang }: { lang: "es" | "en" }) {
  const [showIntro, setShowIntro] = useState(true);

  const t = useTranslations(lang);
  const enumT = useEnumTranslations(lang);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    mode: "onChange", // Validate on change for better UX
    defaultValues: {
      locale: lang,
      newsletterOptIn: false,
    },
  });

  const onSubmit = async (data: ReservationFormData) => {
    console.log("Form submitted:", data);

    try {
      const formData = new FormData();

      const appendField = (key: string, value: any) => {
        if (value === undefined || value === null || value === "") {
          // For optional enums, don't append at all if empty
          // OR append empty string if your backend expects the key to exist
          return;
        }

        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false");
        } else if (typeof value === "number") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value);
        }
      };

      Object.entries(data).forEach(([key, value]) => {
        appendField(key, value);
      });

      const response = await fetch("/_actions/book.createBooking/", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const result = await response.json();

      form.reset();
      await navigate(`/${lang}/booked-success`);

      return result;
    } catch (error) {
      console.error(error);

      form.setError("root", {
        type: "manual",
        message:
          error instanceof Error ? error.message : "Failed to create booking",
      });

      throw error;
    }
  };

  const handleStepChange = (step: number) => {
    console.log("Navigated to step:", step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (showIntro) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="p-4 md:p-10 rounded-2xl shadow-news-card bg-[#082b38] border border-[#0a3a4b]">
          <div className="max-w-xl text-pretty mx-auto space-y-10 text-brand-blue">
            <div className="flex flex-col gap-2 items-center">
              <div className="bg-brand-light rounded-2xl p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="size-14 text-brand-blue"
                >
                  <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                  <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                  <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                </svg>
              </div>
              <p className="font-semibold text-white/60 tracking-widest text-sm">
                {t("booked.subtitle")}
              </p>
            </div>

            <div className="space-y-4 text-white text-center">
              <p className="text-3xl font-semibold">
                {t("booked.summary.1")} 🏄🏼‍♂️🏄🏼‍♀️🪁
              </p>
              <p className="text-pretty text-white/80">
                {t("booked.summary.2")} 🌬️🏜️
              </p>
              <div className="flex justify-center">
                <p className="px-6 py-2 border-brand-light border rounded-3xl text-sm bg-[#05202b] w-fit">
                  {t("booked.summary.3")} ⏳
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowIntro(false)}
              className="w-full py-3 px-4 bg-brand-light text-brand-blue font-semibold rounded-3xl"
            >
              {t("booked.start")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="p-4 md:p-10 rounded-2xl shadow-news-card bg-[#082b38] border border-[#0a3a4b]">
        <MultiStepForm
          form={form}
          lang={lang}
          totalSteps={5}
          steps={stepsConfig}
          onSubmit={onSubmit}
          onStepChange={handleStepChange}
          className="space-y-8"
        >
          {/* Progress Bar */}
          <FormProgressBar className="mb-8" showPercentage />

          {/* Step Indicator */}
          {/* <FormStepIndicator
            className="mb-12"
            showLabels
            enableClickNavigation={false}
          /> */}

          {/* Step 1: Personal Data */}
          <FormStep step={1}>
            <div className="space-y-6 text-brand-blue">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-bold text-white">
                  {t("booked.section1.title")}
                </h2>
                <p className="text-gray-400 text-left md:text-center text-pretty">
                  {t("booked.section1.subtitle")}
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section1.field.customerName.label")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...form.register("customerName")}
                  className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm ${form.formState.errors.customerName && "border-red-500"}`}
                  placeholder="Juan Pérez"
                />
                {form.formState.errors.customerName && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.customerName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...form.register("customerEmail")}
                  className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm ${form.formState.errors.customerEmail && "border-red-500"}`}
                  placeholder="john@example.com"
                />
                {form.formState.errors.customerEmail && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.customerEmail.message}
                  </p>
                )}
              </div>

              {/* Birth Date */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section1.field.birthDate.label")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...form.register("birthDate")}
                  className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm ${form.formState.errors.birthDate && "border-red-500"}`}
                />
                {form.formState.errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.birthDate.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section1.field.gender.label")}
                </label>
                <select
                  {...form.register("gender")}
                  className="block w-full rounded-2xl border h-10 px-4 bg-white/80 border-gray-30"
                >
                  <option value="">Seleccionar...</option>
                  <option value={Gender.MALE}>{enumT("gender.male")}</option>
                  <option value={Gender.FEMALE}>
                    {enumT("gender.female")}
                  </option>
                </select>
              </div>

              {/* Province */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section1.field.province.label")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...form.register("province")}
                  className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm ${form.formState.errors.province && "border-red-500"}`}
                  placeholder="California"
                />
                {form.formState.errors.province && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.province.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section1.field.customerPhone.label")}
                </label>
                <input
                  type="tel"
                  {...form.register("customerPhone")}
                  className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm ${form.formState.errors.province && "border-red-500"}`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </FormStep>

          {/* Step 2: Reservation Details */}
          <FormStep step={2}>
            <div className="space-y-6 text-brand-blue">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-bold text-white">
                  {t("booked.section2.title")}
                </h2>
                <p className="text-gray-400 text-left md:text-center text-pretty">
                  {t("booked.section2.subtitle")}
                </p>
              </div>

              {/* Course Type */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section2.field.courseType.label")}
                </label>
                <select
                  {...form.register("courseType")}
                  className={`block w-full rounded-2xl border h-10 px-4 bg-white/80 border-gray-30 ${form.formState.errors.courseType && "border-red-500"}`}
                >
                  {/* <!-- TODO: improve coupling with enums and translations--> */}
                  <option value="">
                    {t("booked.section2.field.courseType.placeholder")}
                  </option>
                  <option value={CourseType.INDIVIDUAL}>
                    {enumT("courseType.individual")}
                  </option>
                  <option value={CourseType.DOUBLE}>
                    {enumT("courseType.double")}
                  </option>
                  <option value={CourseType.INTENSIVE}>
                    {enumT("courseType.intensive")}
                  </option>
                  <option value={CourseType.INDIVIDUAL_CLASS}>
                    {enumT("courseType.individual_class")}
                  </option>
                  <option value={CourseType.ADVANCED}>
                    {enumT("courseType.advanced")}
                  </option>
                  <option value={CourseType.TEST}>
                    {enumT("courseType.test")}
                  </option>
                  <option value={CourseType.GUEST}>
                    {enumT("courseType.guest")}
                  </option>
                  <option value={CourseType.EQUIPMENT_RENTAL}>
                    {enumT("courseType.equipmentRental")}
                  </option>
                </select>
                {form.formState.errors.courseType && (
                  <p className="text-red-600 text-sm pt-1">
                    {form.formState.errors.courseType.message}
                  </p>
                )}
              </div>

              {/* Hours Reserved */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section2.field.hoursReserved.label")}
                </label>
                <input
                  type="number"
                  {...form.register("hoursReserved")}
                  className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm `}
                  placeholder="4"
                  min="1"
                />
              </div>

              {/* Arrival Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-white">
                    {t("booked.section2.field.arrivalDate.label")}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...form.register("arrivalDate")}
                    className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm ${form.formState.errors.arrivalDate && "border-red-500"}`}
                  />
                  {form.formState.errors.arrivalDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.arrivalDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-white">
                    {t("booked.section2.field.arrivalTime.label")}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    {...form.register("arrivalTime")}
                    className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm ${form.formState.errors.arrivalTime && "border-red-500"}`}
                  />
                  {form.formState.errors.arrivalTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.arrivalTime.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Departure Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-white">
                    {t("booked.section2.field.departureDate.label")}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...form.register("departureDate")}
                    className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm ${form.formState.errors.departureDate && "border-red-500"}`}
                  />
                  {form.formState.errors.departureDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.departureDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-white">
                    {t("booked.section2.field.departureTime.label")}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    {...form.register("departureTime")}
                    className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm `}
                  />
                </div>
              </div>
            </div>
          </FormStep>

          {/* Step 3: Sports Profile */}
          <FormStep step={3}>
            <div className="space-y-6 text-brand-blue">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-bold text-white">
                  {t("booked.section3.title")}
                </h2>
                <p className="text-gray-400 text-left md:text-center text-pretty">
                  {t("booked.section3.subtitle")}
                </p>
              </div>

              {/* Weight */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section3.field.weightKg.label")}
                </label>
                <input
                  type="number"
                  {...form.register("weightKg")}
                  className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm `}
                  placeholder="70"
                  min="1"
                />
              </div>

              {/* Height */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section3.field.heightCm.label")}
                </label>
                <input
                  type="number"
                  {...form.register("heightCm")}
                  className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm`}
                  placeholder="175"
                  min="1"
                />
              </div>

              {/* Current Level */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section3.field.currentLevel.label")}
                </label>
                <select
                  {...form.register("currentLevel")}
                  className="block w-full rounded-2xl border h-10 px-4 bg-white/80 border-gray-30"
                >
                  <option value="">
                    {t("booked.section3.field.currentLevel.placeholder")}
                  </option>
                  <option value={SkillLevel.BEGINNER}>
                    {enumT("skillLevel.beginner")}
                  </option>
                  <option value={SkillLevel.INTERMEDIATE}>
                    {enumT("skillLevel.intermediate")}
                  </option>
                  <option value={SkillLevel.ADVANCED}>
                    {enumT("skillLevel.advanced")}
                  </option>
                </select>
              </div>
            </div>
          </FormStep>

          {/* Step 4: Detailed Skill Level */}
          <FormStep step={4}>
            <div className="space-y-6 text-brand-blue">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-bold text-white">
                  {t("booked.section4.title")}
                </h2>
                <p className="text-gray-400 text-left md:text-center text-pretty">
                  {t("booked.section4.subtitle")}
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section4.field.detailedSkillLevel.label")}
                </label>
                <select
                  {...form.register("detailedSkillLevel")}
                  className="block w-full rounded-2xl border h-10 px-4 bg-white/80 border-gray-30"
                >
                  <option value="">Select...</option>
                  <option value={DetailedSkillLevel.THEORY_AND_SAFETY}>
                    {enumT("detailedSkillLevel.theoryAndSafety")}
                  </option>
                  <option value={DetailedSkillLevel.BODY_DRAGS}>
                    {enumT("detailedSkillLevel.bodyDrags")}
                  </option>
                  <option value={DetailedSkillLevel.WATER_START}>
                    {enumT("detailedSkillLevel.waterStart")}
                  </option>
                  <option value={DetailedSkillLevel.SHORT_RIDES}>
                    {enumT("detailedSkillLevel.shortRides")}
                  </option>
                  <option value={DetailedSkillLevel.NAVIGATION_WITH_DRIFT}>
                    {enumT("detailedSkillLevel.navigationWithDrift")}
                  </option>
                  <option
                    value={DetailedSkillLevel.UPWIND_LEARNING_TRANSITIONS}
                  >
                    {enumT("detailedSkillLevel.upwindLearningTransitions")}
                  </option>
                  <option value={DetailedSkillLevel.TRANSITIONS}>
                    {enumT("detailedSkillLevel.transitions")}
                  </option>
                  <option value={DetailedSkillLevel.SMALL_JUMPS}>
                    {enumT("detailedSkillLevel.smallJumps")}
                  </option>
                  <option
                    value={DetailedSkillLevel.CONTROLLED_JUMPS_AND_MANEUVERS}
                  >
                    {enumT("detailedSkillLevel.controlledJumpsAndManeuvers")}
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section5.field.mainObjective.label")}
                </label>
                <textarea
                  {...form.register("mainObjective")}
                  rows={3}
                  className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm `}
                  placeholder={t(
                    "booked.section5.field.mainObjective.placeholder",
                  )}
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section5.field.additionalNotes.label")}
                </label>
                <textarea
                  {...form.register("additionalNotes")}
                  rows={3}
                  className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm `}
                  placeholder={t(
                    "booked.section5.field.additionalNotes.placeholder",
                  )}
                />
              </div>
            </div>
          </FormStep>

          {/* Step 5: Goals & Preferences */}
          <FormStep step={5}>
            <div className="space-y-6 text-brand-blue">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-bold text-white">
                  {t("booked.section6.title")}
                </h2>
                <p className="text-gray-400 text-left md:text-center text-pretty">
                  {t("booked.section6.subtitle")}
                </p>
              </div>

              {/* Turnstile Captcha */}
              {/* <div
                className="cf-turnstile"
                data-sitekey={TURNSTILE_BOOKED_SITE_KEY}
                data-theme="light"
                data-size="normal"
              ></div>

              <input type="hidden" name="turnstileToken" id="turnstileToken" /> */}

              {/* Referral Source */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-white">
                  {t("booked.section6.field.referralSource.label")}
                </label>
                <select
                  {...form.register("referralSource")}
                  className="block w-full rounded-2xl border h-10 px-4 bg-white/80 border-gray-30"
                >
                  <option value="">Seleccionar...</option>
                  <option value={ReferralSource.INSTAGRAM}>Instagram</option>
                  <option value={ReferralSource.GOOGLE}>Google</option>
                  <option value={ReferralSource.RECOMMENDATION}>
                    {enumT("referralSource.recommendation")}
                  </option>
                  <option value={ReferralSource.CUESTA_DEL_VIENTO}>
                    {enumT("referralSource.cuesta_del_viento")}
                  </option>
                  <option value={ReferralSource.OTHER}>
                    {enumT("referralSource.other")}
                  </option>
                </select>
              </div>

              {/* Referral Source Other */}
              {form.watch("referralSource") === ReferralSource.OTHER && (
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-white">
                    {t("booked.section6.field.referralSourceOther.placeholder")}
                  </label>
                  <input
                    {...form.register("referralSourceOther")}
                    className={`block bg-white/80 py-2 px-4 w-full rounded-2xl border border-gray-300 shadow-sm `}
                  />
                </div>
              )}

              {/* Newsletter Opt-in */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletterOptIn"
                    type="checkbox"
                    {...form.register("newsletterOptIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="newsletterOptIn"
                    className="block text-sm font-semibold text-white"
                  >
                    {t("booked.section6.field.newsLetterOptIn.label")}
                  </label>
                  <p className="text-gray-500">
                    {t("booked.section6.field.newsLetterOptIn.description")}
                  </p>
                </div>
              </div>
            </div>
          </FormStep>

          <FormNavigation
            className="pt-2"
            backLabel={t("booked.button.previous")}
            nextLabel={t("booked.button.continue")}
            submitLabel={t("booked.button.submit")}
          />
        </MultiStepForm>
      </div>
    </div>
  );
}
