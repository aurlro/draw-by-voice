'use client'

import { useState } from 'react'
// import { TldrawCanvas, TestButton, AutoLayoutButton, DemoButton } from '@features/diagram'
import { TldrawCanvas } from '@features/diagram'
import { VoiceControl } from '@features/voice'
import { Editor } from '@tldraw/tldraw'

/**
 * Home Page Component.
 * The main entry point of the application.
 * Renders the Tldraw canvas and the Voice Control interface.
 *
 * @returns The Home page component.
 */
export default function Home() {
  const [editor, setEditor] = useState<Editor | null>(null)

  /**
   * Callback invoked when the Tldraw editor is fully mounted.
   * Stores the editor instance in state for use by other components.
   *
   * @param mountedEditor - The mounted Tldraw Editor instance.
   */
  const handleEditorMount = (mountedEditor: Editor) => {
    setEditor(mountedEditor)
    console.log('✅ Tldraw editor mounted successfully')
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-50">
      <TldrawCanvas onMount={handleEditorMount} />
      {editor && (
        <>
          {/* <DemoButton editor={editor} /> */}
          <VoiceControl editor={editor} />
        </>
      )}
    </main>
  )
}
