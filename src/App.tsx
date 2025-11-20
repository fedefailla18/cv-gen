import React, { useState, useRef } from 'react'
import { Resume } from './types'
import resumeData from './resume.json'
import { useReactToPrint } from 'react-to-print'
import Editor from './components/Editor'
import ThemeSelector from './components/ThemeSelector'
import CVPreview from './components/CVPreview'

const App: React.FC = () => {
  const [resume, setResume] = useState<Resume>(resumeData as unknown as Resume)
  const [theme, setTheme] = useState<'modern' | 'minimal' | 'compact' | 'twocolumn'>('modern')
  const [sections, setSections] = useState<string[]>([
    'basics',
    'work',
    'education',
    'skills',
    'languages'
  ])
  
  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${resume.basics.name}-CV`
  })

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">CV Generator</h1>
          <button 
            onClick={handlePrint} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
          >
            Export to PDF
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-4">
            <ThemeSelector theme={theme} setTheme={(t) => setTheme(t as typeof theme)} />
            <Editor resume={resume} setResume={setResume} />
          </div>

          {/* Right Side - Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div ref={componentRef} className="space-y-4">
                <CVPreview 
                  resume={resume} 
                  sections={sections} 
                  theme={theme}
                  setSections={setSections}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded-lg shadow">
          <p className="font-semibold mb-1">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Edit your CV JSON in the editor on the left</li>
            <li>Drag and drop sections to reorder them</li>
            <li>Switch themes to see different styles</li>
            <li>Click "Export to PDF" to save your CV</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App

