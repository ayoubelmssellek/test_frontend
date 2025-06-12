import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://backendapi-production-17c3.up.railway.app', // العنوان ديال Laravel
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
