import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    // En desarrollo, /api y /uploads van al servidor PHP local (php -S localhost:8080 -t public)
    proxy: {
      '/api': process.env.API_PROXY_TARGET || 'http://localhost:8080',
      '/uploads': process.env.API_PROXY_TARGET || 'http://localhost:8080',
    },
  },
  base: "/", // ← agrega esto
})