// @ts-check

import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";
import clerk from "@clerk/astro";

export default defineConfig({
  site: "https://oggiortona.com",
  integrations: [
    sitemap(),
    react(),
    clerk({
      signInUrl: "/sign-in",
      signInFallbackRedirectUrl: "/",
    }),
  ],
  output: "server",
  adapter: cloudflare(),
  vite: {
    // @ts-ignore - tailwindcss vite plugin version mismatch with astro's bundled vite
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["@luciodale/react-searchable-dropdown"],
    },
  },
});
