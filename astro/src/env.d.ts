/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  readonly GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
  readonly GOOGLE_SHEETS_SPREADSHEET_ID: string;
  readonly GOOGLE_SHEETS_SHEET_NAME: string;
  readonly SANITY_STUDIO_PROJECT_ID: string;
  readonly SANITY_STUDIO_DATASET: string;
  readonly GOOGLE_CALENDAR_ID: string;
  readonly SENDER_NET_ACCESS_TOKEN: string;
  readonly GOOGLE_APP_PASSWORD: string;
  readonly TIENDANUBE_ACCESS_TOKEN: string;
  readonly TIENDANUBE_USER_ID: string;
  readonly TURNSTILE_BOOKED_SECRET_KEY: string;
  readonly TURNSTILE_NEWSLETTER_SECRET_KEY: string;
  readonly TN_FEATURED_CATEGORY_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
