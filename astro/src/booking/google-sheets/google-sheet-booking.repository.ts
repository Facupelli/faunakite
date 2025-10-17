import { v4 as uuidv4 } from "uuid";
import { GoogleSheetsClient, GoogleSheetsError } from "./google-sheet-client";
import type { BookingRepository } from "../booking.repository";
import type { Booking } from "../booking.entity";
import { bookingMapper } from "./mappers/booking.mapper";

const spreadsheetId = import.meta.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const sheetName = "Bookings";
const clientEmail = import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = import.meta.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

if (!spreadsheetId || !clientEmail || !privateKey) {
  throw new Error("Missing required Google Sheets configuration");
}

const client = new GoogleSheetsClient({
  spreadsheetId,
  sheetName,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  },
});

export const GoogleSheetsBookingRepository: BookingRepository = {
  /**
   * Initialize sheet with proper headers if it's empty
   * Call this once during setup
   */
  // async initializeSheetHeaders(): Promise<void> {
  //   const headers = [
  //     "id",
  //     "customerEmail",
  //     "customerName",
  //     "customerPhone",
  //     "courseType",
  //     "startDate",
  //     "endDate",
  //     "status",
  //     "paymentStatus",
  //     "createdAt",
  //     "specialRequests",
  //   ];

  //   // Check if headers already exist
  //   const existingHeaders = await this.readHeaders();
  //   if (existingHeaders.length === 0) {
  //     await this.updateRange("A1:L1", [headers]);
  //   }
  // }

  async create(booking: Booking): Promise<string> {
    try {
      const bookingWithId: Booking = {
        ...booking,
        id: booking.id || uuidv4(),
      };

      const row = bookingMapper.toSpreadsheetRow(bookingWithId);

      await client.appendRows([row]);

      return bookingWithId.id!;
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to create booking: ${error.message}`);
      }
      throw error;
    }
  },

  async findById(id: string): Promise<Booking | null> {
    try {
      const rows = await client.readAllData();
      const bookings = bookingMapper.fromSpreadsheetRows(rows);

      return bookings.find((booking) => booking.id === id) || null;
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to find booking by ID: ${error.message}`);
      }
      throw error;
    }
  },

  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    try {
      const rows = await client.readAllData();
      const bookings = bookingMapper.fromSpreadsheetRows(rows);

      return bookings.filter((booking) => {
        return datesOverlap(
          booking.startDate,
          booking.endDate,
          startDate,
          endDate
        );
      });
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find bookings by date range: ${error.message}`
        );
      }
      throw error;
    }
  },

  async findByExactDate(date: Date): Promise<Booking[]> {
    try {
      const rows = await client.readAllData();
      const bookings = bookingMapper.fromSpreadsheetRows(rows);

      return bookings.filter((booking) => {
        return date >= booking.startDate && date <= booking.endDate;
      });
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find bookings by exact date: ${error.message}`
        );
      }
      throw error;
    }
  },

  async findByCustomerEmail(email: string): Promise<Booking[]> {
    try {
      const rows = await client.readAllData();
      const bookings = bookingMapper.fromSpreadsheetRows(rows);

      return bookings.filter(
        (booking) => booking.customerEmail.toLowerCase() === email.toLowerCase()
      );
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find bookings by customer email: ${error.message}`
        );
      }
      throw error;
    }
  },

  async findByCustomerAndDateRange(
    email: string,
    startDate: Date,
    endDate: Date
  ): Promise<Booking[]> {
    try {
      const rows = await client.readAllData();
      const bookings = bookingMapper.fromSpreadsheetRows(rows);

      return bookings.filter((booking) => {
        const emailMatches =
          booking.customerEmail.toLowerCase() === email.toLowerCase();
        const isDatesOverlap = datesOverlap(
          booking.startDate,
          booking.endDate,
          startDate,
          endDate
        );
        return emailMatches && isDatesOverlap;
      });
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find bookings by customer and date range: ${error.message}`
        );
      }
      throw error;
    }
  },

  /**
   * Get repository statistics (useful for monitoring)
   * @returns Object with repository statistics
   */
  // async getStats(): Promise<{
  //   totalBookings: number;
  //   activeBookings: number;
  //   lastUpdated: Date;
  // }> {
  //   try {
  //     const rows = await client.readAllData();
  //     const bookings = mapper.fromSpreadsheetRows(rows);

  //     const activeBookings = bookings.filter(
  //       (b) => b.status === "pending" || b.status === "confirmed"
  //     ).length;

  //     return {
  //       totalBookings: bookings.length,
  //       activeBookings,
  //       lastUpdated: new Date(),
  //     };
  //   } catch (error) {
  //     if (error instanceof GoogleSheetsError) {
  //       throw new Error(`Failed to get repository stats: ${error.message}`);
  //     }
  //     throw error;
  //   }
  // },
};

function datesOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 <= end2 && end1 >= start2;
}
