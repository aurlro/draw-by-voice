'use client'

import { Tldraw, TLComponents, Editor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useCallback, useMemo } from 'react'
import { RichNodeShapeUtil } from '@features/diagram/shapes/RichNodeShape'

<<<<<<< HEAD
/**
 * Props for the TldrawCanvas component.
 */
interface TldrawCanvasProps {
  /** Callback triggered when the Tldraw editor is mounted. */
  onMount?: (editor: Editor) => void
}

/**
 * TldrawCanvas Component.
 * Wraps the Tldraw editor with custom configurations and shape utilities.
 * Configures the UI to be minimal (hides default toolbar, menu, etc.) for a focused experience.
 *
 * @param props - The props for the component.
 * @returns The rendered TldrawCanvas component.
 */
=======
interface TldrawCanvasProps {
  onMount?: (editor: Editor) => void
}

>>>>>>> origin/enhance-diagram-visuals-bindings
export default function TldrawCanvas({ onMount }: TldrawCanvasProps) {
  const handleMount = useCallback((editor: Editor) => {
    if (onMount) {
      onMount(editor)
    }
  }, [onMount])

<<<<<<< HEAD
  // Configuration to disable all default UI elements
=======
  // Configuration pour désactiver tous les éléments UI par défaut
>>>>>>> origin/enhance-diagram-visuals-bindings
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
        shapeUtils={useMemo(() => [RichNodeShapeUtil], [])}
        hideUi={true}
        overrides={{
          translations: {
            fr: {
              'fill-style.lined-fill': 'Remplissage ligné'
            }
          }
        }}
      />
    </div>
  )
}
