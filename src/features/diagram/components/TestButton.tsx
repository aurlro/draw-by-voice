'use client'

import { createShapeId, Editor } from '@tldraw/tldraw'

interface TestButtonProps {
    editor: Editor
}

export default function TestButton({ editor }: TestButtonProps) {
    const handleAddShape = () => {
        if (!editor) return

        // Créer un ID unique pour la forme
        const shapeId = createShapeId()

        // Obtenir le centre du viewport
        const { x, y, w, h } = editor.getViewportPageBounds()
        const centerX = x + w / 2
        const centerY = y + h / 2

        // Ajouter un rectangle bleu au centre
        // Note: Le texte sera ajouté dans la Phase 2 via une shape séparée ou l'utilisateur peut double-cliquer pour éditer
        editor.createShape({
            id: shapeId,
            type: 'geo',
            x: centerX - 100,
            y: centerY - 50,
            props: {
                geo: 'rectangle',
                w: 200,
                h: 100,
                color: 'blue',
                fill: 'solid',
            },
        })

        // Sélectionner la forme et zoomer dessus
        editor.select(shapeId)
        editor.zoomToSelection()
    }

    return (
        <button
            onClick={handleAddShape}
            className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
            Test
        </button>
    )
}
