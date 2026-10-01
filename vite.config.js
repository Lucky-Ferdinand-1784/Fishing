import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Membuka akses jaringan lokal (IP: 192.168.1.6)
    port: 3000,
    open: false
  }
})
