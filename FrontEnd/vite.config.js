import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // Import plugin
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate", // Tự động update SW khi có bản mới
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"], // Các file static
      manifest: {
        name: "Tên App Của Bạn",
        short_name: "AppShortName",
        description: "Mô tả về ứng dụng React PWA",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png", // Bạn phải có file này trong folder public
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png", // Bạn phải có file này trong folder public
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
