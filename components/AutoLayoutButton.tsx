'use client'

import { createShapeId, Editor } from '@tldraw/tldraw'
import { autoLayout, LayoutNode, LayoutEdge } from '@/lib/autoLayout'

interface AutoLayoutButtonProps {
    editor: Editor
}

export default function AutoLayoutButton({ editor }: AutoLayoutButtonProps) {
    const handleGenerateDiagram = () => {
        if (!editor) return

        // Définir les dimensions des nœuds
        const nodeWidth = 150
        const nodeHeight = 80

        // Définir les nœuds du diagramme (3 serveurs + 1 DB)
        const nodeDefinitions: LayoutNode[] = [
            { id: 'server1', width: nodeWidth, height: nodeHeight },
            { id: 'server2', width: nodeWidth, height: nodeHeight },
            { id: 'server3', width: nodeWidth, height: nodeHeight },
            { id: 'database', width: nodeWidth, height: nodeHeight },
        ]

        // Définir les connexions (tous les serveurs vers la DB)
        const edgeDefinitions: LayoutEdge[] = [
            { from: 'server1', to: 'database' },
            { from: 'server2', to: 'database' },
            { from: 'server3', to: 'database' },
        ]

        // Calculer le layout avec dagre (Left-to-Right)
        const layout = autoLayout(nodeDefinitions, edgeDefinitions, 'LR')

        // Créer un Map pour stocker les IDs des shapes créées
        const shapeIds = new Map<string, string>()

        // Configuration des couleurs et labels
        const nodeConfig = {
            server1: { label: 'Server 1', color: 'blue' },
            server2: { label: 'Server 2', color: 'blue' },
            server3: { label: 'Server 3', color: 'blue' },
            database: { label: 'Database', color: 'red' },
        }

        // Créer toutes les shapes des nœuds aux positions calculées
        nodeDefinitions.forEach((node) => {
            const position = layout.nodes.get(node.id)
            if (!position) return

            const shapeId = createShapeId()
            shapeIds.set(node.id, shapeId)

            const config = nodeConfig[node.id as keyof typeof nodeConfig]

            editor.createShape({
                id: shapeId,
                type: 'geo',
                x: position.x,
                y: position.y,
                props: {
                    geo: 'rectangle',
                    w: node.width,
                    h: node.height,
                    color: config.color,
                    fill: 'solid',
                },
            })
        })

        // Créer les flèches (arrows) entre les nœuds
        edgeDefinitions.forEach((edge) => {
            const fromNode = layout.nodes.get(edge.from)
            const toNode = layout.nodes.get(edge.to)
            const fromNodeDef = nodeDefinitions.find(n => n.id === edge.from)
            const toNodeDef = nodeDefinitions.find(n => n.id === edge.to)

            if (!fromNode || !toNode || !fromNodeDef || !toNodeDef) return

            const arrowId = createShapeId()

            // Calculer les coordonnées du centre des nœuds
            const fromCenterX = fromNode.x + fromNodeDef.width / 2
            const fromCenterY = fromNode.y + fromNodeDef.height / 2
            const toCenterX = toNode.x + toNodeDef.width / 2
            const toCenterY = toNode.y + toNodeDef.height / 2

            // Créer une flèche en utilisant des coordonnées de points
            editor.createShape({
                id: arrowId,
                type: 'arrow',
                x: fromCenterX,
                y: fromCenterY,
                props: {
                    start: {
                        x: 0,
                        y: 0,
                    },
                    end: {
                        x: toCenterX - fromCenterX,
                        y: toCenterY - fromCenterY,
                    },
                    color: 'black',
                    arrowheadEnd: 'arrow',
                },
            })
        })

        // Note: Les labels peuvent être ajoutés manuellement en double-cliquant sur les shapes
        // La configuration des labels sera gérée dans la Phase 3 avec l'IA vocale

        // Zoomer pour afficher tout le diagramme
        editor.zoomToFit()
    }

    return (
        <button
            onClick={handleGenerateDiagram}
            className="fixed top-20 right-4 z-50 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
            Auto Layout Test
        </button>
    )
}
