import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const apiServiceUrl =
  process.env.services__apiservice__https__0 ??
  process.env.services__apiservice__http__0 ??
  'http://localhost:5000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    host: true,
    proxy: {
      '/products': {
        target: apiServiceUrl,
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: apiServiceUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
