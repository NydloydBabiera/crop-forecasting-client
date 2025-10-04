import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load .env files based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      host: env.VITE_HOST,     // default host if not defined
      port: Number(env.VITE_PORT),  // default port if not defined
    },
  }
})