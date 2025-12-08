'use client'

import { createShapeId, Editor } from '@tldraw/tldraw'
import { autoLayout, LayoutNode, LayoutEdge } from '../lib/autoLayout'

/**
 * Props for the AutoLayoutButton component.
 */
interface AutoLayoutButtonProps {
    /** The Tldraw editor instance. */
    editor: Editor
}

/**
 * AutoLayoutButton Component.
 * Renders a button that triggers a hardcoded layout generation for testing purposes.
 * It creates a set of nodes and edges and applies the auto-layout algorithm.
 *
 * @param props - The props for the component.
 * @returns The rendered AutoLayoutButton component.
 */
export default function AutoLayoutButton({ editor }: AutoLayoutButtonProps) {
    /**
     * Handles the diagram generation and layout.
     */
    const handleGenerateDiagram = () => {
        if (!editor) return

        // Define node dimensions
        const nodeWidth = 150
        const nodeHeight = 80

        // Define diagram nodes (3 servers + 1 DB)
        const nodeDefinitions: LayoutNode[] = [
            { id: 'server1', width: nodeWidth, height: nodeHeight },
            { id: 'server2', width: nodeWidth, height: nodeHeight },
            { id: 'server3', width: nodeWidth, height: nodeHeight },
            { id: 'database', width: nodeWidth, height: nodeHeight },
        ]

        // Define connections (all servers to DB)
        const edgeDefinitions: LayoutEdge[] = [
            { from: 'server1', to: 'database' },
            { from: 'server2', to: 'database' },
            { from: 'server3', to: 'database' },
        ]

        // Calculate layout with dagre (Left-to-Right)
        const layout = autoLayout(nodeDefinitions, edgeDefinitions, 'LR')

        // Create a Map to store created shape IDs
        const shapeIds = new Map<string, string>()

        // Configuration for colors and labels
        const nodeConfig = {
            server1: { label: 'Server 1', color: 'blue' },
            server2: { label: 'Server 2', color: 'blue' },
            server3: { label: 'Server 3', color: 'blue' },
            database: { label: 'Database', color: 'red' },
        }

        // Create all node shapes at calculated positions
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

        // Create arrows between nodes
        edgeDefinitions.forEach((edge) => {
            const fromNode = layout.nodes.get(edge.from)
            const toNode = layout.nodes.get(edge.to)
            const fromNodeDef = nodeDefinitions.find(n => n.id === edge.from)
            const toNodeDef = nodeDefinitions.find(n => n.id === edge.to)

            if (!fromNode || !toNode || !fromNodeDef || !toNodeDef) return

            const arrowId = createShapeId()

            // Calculate center coordinates of nodes
            const fromCenterX = fromNode.x + fromNodeDef.width / 2
            const fromCenterY = fromNode.y + fromNodeDef.height / 2
            const toCenterX = toNode.x + toNodeDef.width / 2
            const toCenterY = toNode.y + toNodeDef.height / 2

            // Create an arrow using point coordinates
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

        // Note: Labels can be added manually by double-clicking shapes
        // Label configuration will be handled in Phase 3 with Voice AI

        // Zoom to fit the entire diagram
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
