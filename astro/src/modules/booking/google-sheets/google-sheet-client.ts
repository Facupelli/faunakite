import { auth, type sheets_v4, sheets } from "@googleapis/sheets";

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  credentials: {
    client_email: string;
    private_key: string;
  };
}

export class GoogleSheetsError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "GoogleSheetsError";
  }
}

export class GoogleSheetsClient {
  private sheets: sheets_v4.Sheets;
  private config: GoogleSheetsConfig;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
    this.sheets = this.initializeClient();
  }

  private initializeClient(): sheets_v4.Sheets {
    try {
      const authentication = new auth.GoogleAuth({
        credentials: this.config.credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      return sheets({ version: "v4", auth: authentication });
    } catch (error) {
      throw new GoogleSheetsError(
        "Failed to initialize Google Sheets client",
        undefined,
        error
      );
    }
  }

  async readRange(range: string): Promise<unknown[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.spreadsheetId,
        range: `${this.config.sheetName}!${range}`,
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "SERIAL_NUMBER", // For proper date handling
      });

      return response.data.values || [];
    } catch (error) {
      this.handleApiError("Failed to read range", error);
    }
  }

  async readAllData(): Promise<unknown[][]> {
    return this.readRange("A2:Z");
  }

  async readHeaders(): Promise<string[]> {
    const headers = await this.readRange("A1:Z1");
    return headers[0]?.map((h) => String(h)) || [];
  }

  async appendRows(
    values: unknown[][]
  ): Promise<{ updatedRows: number; updatedRange: string }> {
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.config.spreadsheetId,
        range: `${this.config.sheetName}!A2:Z`,
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values,
        },
      });

      return {
        updatedRows: response.data.updates?.updatedRows || 0,
        updatedRange: response.data.updates?.updatedRange || "",
      };
    } catch (error) {
      this.handleApiError("Failed to append rows", error);
    }
  }

  private handleApiError(message: string, error: unknown): never {
    console.error("Google Sheets API Error:", error);

    let statusCode: number | undefined;
    let details = "Unknown error";

    if (error && typeof error === "object" && "status" in error) {
      statusCode = error.status as number;
    }

    if (error && typeof error === "object" && "message" in error) {
      details = error.message as string;
    }

    throw new GoogleSheetsError(`${message}: ${details}`, statusCode, error);
  }
}
