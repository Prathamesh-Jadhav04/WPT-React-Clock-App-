// Vite configuration — React plugin + Tailwind CSS v4 plugin (taught setup, no tailwind.config.js needed)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
