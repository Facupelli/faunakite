const isProd = import.meta.env.NODE_ENV === "production";

export function getGoogleServiceAccountPrivateKey(): string {
  if (isProd) {
    const jsonKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    if (!jsonKey) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not set");
    }

    try {
      const { privateKey } = JSON.parse(jsonKey);
      return privateKey;
    } catch (error) {
      console.log({ error });
      throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
    }
  }

  return process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!;
}

export function getGoogleServiceAccountKeys() {
  const privateKey = getGoogleServiceAccountPrivateKey();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  return { clientEmail, privateKey };
}

export function getGoogleSheetsConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME!;
  return { spreadsheetId, sheetName };
}

export function getGoogleCalendarConfig() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID!;
  return { calendarId };
}
