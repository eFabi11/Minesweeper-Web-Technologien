import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'public', // This is where the Vite build will output to
    assetsDir: 'assets', // This is the folder for your assets (e.g., images, styles)
    rollupOptions: {
      input: {
        main: 'main.js', // Your main entry JS file
      }
    }
  },
  server: {
    proxy: {
      '/assets': 'http://localhost:9000', // Play Framework assets proxying (optional)
    }
  }
});
