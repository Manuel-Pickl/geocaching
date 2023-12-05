import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true }),
    VitePWA({
      manifest: {
        name: 'Geocaching',
        short_name: 'Geocaching',
        description: 'Erkunden Sie Ihre Umwelt!',
        theme_color: 'hsl(0, 0%, 10%)',
        background_color: 'hsl(0, 0%, 10%)',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: '/globe.svg',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
