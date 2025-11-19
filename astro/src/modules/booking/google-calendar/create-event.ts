import type { CreateBookingData } from "../booking.entity";
import { GoogleCalendarClient } from "./google-calendar-client";

const calendarId = import.meta.env.GOOGLE_CALENDAR_ID;
const clientEmail = import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = import.meta.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

if (!calendarId || !clientEmail || !privateKey) {
  throw new Error("Missing required Google Sheets configuration");
}

const googleCalendarClient = new GoogleCalendarClient({
  calendarId: calendarId,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  },
});

export async function createCalendarEvent(input: CreateBookingData) {
  const response = await googleCalendarClient.createEvent({
    summary: `${input.customerName} - ${input.courseType ?? ""} ${input.hoursReserved ?? ""}`,
    start: {
      dateTime: input.arrivalDate.toISOString(),
      timeZone: "America/Argentina/Buenos_Aires",
    },
    end: {
      dateTime: input.departureDate.toISOString(),
      timeZone: "America/Argentina/Buenos_Aires",
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
            `,
  });

  return response;
}
