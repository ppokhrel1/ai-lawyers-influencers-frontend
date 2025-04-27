import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: true  // Listen on all network interfaces
  },
  preview: {
    port: 8080,
    host: true
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "bootstrap/scss/bootstrap";`, // Optional for SCSS
      },
    },
  },
});
