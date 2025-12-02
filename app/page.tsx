'use client'

import { useState } from 'react'
import TldrawCanvas from '@/components/TldrawCanvas'
import { Editor } from '@tldraw/tldraw'
import TestButton from '@/components/TestButton'
import AutoLayoutButton from '@/components/AutoLayoutButton'
import VoiceControl from '@/components/VoiceControl'
import DemoButton from '@/components/DemoButton'

export default function Home() {
  const [editor, setEditor] = useState<Editor | null>(null)

  const handleEditorMount = (mountedEditor: Editor) => {
    setEditor(mountedEditor)
    console.log('✅ Tldraw editor mounted successfully')
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-50">
      <TldrawCanvas onMount={handleEditorMount} />
      {editor && (
        <>
          <TestButton editor={editor} />
          <AutoLayoutButton editor={editor} />
          <DemoButton editor={editor} />
          <VoiceControl editor={editor} />
        </>
      )}
    </main>
  )
}
