import {
  BookingStatus,
  PaymentStatus,
  type Booking,
} from "../../booking.entity";

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
export const bookingMapper = {
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
    row[COLUMN_INDICES.START_DATE] = formatDate(booking.startDate);
    row[COLUMN_INDICES.END_DATE] = formatDate(booking.endDate);
    row[COLUMN_INDICES.STATUS] = booking.status;
    row[COLUMN_INDICES.PAYMENT_STATUS] = booking.paymentStatus;
    row[COLUMN_INDICES.CREATED_AT] = formatDate(booking.createdAt);
    row[COLUMN_INDICES.SPECIAL_REQUESTS] = booking.specialRequests || "";

    return row;
  },

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
    const id = extractString(row[COLUMN_INDICES.ID]);
    const customerEmail = extractString(row[COLUMN_INDICES.CUSTOMER_EMAIL]);
    const customerName = extractString(row[COLUMN_INDICES.CUSTOMER_NAME]);
    const courseType = extractString(row[COLUMN_INDICES.COURSE_TYPE]);
    const startDate = parseDate(row[COLUMN_INDICES.START_DATE]);
    const endDate = parseDate(row[COLUMN_INDICES.END_DATE]);
    const numberOfStudents = extractNumber(
      row[COLUMN_INDICES.NUMBER_OF_STUDENTS]
    );
    const status = extractStatus(row[COLUMN_INDICES.STATUS]);
    const paymentStatus = extractPaymentStatus(
      row[COLUMN_INDICES.PAYMENT_STATUS]
    );
    const createdAt = parseDate(row[COLUMN_INDICES.CREATED_AT]);

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
      extractString(row[COLUMN_INDICES.CUSTOMER_PHONE]) || undefined;
    const specialRequests =
      extractString(row[COLUMN_INDICES.SPECIAL_REQUESTS]) || undefined;

    return {
      id,
      customerEmail,
      customerName,
      customerPhone,
      courseType,
      startDate,
      endDate,
      status,
      paymentStatus,
      createdAt,
      specialRequests,
    };
  },

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
  },
};

/**
 * Format Date object for Google Sheets storage
 * Uses ISO string format for consistency
 */
function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Parse date from Google Sheets cell value
 * Handles both ISO strings and Excel serial numbers
 */
function parseDate(value: unknown): Date | null {
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

function extractString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str === "" ? null : str;
}

function extractNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

function extractStatus(value: unknown): BookingStatus | null {
  const str = extractString(value);
  if (!str) return null;

  // Check if value is valid BookingStatus
  return Object.values(BookingStatus).includes(str as BookingStatus)
    ? (str as BookingStatus)
    : null;
}

function extractPaymentStatus(value: unknown): PaymentStatus | null {
  const str = extractString(value);
  if (!str) return null;

  // Check if value is valid PaymentStatus
  return Object.values(PaymentStatus).includes(str as PaymentStatus)
    ? (str as PaymentStatus)
    : null;
}
