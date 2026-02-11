import type { CreateBookingData } from "../booking.entity";
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
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const descriptionLines = [
    `Alumno: ${input.customerName}`,
    input.customerPhone && `Teléfono: ${input.customerPhone}`,
    input.courseType && `Tipo de clase: ${input.courseType}`,
    input.hoursReserved && `Horas reservadas: ${input.hoursReserved}`,
    input.arrivalDate &&
      `Estadía: ${formatDate(input.arrivalDate)} → ${formatDate(input.departureDate)}`,
    input.arrivalTime && `Hora de llegada: ${input.arrivalTime} hs`,
    input.departureTime && `Hora de partida: ${input.departureTime} hs`,
    input.weightKg && `Peso (kg): ${input.weightKg}`,
    input.heightCm && `Altura (cm): ${input.heightCm}`,
    input.currentLevel && `Nivel actual: ${input.currentLevel}`,
    input.mainObjective && `Objetivo principal: ${input.mainObjective}`,
    input.additionalNotes && `Notas: ${input.additionalNotes}`,
  ].filter(Boolean);

  const response = await googleCalendarClient.createEvent({
    summary: `${input.customerName} - ${input.courseType ?? ""} ${input.hoursReserved && `${input.hoursReserved}hs`}`,
    start: {
      dateTime: input.arrivalDate.toISOString(),
      timeZone: "America/Argentina/Buenos_Aires",
    },
    end: {
      dateTime: input.departureDate.toISOString(),
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
