// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target:   'http://localhost:8000', // Replace with your backend server URL
        changeOrigin: true, // Changes the origin of the host header to the target URL
        secure: false, // Set to true if your backend uses HTTPS
      },
    },
  },
});