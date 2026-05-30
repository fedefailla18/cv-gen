import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Custom plugin to handle file saving during development
const saveFilePlugin = () => ({
  name: 'save-file-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.method === 'POST' && req.url === '/api/save') {
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          try {
            const { filePath, content } = JSON.parse(body)
            
            // Security: Only allow writing to specific project directories
            const absolutePath = path.resolve(process.cwd(), filePath)
            const allowedDirs = [
              path.resolve(process.cwd(), 'src'),
              path.resolve(process.cwd(), 'interviews')
            ]
            
            const isAllowed = allowedDirs.some(dir => absolutePath.startsWith(dir))
            
            if (!isAllowed) {
              res.statusCode = 403
              res.end(JSON.stringify({ error: 'Forbidden: Path outside allowed directories' }))
              return
            }

            // Ensure parent directory exists
            fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
            
            // Write the file
            fs.writeFileSync(absolutePath, content, 'utf8')
            
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, path: filePath }))
          } catch (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Failed to save file', details: error.message }))
          }
        })
      } else {
        next()
      }
    })
  }
})

export default defineConfig({
  plugins: [react(), saveFilePlugin()],
})
