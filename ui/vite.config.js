import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './ui',
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:8050/api/v1'
    }
  },
  plugins: [react()],
  build: {
    assetsDir: 'assets',
    sourcemap: true,
    minify: false
  },
})
