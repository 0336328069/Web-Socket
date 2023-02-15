import { defineConfig } from 'vite'
import { fileURLToPath } from 'url';
import { VitePWA } from 'vite-plugin-pwa'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src"),
    },
  },
  plugins: [
    vue(),
    VitePWA({
      injectRegister: "inline"
    })
  ],
})
