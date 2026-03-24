import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward GraphQL traffic
      '/graphql': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // NEW: Forward all standard REST API traffic (Login/Register)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})