import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// オフラインで動作する完全クライアントサイドのSPA
export default defineConfig({
  plugins: [react()],
  base: "./",
});
