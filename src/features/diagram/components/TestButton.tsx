'use client'

import { createShapeId, Editor } from '@tldraw/tldraw'

<<<<<<< HEAD
/**
 * Props for the TestButton component.
 */
interface TestButtonProps {
    /** The Tldraw editor instance. */
    editor: Editor
}

/**
 * TestButton Component.
 * A simple button to add a test shape to the canvas.
 * Used for verifying basic canvas interaction and shape creation.
 *
 * @param props - The props for the component.
 * @returns The rendered TestButton component.
 */
export default function TestButton({ editor }: TestButtonProps) {
    /**
     * Handles adding a test rectangle shape to the center of the viewport.
     */
    const handleAddShape = () => {
        if (!editor) return

        // Create a unique ID for the shape
        const shapeId = createShapeId()

        // Get viewport center
=======
interface TestButtonProps {
    editor: Editor
}

export default function TestButton({ editor }: TestButtonProps) {
    const handleAddShape = () => {
        if (!editor) return

        // Créer un ID unique pour la forme
        const shapeId = createShapeId()

        // Obtenir le centre du viewport
>>>>>>> origin/enhance-diagram-visuals-bindings
        const { x, y, w, h } = editor.getViewportPageBounds()
        const centerX = x + w / 2
        const centerY = y + h / 2

<<<<<<< HEAD
        // Add a blue rectangle at the center
        // Note: Text editing will be handled via user interaction or other logic
=======
        // Ajouter un rectangle bleu au centre
        // Note: Le texte sera ajouté dans la Phase 2 via une shape séparée ou l'utilisateur peut double-cliquer pour éditer
>>>>>>> origin/enhance-diagram-visuals-bindings
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

<<<<<<< HEAD
        // Select the shape and zoom to it
=======
        // Sélectionner la forme et zoomer dessus
>>>>>>> origin/enhance-diagram-visuals-bindings
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
