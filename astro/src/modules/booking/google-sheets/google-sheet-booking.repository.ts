import { v4 as uuidv4 } from "uuid";
import { GoogleSheetsClient, GoogleSheetsError } from "./google-sheet-client";
import type { BookingRepository } from "../booking.repository";
import type { Booking } from "../booking.entity";
import { bookingMapper } from "./mappers/booking.mapper";
import {
  getGoogleServiceAccountKeys,
  getGoogleSheetsConfig,
} from "../../utils/google-cloud";

const { clientEmail, privateKey } = getGoogleServiceAccountKeys();
const { spreadsheetId, sheetName } = getGoogleSheetsConfig();

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
      const rows = await client.readAllData();

      const ID_COLUMN = 0;
      const rowIndex = rows.findIndex((row) => row[ID_COLUMN] === id);

      if (rowIndex === -1) {
        return null;
      }

      const booking = bookingMapper.fromSpreadsheetRow(rows[rowIndex]);
      return booking;
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to find booking by ID: ${error.message}`);
      }
      throw error;
    }
  },
};
