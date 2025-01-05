import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true
  },
  plugins: [vue()],
  build: {
    outDir: 'dist', // Standardordner für Build-Output
    assetsDir: 'assets',
    assetsInclude: ['**/*.mp4'],
    rollupOptions: {
      input: {
        main: 'main.js', // Dein Haupt-JavaScript-Einstiegspunkt
      },
    },
  },
  server: {
    port: process.env.PORT || 8000, // Nutzt dynamischen Port oder 3000 als Fallback
    strictPort: true, // Stoppt den Server, wenn der Port belegt ist
    host: '0.0.0.0', // Erlaubt externen Zugriff
    // Proxy nur lokal aktivieren:
    // proxy: {
    //   '/assets': {
    //     target: 'http://localhost:9000',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    //   '/game': {
    //     target: 'http://localhost:9000',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
