import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Set VITE_BASE in CI for GitHub project pages (e.g. /createrverse/).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
