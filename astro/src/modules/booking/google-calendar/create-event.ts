import {
  CourseMode,
  CourseModeDict,
  CourseTypeDict,
  type CourseType,
  type CreateBookingData,
} from "../booking.entity";
import { GoogleCalendarClient } from "./google-calendar-client";
import {
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_CALENDAR_ID,
} from "astro:env/server";

const calendarId = GOOGLE_CALENDAR_ID;
const clientEmail = GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

const googleCalendarClient = new GoogleCalendarClient({
  calendarId: calendarId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  },
});

export async function createCalendarEvent(input: CreateBookingData) {
  const createLocalDateTimeString = (dateStr: string, timeStr: string) => {
    return `${dateStr}T${timeStr}:00`;
  };

  const formatDateDisplay = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const descriptionLines = [
    `Alumno: ${input.customerName}`,
    input.customerPhone && `Teléfono: ${input.customerPhone}`,
    input.courseType && `Tipo de clase: ${CourseTypeDict[input.courseType]}`,
    input.courseMode != undefined &&
      `Modalidad: ${CourseModeDict[input.courseMode]}`,
    input.hoursReserved && `Horas reservadas: ${input.hoursReserved}`,
    input.arrivalDate &&
      `Estadía: ${formatDateDisplay(input.arrivalDate)} → ${formatDateDisplay(input.departureDate)}`,
    input.arrivalTime && `Hora de llegada: ${input.arrivalTime} hs`,
    input.departureTime && `Hora de partida: ${input.departureTime} hs`,
    input.weightKg && `Peso (kg): ${input.weightKg}`,
    input.heightCm && `Altura (cm): ${input.heightCm}`,
    input.currentLevel && `Nivel actual: ${input.currentLevel}`,
    input.mainObjective && `Objetivo principal: ${input.mainObjective}`,
    input.additionalNotes && `Notas: ${input.additionalNotes}`,
  ].filter(Boolean);

  const buildSummary = (
    customerName: string,
    courseType: CourseType | null | undefined,
    courseMode: CourseMode | null | undefined,
  ) => {
    let text = `${customerName}`;

    if (courseType != undefined) {
      text += ` - ${CourseTypeDict[courseType]}`;
    }

    if (courseMode != undefined) {
      text += ` - ${CourseModeDict[courseMode]}`;
    }

    return text;
  };

  const response = await googleCalendarClient.createEvent({
    summary: buildSummary(
      input.customerName,
      input.courseType,
      input.courseMode,
    ),
    start: {
      dateTime: createLocalDateTimeString(input.arrivalDate, input.arrivalTime),
      timeZone: "America/Argentina/Buenos_Aires",
    },
    end: {
      dateTime: createLocalDateTimeString(
        input.departureDate,
        input.departureTime,
      ),
      timeZone: "America/Argentina/Buenos_Aires",
    },
    description: descriptionLines.join("\n"),
  });

  return response;
}

export async function listAccessibleCalendars() {
  try {
    const response = await googleCalendarClient.listCalendars();
    console.log("Accessible calendars:", response);
    return response;
  } catch (error) {
    console.error("Failed to list calendars:", error);
    throw error;
  }
}
