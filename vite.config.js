import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Plugin to create 200.html for Surge deployment (SPA routing)
const surgePlugin = () => {
  return {
    name: 'surge-spa',
    writeBundle() {
      const distPath = join(process.cwd(), 'dist')
      const indexPath = join(distPath, 'index.html')
      const twoHundredPath = join(distPath, '200.html')
      
      if (existsSync(indexPath)) {
        const indexContent = readFileSync(indexPath, 'utf-8')
        writeFileSync(twoHundredPath, indexContent)
        console.log('✓ Created 200.html for Surge SPA routing')
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), surgePlugin()],
  server: {
    port: 5173,
    strictPort: false,
  },
})
