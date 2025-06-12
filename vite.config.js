import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'Gusto',
        name: 'Gusto Dakhla',
        icons: [
          {
            src: '/gustologo.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
          }
        ],
        start_url: '/',
        display: 'standalone',
        theme_color: '#ff5722',
        background_color: '#ffffff',
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://laravelapi-production-64b8.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
