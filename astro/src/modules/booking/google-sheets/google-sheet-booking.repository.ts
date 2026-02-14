import { v4 as uuidv4 } from "uuid";
import { GoogleSheetsClient, GoogleSheetsError } from "./google-sheet-client";
import type { BookingRepository } from "../booking.repository";
import type { Booking } from "../booking.entity";
import { bookingMapper } from "./mappers/booking.mapper";
import { getGoogleServiceAccountPrivateKey } from "../../utils/google-cloud";

const GOOGLE_SHEETS_SPREADSHEET_ID = import.meta.env
  .GOOGLE_SHEETS_SPREADSHEET_ID;
const GOOGLE_SHEETS_SHEET_NAME = import.meta.env.GOOGLE_SHEETS_SHEET_NAME;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = import.meta.env
  .GOOGLE_SERVICE_ACCOUNT_EMAIL;

const spreadsheetId = GOOGLE_SHEETS_SPREADSHEET_ID;
const sheetName = GOOGLE_SHEETS_SHEET_NAME;
const clientEmail = GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = getGoogleServiceAccountPrivateKey();

const client = new GoogleSheetsClient({
  spreadsheetId,
  sheetName,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  },
});

export const GoogleSheetsBookingRepository: BookingRepository = {
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
      console.log("[findById] Starting search for ID:", id);
      console.log("[findById] Environment:", import.meta.env.MODE);
      console.log("[findById] Client config:", {
        spreadsheetId,
        sheetName,
        hasEmail: !!clientEmail,
        hasPrivateKey: !!privateKey,
      });

      const startTime = Date.now();
      const rows = await client.readAllData();
      const duration = Date.now() - startTime;

      console.log(`[findById] Read ${rows.length} rows in ${duration}ms`);
      console.log(
        "[findById] First few row IDs:",
        rows.slice(0, 3).map((r) => r[0]),
      );

      const ID_COLUMN = 0;
      const rowIndex = rows.findIndex((row) => row[ID_COLUMN] === id);

      console.log("[findById] Row index found:", rowIndex);

      if (rowIndex === -1) {
        console.log("[findById] Booking not found, returning null");
        return null;
      }

      const booking = bookingMapper.fromSpreadsheetRow(rows[rowIndex]);
      console.log("[findById] Booking found:", booking?.id);
      return booking;
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to find booking by ID: ${error.message}`);
      }
      throw error;
    }
  },
};
