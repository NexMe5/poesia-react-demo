import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    // keep every photo as its own hashed file (never inlined), so each is cached once and reused
    assetsInlineLimit: 0,
  },
});
