import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './ui',
  server: {
    proxy: {
      '/api': 'http://localhost:5173/api/v1'
    }
  },

  plugins: [react()],
    base: '/hrms', // Comment out or remove for development
    build: {
      assetsDir: 'assets',
      sourcemap: true,
      minify: false
  
    },
    
})
