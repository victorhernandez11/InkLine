import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
    // Ensure deps from shared code resolve to lite's node_modules
    dedupe: ['react', 'react-dom', 'recharts'],
  },
  server: {
    fs: {
      // Allow serving files from the shared package
      allow: [path.resolve(__dirname, '.'), path.resolve(__dirname, '../shared')],
    },
  },
  optimizeDeps: {
    // Tell Vite where to find dependencies for shared code
    include: ['react', 'react-dom', 'recharts'],
  },
});
