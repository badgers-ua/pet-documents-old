import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  optimizeDeps: {
    include: ['@pdoc/types'],
  },
  build: {
    commonjsOptions: {
      include: ['/libs/types', '/node_modules/'],
    },
  },
});
