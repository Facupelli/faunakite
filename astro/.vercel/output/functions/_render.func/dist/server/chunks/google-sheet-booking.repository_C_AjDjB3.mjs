import { v4 } from 'uuid';
import { auth, sheets } from '@googleapis/sheets';
import { a as CourseTypeDict, b as SkillLevelDict, d as DetailedSkillLevelDict, R as ReferralSource, e as ReferralSourceDict } from './booking.entity_B7ROh_NS.mjs';
import { G as GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, a as GOOGLE_SERVICE_ACCOUNT_EMAIL, d as GOOGLE_SHEETS_SHEET_NAME, e as GOOGLE_SHEETS_SPREADSHEET_ID } from './server_BFBN1YLM.mjs';

class GoogleSheetsError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.name = "GoogleSheetsError";
  }
}
class GoogleSheetsClient {
  sheets;
  config;
  constructor(config) {
    this.config = config;
    this.sheets = this.initializeClient();
  }
  initializeClient() {
    try {
      const authentication = new auth.GoogleAuth({
        credentials: this.config.credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"]
      });
      return sheets({ version: "v4", auth: authentication });
    } catch (error) {
      throw new GoogleSheetsError(
        "Failed to initialize Google Sheets client",
        void 0,
        error
      );
    }
  }
  async readRange(range) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: `${this.config.sheetName}!${range}`,
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "SERIAL_NUMBER"
        // For proper date handling
      });
      return response.data.values || [];
    } catch (error) {
      this.handleApiError("Failed to read range", error);
    }
  }
  async readAllData() {
    return this.readRange("A2:Z");
  }
  async readHeaders() {
    const headers = await this.readRange("A1:Z1");
    return headers[0]?.map((h) => String(h)) || [];
  }
  async appendRows(values) {
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.config.spreadsheetId,
        range: `${this.config.sheetName}!A2:Z`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values
        }
      });
      return {
        updatedRows: response.data.updates?.updatedRows || 0,
        updatedRange: response.data.updates?.updatedRange || ""
      };
    } catch (error) {
      this.handleApiError("Failed to append rows", error);
    }
  }
  handleApiError(message, error) {
    console.error("Google Sheets API Error:", error);
    let statusCode;
    let details = "Unknown error";
    if (error && typeof error === "object" && "status" in error) {
      statusCode = error.status;
    }
    if (error && typeof error === "object" && "message" in error) {
      details = error.message;
    }
    throw new GoogleSheetsError(`${message}: ${details}`, statusCode, error);
  }
}

