import { GoogleAuth, handleFetchError } from "../google-auth";

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
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "GoogleSheetsError";
  }
}

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export class GoogleSheetsClient {
  private config: GoogleSheetsConfig;
  private auth: GoogleAuth;

  constructor(config: GoogleSheetsConfig) {
    this.config = config;
    this.auth = new GoogleAuth(config.credentials, SCOPES);
  }

  async readRange(range: string): Promise<unknown[][]> {
    const token = await this.auth.getAccessToken();
    const encodedRange = encodeURIComponent(
      `${this.config.sheetName}!${range}`,
    );

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${encodedRange}?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=SERIAL_NUMBER`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        await handleFetchError("Failed to read range", response);
      }

      const data = (await response.json()) as { values?: unknown[][] };
      return data.values || [];
    } catch (error) {
      if (error instanceof GoogleSheetsError) throw error;
      throw new GoogleSheetsError("Failed to read range", undefined, error);
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
    values: unknown[][],
  ): Promise<{ updatedRows: number; updatedRange: string }> {
    const token = await this.auth.getAccessToken();
    const encodedRange = encodeURIComponent(`${this.config.sheetName}!A2:Z`);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values }),
      });

      if (!response.ok) {
        await handleFetchError("Failed to append rows", response);
      }

      const data = (await response.json()) as {
        updates?: {
          updatedRows?: number;
          updatedRange?: string;
        };
      };

      return {
        updatedRows: data.updates?.updatedRows || 0,
        updatedRange: data.updates?.updatedRange || "",
      };
    } catch (error) {
      if (error instanceof GoogleSheetsError) throw error;
      throw new GoogleSheetsError("Failed to append rows", undefined, error);
    }
  }

  // --- Utility Helpers ---

  private base64urlEncode(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
}
