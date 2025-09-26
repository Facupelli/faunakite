interface ImportMetaEnv {
  readonly GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  readonly GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
  readonly GOOGLE_SHEETS_SPREADSHEET_ID: string;
  readonly GOOGLE_SHEETS_SHEET_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
