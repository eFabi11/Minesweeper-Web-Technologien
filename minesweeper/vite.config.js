import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
  },
  
  plugins: [vue()],
  build: {
    outDir: 'public', // This is where the Vite build will output to
    assetsDir: 'assets', // This is the folder for your assets (e.g., images, styles)
    assetsInclude: ['**/*.mp4'],
    rollupOptions: {
      input: {
        main: 'main.js', // Your main entry JS file
      },
    },
  },
  server: {
    proxy: {
      '/assets': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        secure: false,
      },
      '/game': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

