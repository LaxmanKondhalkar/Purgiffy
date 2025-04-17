import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        setup: resolve(__dirname, 'src/setup.html'),
      },
      output: {
        // ...existing code...
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});