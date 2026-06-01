import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Custom plugin to handle file saving during development
const saveFilePlugin = () => ({
  name: 'save-file-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.method === 'GET' && req.url === '/api/data') {
        try {
          const jobsDir = path.resolve(process.cwd(), 'interviews/jobs')
          const candidatesBaseDir = path.resolve(process.cwd(), 'interviews/candidates')
          
          // Helper to parse simple YAML frontmatter
          const parseFile = (filePath) => {
            const content = fs.readFileSync(filePath, 'utf8')
            const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
            if (!match) return { metadata: {}, content }
            
            const yaml = match[1]
            const body = match[2]
            const metadata = {}
            yaml.split('\n').forEach(line => {
              const [key, ...val] = line.split(':')
              if (key && val) metadata[key.trim()] = val.join(':').trim()
            })
            return { metadata, content: body }
          }

          // Scan Jobs
          const jobs = fs.existsSync(jobsDir) 
            ? fs.readdirSync(jobsDir)
                .filter(f => f.endsWith('.md'))
                .map(f => {
                  const { metadata } = parseFile(path.join(jobsDir, f))
                  return { id: f.replace('.md', ''), ...metadata }
                })
            : []

          // Scan Candidates
          const candidates = []
          if (fs.existsSync(candidatesBaseDir)) {
            const dirs = fs.readdirSync(candidatesBaseDir)
            for (const dir of dirs) {
              const notesPath = path.join(candidatesBaseDir, dir, 'notes.md')
              const feedbackPath = path.join(candidatesBaseDir, dir, 'feedback.md')
              
              if (fs.existsSync(notesPath)) {
                const { metadata, content: notesContent } = parseFile(notesPath)
                let feedbackContent = ''
                if (fs.existsSync(feedbackPath)) {
                  feedbackContent = fs.readFileSync(feedbackPath, 'utf8').replace(/^---[\s\S]*?---\n/, '')
                }
                
                // Extract scores from notes content if possible
                const scores = {}
                const scoreMatches = notesContent.match(/- \*\*([\s\S]*?):\*\* ([\d.]+)/g)
                if (scoreMatches) {
                  scoreMatches.forEach(m => {
                    const [_, skill, score] = m.match(/- \*\*([\s\S]*?):\*\* ([\d.]+)/)
                    scores[skill] = parseFloat(score)
                  })
                }

                candidates.push({
                  ...metadata,
                  rawNotes: notesContent,
                  feedback: feedbackContent,
                  scores
                })
              }
            }
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ jobs, candidates }))
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Failed to scan data', details: error.message }))
        }
      } else if (req.method === 'POST' && req.url === '/api/save') {
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
