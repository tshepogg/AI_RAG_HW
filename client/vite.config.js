import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/pdfs': 'https://ai-rag-hw.onrender.com',
      '/ask': 'https://ai-rag-hw.onrender.com',
      '/view': 'https://ai-rag-hw.onrender.com',
    },
  },
});
