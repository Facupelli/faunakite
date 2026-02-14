import { GoogleAuth, handleFetchError } from "../google-auth";

export interface GoogleCalendarConfig {
  calendarId: string;
  credentials: {
    client_email: string;
    private_key: string;
  };
}

// Basic interface for Event data.
// Since we removed the heavy library, we define the shape we need.
export interface CalendarEvent {
  id?: string;
  htmlLink?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
  attendees?: Array<{ email: string; responseStatus?: string }>;
  [key: string]: unknown; // Allow other API properties
}

export class GoogleCalendarError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown,
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

export class GoogleCalendarClient {
  private config: GoogleCalendarConfig;
  private auth: GoogleAuth;

  constructor(config: GoogleCalendarConfig) {
    this.config = config;
    this.auth = new GoogleAuth(config.credentials, SCOPES);
  }

  async listCalendars() {
    try {
      const token = await this.auth.getAccessToken();
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        await handleFetchError("Failed to list calendars", response);
      }

      const data = (await response.json()) as { items?: unknown[] };
      return data.items;
    } catch (error) {
      this.handleError("Failed to list calendars", error);
    }
  }

  async createEvent(event: CalendarEvent): Promise<{
    success: boolean;
    eventId?: string;
    eventLink?: string;
    data?: CalendarEvent;
    error?: string;
    code?: number;
  }> {
    try {
      const token = await this.auth.getAccessToken();
      // sendUpdates is a query parameter in the REST API
      const url = `https://www.googleapis.com/calendar/v3/calendars/${this.config.calendarId}/events?sendUpdates=all`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        await handleFetchError("Failed to create event", response);
      }

      const createdEvent = (await response.json()) as CalendarEvent;

      return {
        success: true,
        eventId: createdEvent.id,
        eventLink: createdEvent.htmlLink,
        data: createdEvent,
      };
    } catch (error) {
      this.handleError("Failed to create event", error);
    }
  }

  private handleError(message: string, error: unknown): never {
    console.error("Google Calendar Client Error:", error);
    if (error instanceof Error) {
      throw new GoogleCalendarError(
        `${message}: ${error.message}`,
        undefined,
        error,
      );
    }
    throw new GoogleCalendarError(message, undefined, error);
  }
}
