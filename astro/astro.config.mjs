// @ts-check
import { defineConfig, envField } from "astro/config";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";
import icon from "astro-icon";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

const { SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  "",
);

// https://astro.build/config
export default defineConfig({
  site: "https://faunakite.com",

  env: {
    schema: {
      SITE_URL: envField.string({
        context: "client",
        access: "public",
      }),
      GOOGLE_SERVICE_ACCOUNT_EMAIL: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_SHEETS_SPREADSHEET_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_SHEETS_SHEET_NAME: envField.string({
        context: "server",
        access: "secret",
      }),
      SANITY_STUDIO_PROJECT_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      SANITY_STUDIO_DATASET: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_CALENDAR_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      SENDER_NET_ACCESS_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_APP_PASSWORD: envField.string({
        context: "server",
        access: "secret",
      }),
      TIENDANUBE_ACCESS_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      TIENDANUBE_USER_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      TURNSTILE_BOOKED_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      TURNSTILE_NEWSLETTER_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      TN_FEATURED_CATEGORY_ID: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },

  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [
    sanity({
      projectId: SANITY_STUDIO_PROJECT_ID,
      dataset: SANITY_STUDIO_DATASET,
      useCdn: false, // for static builds
    }),
    icon(),
    react(),
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: {
          en: "en-US",
          es: "es-ES",
        },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});
