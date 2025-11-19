import { auth, type calendar_v3, calendar } from "@googleapis/calendar";

export interface GoogleCalendarConfig {
  calendarId: string;
  credentials: {
    client_email: string;
    private_key: string;
  };
}

export class GoogleCalendarError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "GoogleCalendarError";
  }
}

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

export interface CalendarEvent {
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string; // ISO 8601 format
    timeZone?: string;
  };
  end: {
    dateTime: string; // ISO 8601 format
    timeZone?: string;
  };
  attendees?: Array<{ email: string }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{ method: "email" | "popup"; minutes: number }>;
  };
}

export class GoogleCalendarClient {
  private calendar;
  private config: GoogleCalendarConfig;

  constructor(config: GoogleCalendarConfig) {
    this.config = config;
    this.calendar = this.initializeClient();
  }

  private initializeClient(): calendar_v3.Calendar {
    try {
      const authentication = new auth.GoogleAuth({
        credentials: this.config.credentials,
        scopes: SCOPES,
      });

      return calendar({ version: "v3", auth: authentication });
    } catch (error) {
      throw new GoogleCalendarError(
        "Failed to initialize Google Sheets client",
        undefined,
        error
      );
    }
  }

  async createEvent(event: CalendarEvent): Promise<{
    success: boolean;
    eventId?: string;
    eventLink?: string;
    data?: calendar_v3.Schema$Event;
    error?: string;
    code?: number;
  }> {
    try {
      const response = await this.calendar.events.insert({
        calendarId: this.config.calendarId,
        requestBody: event,
        sendUpdates: "all", // Send notifications to attendees
      });

      return {
        success: true,
        eventId: response.data.id!,
        eventLink: response.data.htmlLink!,
        data: response.data,
      };
    } catch (error: any) {
      this.handleApiError("Failed to create event", error);
    }
  }

  private handleApiError(message: string, error: unknown): never {
    console.error("Google Calendar API Error:", error);

    let statusCode: number | undefined;
    let details = "Unknown error";

    if (error && typeof error === "object" && "status" in error) {
      statusCode = error.status as number;
    }

    if (error && typeof error === "object" && "message" in error) {
      details = error.message as string;
    }

    throw new GoogleCalendarError(`${message}: ${details}`, statusCode, error);
  }
}
