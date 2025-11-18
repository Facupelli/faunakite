// @ts-check
import { defineConfig } from "astro/config";

import sanity from "@sanity/astro";
import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    sanity({
      projectId: "9k0yi9jd",
      dataset: "production",
      useCdn: false, // for static builds
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
