import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "pdf.worker.mjs": "pdfjs-dist/build/pdf.worker.min.js",
    },
  },
});
