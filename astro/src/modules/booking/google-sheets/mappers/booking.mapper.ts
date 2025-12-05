import {
  CourseType,
  CourseTypeDict,
  DetailedSkillLevel,
  DetailedSkillLevelDict,
  Gender,
  ReferralSource,
  ReferralSourceDict,
  SkillLevel,
  SkillLevelDict,
  type Booking,
} from "../../booking.entity";

export type SpreadsheetRow = (string | number | boolean)[];

export const BOOKING_SHEET_HEADERS = [
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
  "newsletterOptIn",
] as const;

export type BookingHeader = (typeof BOOKING_SHEET_HEADERS)[number];

function toSpreadsheetRow(booking: Booking): SpreadsheetRow {
  function formatDateTime(date: Date): string {
    return date
      .toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatNewsletterOptIn(optIn: boolean): string {
    return optIn ? "¡Sí, Avísenme!" : "No, gracias...";
  }

  function formatReferralSource(source: ReferralSource | undefined): string {
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
    "", // TODO: instagram

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
    booking.detailedSkillLevel
      ? DetailedSkillLevelDict[booking.detailedSkillLevel]
      : "",

    // Section 5: Goals
    booking.mainObjective || "",
    booking.additionalNotes || "",

    // Section 6: Marketing
    formatReferralSource(booking.referralSource),
    formatNewsletterOptIn(booking.newsletterOptIn),
  ];
}

const headerIndexMap = BOOKING_SHEET_HEADERS.reduce<Record<string, number>>(
  (acc, h, idx) => {
    acc[h] = idx;
    return acc;
  },
  {}
);

function fromSpreadsheetRow(row: unknown[]): Booking | null {
  // console.log("MAPPER", { row });

  function getCell(row: unknown[], header: BookingHeader): any {
    const idx = headerIndexMap[header];
    if (header === "courseType") {
      console.log({ idx });
      console.log({ lol: row[idx] });
    }
    return idx != null ? row[idx] : undefined;
  }

  function parseStringCell(cell: unknown): string | undefined {
    if (cell === undefined || cell === null) return undefined;
    const s = String(cell).trim();
    return s === "" ? undefined : s;
  }

  function parseNumberCell(cell: any): number | undefined {
    if (cell === undefined || cell === null || cell === "") return undefined;
    if (typeof cell === "number") return Number(cell);
    const s = String(cell).replace(",", ".").trim();
    if (s === "") return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  }

  // TODO: implement
  // function parseEnumCell<T extends Record<string, string>>(
  //   cell: any,
  //   enumObj: T
  // ): T[keyof T] | undefined {
  //   const s = parseStringCell(cell);
  //   if (!s) {
  //     return undefined;
  //   }
  //   // TODO: validate enum values
  // }

  function parseBooleanCell(cell: any, defaultIfMissing = false): boolean {
    if (cell === undefined || cell === null || String(cell).trim() === "") {
      return defaultIfMissing;
    }
    const s = String(cell).trim().toLowerCase();
    if (["1", "true", "t", "yes", "y", "si", "sí"].includes(s)) return true;
    if (["0", "false", "f", "no", "n"].includes(s)) return false;
    // fallback: try numeric
    const num = Number(s);
    if (!Number.isNaN(num)) return num !== 0;
    return defaultIfMissing;
  }

  function parseCreatedAtCell(cell: any): Date | undefined {
    if (!cell) {
      return undefined;
    }

    // If it's a number (Excel serial date)
    if (typeof cell === "number") {
      const excelEpoch = new Date(1900, 0, 1);
      const daysOffset = cell - 2;
      return new Date(excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    }

    if (typeof cell === "string") {
      // Parse "31/10/2025 13:08:46"
      const [datePart, timePart] = cell.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);

      return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    return undefined;
  }

  function parseDateCell(cell: any): Date | undefined {
    if (cell === undefined || cell === null || String(cell).trim() === "") {
      return undefined;
    }

    if (cell instanceof Date && !Number.isNaN(cell.getTime())) {
      return cell;
    }

    // If it's a number (Excel serial date)
    if (typeof cell === "number") {
      // Excel serial date: days since 1900-01-01
      const excelEpoch = new Date(1900, 0, 1);
      const daysOffset = cell - 2; // Excel bug: treats 1900 as leap year
      return new Date(excelEpoch.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    }

    const s = String(cell).trim();

    const dIso = new Date(s);
    if (!Number.isNaN(dIso.getTime())) {
      return dIso;
    }

    return undefined;
  }

  const cellId = parseStringCell(getCell(row, "id"));
  const createdAt = parseCreatedAtCell(getCell(row, "createdAt"));
  const customerName = parseStringCell(getCell(row, "customerName"));
  const birthDate = parseDateCell(getCell(row, "birthDate"));
  const gender = parseStringCell(getCell(row, "gender"));
  const customerEmail = parseStringCell(getCell(row, "customerEmail"));
  const province = parseStringCell(getCell(row, "province"));
  const customerPhone = parseStringCell(getCell(row, "customerPhone"));
  const courseType = parseStringCell(getCell(row, "courseType"));
  const hoursReserved = parseNumberCell(getCell(row, "hoursReserved"));
  const arrivalDate = parseDateCell(getCell(row, "arrivalDate"));
  const arrivalTime = parseStringCell(getCell(row, "arrivalTime"));
  const departureDate = parseDateCell(getCell(row, "departureDate"));
  const departureTime = parseStringCell(getCell(row, "departureTime"));
  const weightKg = parseNumberCell(getCell(row, "weightKg"));
  const heightCm = parseNumberCell(getCell(row, "heightCm"));
  const currentLevel = parseStringCell(getCell(row, "currentLevel"));
  const detailedSkillLevel = parseStringCell(
    getCell(row, "detailedSkillLevel")
  );
  const mainObjective = parseStringCell(getCell(row, "mainObjective"));
  const additionalNotes = parseStringCell(getCell(row, "additionalNotes"));
  const referralSource = parseStringCell(getCell(row, "referralSource"));
  const referralSourceOther = parseStringCell(
    getCell(row, "referralSourceOther")
  );
  const newsletterOptIn = parseBooleanCell(
    getCell(row, "newsletterOptIn"),
    false
  );

  if (
    !createdAt ||
    !customerName ||
    !birthDate ||
    customerEmail === undefined ||
    province === undefined ||
    !arrivalDate ||
    !arrivalTime ||
    !departureDate
  ) {
    console.log({
      createdAt,
      customerName,
      birthDate,
      customerEmail,
      province,
      arrivalDate,
      arrivalTime,
      departureDate,
    });
    return null;
  }

  const booking: Booking = {
    id: cellId,
    createdAt,
    customerName,
    birthDate,
    gender: gender as Gender | undefined,
    customerEmail,
    province,
    customerPhone,
    courseType: courseType as CourseType | undefined,
    hoursReserved,
    arrivalDate,
    arrivalTime,
    departureDate,
    departureTime,
    weightKg,
    heightCm,
    currentLevel: currentLevel as SkillLevel | undefined,
    detailedSkillLevel: detailedSkillLevel as DetailedSkillLevel | undefined,
    mainObjective,
    additionalNotes,
    referralSource: referralSource as ReferralSource | undefined,
    referralSourceOther,
    newsletterOptIn,
  };

  return booking;
}

export const bookingMapper = {
  toSpreadsheetRow,
  fromSpreadsheetRow,
};

export function getHeaderRow(): string[] {
  return [...BOOKING_SHEET_HEADERS];
}
