import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/pdfs': 'http://localhost:3000',
      '/ask': 'http://localhost:3000',
      '/view': 'http://localhost:3000',
    },
  },
});
