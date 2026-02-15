import {
  getGoogleCalendarConfig,
  getGoogleServiceAccountKeys,
} from "../../utils/google-cloud";
import {
  CourseMode,
  CourseModeDict,
  CourseTypeDict,
  type CourseType,
  type CreateBookingData,
} from "../booking.entity";
import { GoogleCalendarClient } from "./google-calendar-client";

const { clientEmail, privateKey } = getGoogleServiceAccountKeys();
const { calendarId } = getGoogleCalendarConfig();

const googleCalendarClient = new GoogleCalendarClient({
  calendarId: calendarId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  },
});

export async function createCalendarEvent(input: CreateBookingData) {
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

  const calculateExclusiveEndDate = (departureDate: string): string => {
    const date = new Date(departureDate);
    date.setDate(date.getDate() + 1);

    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const response = await googleCalendarClient.createEvent({
    summary: buildSummary(
      input.customerName,
      input.courseType,
      input.courseMode,
    ),
    start: {
      date: input.arrivalDate,
      timeZone: "America/Argentina/Buenos_Aires",
    },
    end: {
      date: calculateExclusiveEndDate(input.departureDate),
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