const BOOKING_SHEET_HEADERS = [
  "id",
  "createdAt",
  // Section 1: Personal Data
  "customerName",
  "birthDate",
  "gender",
  "customerEmail",
  "province",
  "customerPhone",
  "instagram",
  // Section 2: Reservation
  "courseType",
  "hoursReserved",
  "arrivalDate",
  "arrivalTime",
  "departureDate",
  "departureTime",
  // Section 3: Sports Profile
  "weightKg",
  "heightCm",
  "currentLevel",
  // Section 4: Detailed Skill
  "detailedSkillLevel",
  // Section 5: Goals
  "mainObjective",
  "additionalNotes",
  // Section 6: Marketing
  "referralSource",
  "referralSourceOther",
  "newsletterOptIn"
];
function toSpreadsheetRow(booking) {
  function formatDateTime(date) {
    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).replace(",", "");
  }
  function formatDate(date) {
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }
  function formatNewsletterOptIn(optIn) {
    return optIn ? "¡Sí, Avísenme!" : "No, gracias...";
  }
  function formatReferralSource(source) {
    if (source === ReferralSource.OTHER && booking.referralSourceOther) {
      return booking.referralSourceOther;
    }
    return source ? ReferralSourceDict[source] : "";
  }
  return [
    booking.id || "",
    formatDateTime(booking.createdAt),
    // Section 1: Personal Data
    booking.customerName,
    formatDate(booking.birthDate),
    booking.gender || "",
    booking.customerEmail,
    booking.province,
    booking.customerPhone || "",
    "",
    // TODO: instagram
    // Section 2: Reservation
    booking.courseType ? CourseTypeDict[booking.courseType] : "",
    booking.hoursReserved || "",
    formatDate(booking.arrivalDate),
    booking.arrivalTime,
    formatDate(booking.departureDate),
    booking.departureTime || "",
    // Section 3: Sports Profile
    booking.weightKg || "",
    booking.heightCm || "",
    booking.currentLevel ? SkillLevelDict[booking.currentLevel] : "",
    // Section 4: Detailed Skill
    booking.detailedSkillLevel ? DetailedSkillLevelDict[booking.detailedSkillLevel] : "",
    // Section 5: Goals
    booking.mainObjective || "",
    booking.additionalNotes || "",
    // Section 6: Marketing
    formatReferralSource(booking.referralSource),
    formatNewsletterOptIn(booking.newsletterOptIn)
  ];
}
const headerIndexMap = BOOKING_SHEET_HEADERS.reduce(
  (acc, h, idx) => {
    acc[h] = idx;
    return acc;
  },
  {}
);
function fromSpreadsheetRow(row) {
  console.log("MAPPER", { row });
  function getCell(row2, header) {
    const idx = headerIndexMap[header];
    if (header === "createdAt") {
      console.log({ idx });
      console.log({ lol: row2[idx] });
    }
    return idx != null ? row2[idx] : void 0;
  }
  function parseStringCell(cell) {
    if (cell === void 0 || cell === null) return void 0;
    const s = String(cell).trim();
    return s === "" ? void 0 : s;
  }
  function parseNumberCell(cell) {
    if (cell === void 0 || cell === null || cell === "") return void 0;
    if (typeof cell === "number") return Number(cell);
    const s = String(cell).replace(",", ".").trim();
    if (s === "") return void 0;
    const n = Number(s);
    return Number.isFinite(n) ? n : void 0;
  }
  function parseEnumCell(cell, enumObj) {
    const s = parseStringCell(cell);
    if (!s) {
      return void 0;
    }
  }
  function parseBooleanCell(cell, defaultIfMissing = false) {
    if (cell === void 0 || cell === null || String(cell).trim() === "") {
      return defaultIfMissing;
    }
    const s = String(cell).trim().toLowerCase();
    if (["1", "true", "t", "yes", "y", "si", "sí"].includes(s)) return true;
    if (["0", "false", "f", "no", "n"].includes(s)) return false;
    const num = Number(s);
    if (!Number.isNaN(num)) return num !== 0;
    return defaultIfMissing;
  }
  function parseCreatedAtCell(cell) {
    if (!cell) {
      return void 0;
    }
    console.log({ cell });
    if (typeof cell === "number") {
      const excelEpoch = new Date(1900, 0, 1);
      const daysOffset = cell - 2;
      return new Date(excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1e3);
    }
    if (typeof cell === "string") {
      const [datePart, timePart] = cell.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds);
    }
    return void 0;
  }
  function parseDateCell(cell) {
    if (cell === void 0 || cell === null || String(cell).trim() === "") {
      return void 0;
    }
    if (cell instanceof Date && !Number.isNaN(cell.getTime())) {
      return cell;
    }
    if (typeof cell === "number") {
      const excelEpoch = new Date(1900, 0, 1);
      const daysOffset = cell - 2;
      return new Date(excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1e3);
    }
    const s = String(cell).trim();
    const dIso = new Date(s);
    if (!Number.isNaN(dIso.getTime())) {
      return dIso;
    }
    return void 0;
  }
  const cellId = parseStringCell(getCell(row, "id"));
  const createdAt = parseCreatedAtCell(getCell(row, "createdAt"));
  const customerName = parseStringCell(getCell(row, "customerName"));
  const birthDate = parseDateCell(getCell(row, "birthDate"));
  const gender = parseEnumCell(getCell(row, "gender"));
  const customerEmail = parseStringCell(getCell(row, "customerEmail"));
  const province = parseStringCell(getCell(row, "province"));
  const customerPhone = parseStringCell(getCell(row, "customerPhone"));
  const courseType = parseEnumCell(getCell(row, "courseType"));
  const hoursReserved = parseNumberCell(getCell(row, "hoursReserved"));
  const arrivalDate = parseDateCell(getCell(row, "arrivalDate"));
  const arrivalTime = parseStringCell(getCell(row, "arrivalTime"));
  const departureDate = parseDateCell(getCell(row, "departureDate"));
  const departureTime = parseStringCell(getCell(row, "departureTime"));
  const weightKg = parseNumberCell(getCell(row, "weightKg"));
  const heightCm = parseNumberCell(getCell(row, "heightCm"));
  const currentLevel = parseEnumCell(getCell(row, "currentLevel"));
  const detailedSkillLevel = parseEnumCell(
    getCell(row, "detailedSkillLevel"));
  const mainObjective = parseStringCell(getCell(row, "mainObjective"));
  const additionalNotes = parseStringCell(getCell(row, "additionalNotes"));
  const referralSource = parseEnumCell(
    getCell(row, "referralSource"));
  const referralSourceOther = parseStringCell(
    getCell(row, "referralSourceOther")
  );
  const newsletterOptIn = parseBooleanCell(
    getCell(row, "newsletterOptIn"),
    false
  );
  if (!createdAt || !customerName || !birthDate || customerEmail === void 0 || province === void 0 || !arrivalDate || !arrivalTime || !departureDate) {
    console.log({
      createdAt,
      customerName,
      birthDate,
      customerEmail,
      province,
      arrivalDate,
      arrivalTime,
      departureDate
    });
    return null;
  }
  const booking = {
    id: cellId,
    createdAt,
    customerName,
    birthDate,
    gender,
    customerEmail,
    province,
    customerPhone,
    courseType,
    hoursReserved,
    arrivalDate,
    arrivalTime,
    departureDate,
    departureTime,
    weightKg,
    heightCm,
    currentLevel,
    detailedSkillLevel,
    mainObjective,
    additionalNotes,
    referralSource,
    referralSourceOther,
    newsletterOptIn
  };
  return booking;
}
const bookingMapper = {
  toSpreadsheetRow,
  fromSpreadsheetRow
};

const spreadsheetId = GOOGLE_SHEETS_SPREADSHEET_ID;
const sheetName = GOOGLE_SHEETS_SHEET_NAME;
const clientEmail = GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
const client = new GoogleSheetsClient({
  spreadsheetId,
  sheetName,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n")
  }
});
const GoogleSheetsBookingRepository = {
  async create(booking) {
    try {
      const bookingWithId = {
        ...booking,
        id: booking.id || v4()
      };
      const row = bookingMapper.toSpreadsheetRow(bookingWithId);
      await client.appendRows([row]);
      return bookingWithId.id;
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to create booking: ${error.message}`);
      }
      throw error;
    }
  },
  async findById(id) {
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
  }
};

export { GoogleSheetsBookingRepository as G };
