'use client'

import { Tldraw, TLComponents, Editor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useCallback } from 'react'

interface TldrawCanvasProps {
  onMount?: (editor: Editor) => void
}

export default function TldrawCanvas({ onMount }: TldrawCanvasProps) {
  const handleMount = useCallback((editor: Editor) => {
    if (onMount) {
      onMount(editor)
    }
  }, [onMount])

  // Configuration pour désactiver tous les éléments UI par défaut
  const components: TLComponents = {
    Toolbar: null,
    HelpMenu: null,
    MainMenu: null,
    PageMenu: null,
    NavigationPanel: null,
    Minimap: null,
    StylePanel: null,
    ActionsMenu: null,
    QuickActions: null,
    HelperButtons: null,
    DebugPanel: null,
    DebugMenu: null,
    SharePanel: null,
    MenuPanel: null,
    TopPanel: null,
    CursorChatBubble: null,
  }

  return (
    <div className="w-screen h-screen fixed inset-0">
      <Tldraw
        onMount={handleMount}
        components={components}
        hideUi={true}
      />
    </div>
  )
}
