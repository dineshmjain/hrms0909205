import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./ui",
  server: {
    // proxy: {
    //   "/api":
    //     "http://4c6bc37e-56c7-4438-9945-499e7dc0c72c-00-fy6ntyr2qww8.sisko.replit.dev",
    // },
  },

  plugins: [react()],
  //base: "/", // Comment out or remove for development
  build: {
    assetsDir: "assets",
    sourcemap: true,
    minify: false,
  },
  allowedHosts: true
});
