'use client'

import { useState } from 'react'
// import { TldrawCanvas, TestButton, AutoLayoutButton, DemoButton } from '@features/diagram'
import { TldrawCanvas, TestButton, AutoLayoutButton } from '@features/diagram'
import { VoiceControl } from '@features/voice'
import { Editor } from '@tldraw/tldraw'

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
          {/* <DemoButton editor={editor} /> */}
          <VoiceControl editor={editor} />
        </>
      )}
    </main>
  )
}
