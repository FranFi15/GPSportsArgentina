// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const API_BASE_URL = import.meta.env.VITE_API_URL

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: API_BASE_URL, // Reemplaza con la URL de tu backend
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});