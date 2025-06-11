import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/accounts': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/movements': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    },
  },
})
