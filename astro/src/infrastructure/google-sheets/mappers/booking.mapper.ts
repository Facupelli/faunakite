/**
 * Data mapper for converting between Booking entities and Google Sheets rows
 *
 * Handles the impedance mismatch between:
 * - Rich domain objects (Booking entities)
 * - Flat spreadsheet data (arrays of primitive values)
 *
 * Following clean architecture principles:
 * - Pure transformation logic, no business rules
 * - Handles serialization/deserialization concerns
 * - Isolates spreadsheet format from domain model
 */

import {
  BookingStatus,
  PaymentStatus,
  type Booking,
} from "../../../domain/entities/booking";

/**
 * Column indices in the Google Sheets
 * This defines the spreadsheet structure and column order
 */
const COLUMN_INDICES = {
  ID: 0,
  CUSTOMER_EMAIL: 1,
  CUSTOMER_NAME: 2,
  CUSTOMER_PHONE: 3,
  COURSE_TYPE: 4,
  START_DATE: 5,
  END_DATE: 6,
  NUMBER_OF_STUDENTS: 7,
  STATUS: 8,
  PAYMENT_STATUS: 9,
  CREATED_AT: 10,
  SPECIAL_REQUESTS: 11,
} as const;

/**
 * Expected header row for the Google Sheets
 * Must match the column indices above
 */
export const BOOKING_SHEET_HEADERS = [
  "id",
  "customerEmail",
  "customerName",
  "customerPhone",
  "courseType",
  "startDate",
  "endDate",
  "numberOfStudents",
  "status",
  "paymentStatus",
  "createdAt",
  "specialRequests",
] as const;

/**
 * Mapper class for Booking entity ↔ Google Sheets transformations
 */
export class BookingMapper {
  /**
   * Convert a Booking entity to a spreadsheet row array
   * @param booking The booking entity to convert
   * @returns Array of primitive values for Google Sheets
   */
  toSpreadsheetRow(booking: Booking): unknown[] {
    const row: unknown[] = new Array(BOOKING_SHEET_HEADERS.length);

    // Fill array using column indices for type safety
    row[COLUMN_INDICES.ID] = booking.id || "";
    row[COLUMN_INDICES.CUSTOMER_EMAIL] = booking.customerEmail;
    row[COLUMN_INDICES.CUSTOMER_NAME] = booking.customerName;
    row[COLUMN_INDICES.CUSTOMER_PHONE] = booking.customerPhone || "";
    row[COLUMN_INDICES.COURSE_TYPE] = booking.courseType;
    row[COLUMN_INDICES.START_DATE] = this.formatDate(booking.startDate);
    row[COLUMN_INDICES.END_DATE] = this.formatDate(booking.endDate);
    row[COLUMN_INDICES.NUMBER_OF_STUDENTS] = booking.numberOfStudents;
    row[COLUMN_INDICES.STATUS] = booking.status;
    row[COLUMN_INDICES.PAYMENT_STATUS] = booking.paymentStatus;
    row[COLUMN_INDICES.CREATED_AT] = this.formatDate(booking.createdAt);
    row[COLUMN_INDICES.SPECIAL_REQUESTS] = booking.specialRequests || "";

    return row;
  }

  /**
   * Convert a spreadsheet row array to a Booking entity
   * @param row Array of cell values from Google Sheets
   * @returns Booking entity or null if row is invalid
   */
  fromSpreadsheetRow(row: unknown[]): Booking | null {
    // Validate row has minimum required data
    if (!row || row.length < 8) {
      return null;
    }

    // Extract and validate required fields
    const id = this.extractString(row[COLUMN_INDICES.ID]);
    const customerEmail = this.extractString(
      row[COLUMN_INDICES.CUSTOMER_EMAIL]
    );
    const customerName = this.extractString(row[COLUMN_INDICES.CUSTOMER_NAME]);
    const courseType = this.extractString(row[COLUMN_INDICES.COURSE_TYPE]);
    const startDate = this.parseDate(row[COLUMN_INDICES.START_DATE]);
    const endDate = this.parseDate(row[COLUMN_INDICES.END_DATE]);
    const numberOfStudents = this.extractNumber(
      row[COLUMN_INDICES.NUMBER_OF_STUDENTS]
    );
    const status = this.extractStatus(row[COLUMN_INDICES.STATUS]);
    const paymentStatus = this.extractPaymentStatus(
      row[COLUMN_INDICES.PAYMENT_STATUS]
    );
    const createdAt = this.parseDate(row[COLUMN_INDICES.CREATED_AT]);

    // Skip invalid rows
    if (
      !id ||
      !customerEmail ||
      !customerName ||
      !courseType ||
      !startDate ||
      !endDate ||
      numberOfStudents === null ||
      !status ||
      !paymentStatus ||
      !createdAt
    ) {
      return null;
    }

    // Extract optional fields
    const customerPhone =
      this.extractString(row[COLUMN_INDICES.CUSTOMER_PHONE]) || undefined;
    const specialRequests =
      this.extractString(row[COLUMN_INDICES.SPECIAL_REQUESTS]) || undefined;

    return {
      id,
      customerEmail,
      customerName,
      customerPhone,
      courseType,
      startDate,
      endDate,
      numberOfStudents,
      status,
      paymentStatus,
      createdAt,
      specialRequests,
    };
  }

  /**
   * Convert multiple spreadsheet rows to Booking entities
   * Filters out invalid rows automatically
   * @param rows Array of spreadsheet rows
   * @returns Array of valid Booking entities
   */
  fromSpreadsheetRows(rows: unknown[][]): Booking[] {
    return rows
      .map((row) => this.fromSpreadsheetRow(row))
      .filter((booking): booking is Booking => booking !== null);
  }

  /**
   * Format Date object for Google Sheets storage
   * Uses ISO string format for consistency
   */
  private formatDate(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parse date from Google Sheets cell value
   * Handles both ISO strings and Excel serial numbers
   */
  private parseDate(value: unknown): Date | null {
    if (!value) return null;

    // Handle ISO string format
    if (typeof value === "string") {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }

    // Handle Excel serial number (days since 1900-01-01)
    if (typeof value === "number") {
      // Excel serial date conversion
      const excelEpoch = new Date(1900, 0, 1);
      const date = new Date(
        excelEpoch.getTime() + (value - 1) * 24 * 60 * 60 * 1000
      );
      return isNaN(date.getTime()) ? null : date;
    }

    return null;
  }

  /**
   * Safely extract string value from spreadsheet cell
   */
  private extractString(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    const str = String(value).trim();
    return str === "" ? null : str;
  }

  /**
   * Safely extract number value from spreadsheet cell
   */
  private extractNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === "") return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  /**
   * Extract and validate BookingStatus enum
   */
  private extractStatus(value: unknown): BookingStatus | null {
    const str = this.extractString(value);
    if (!str) return null;

    // Check if value is valid BookingStatus
    return Object.values(BookingStatus).includes(str as BookingStatus)
      ? (str as BookingStatus)
      : null;
  }

  /**
   * Extract and validate PaymentStatus enum
   */
  private extractPaymentStatus(value: unknown): PaymentStatus | null {
    const str = this.extractString(value);
    if (!str) return null;

    // Check if value is valid PaymentStatus
    return Object.values(PaymentStatus).includes(str as PaymentStatus)
      ? (str as PaymentStatus)
      : null;
  }
}
