import { LayoutNode, LayoutEdge, autoLayout } from './autoLayout'
import { createShapeId, Editor } from '@tldraw/tldraw'
import type { DiagramData } from '@shared/types'
import { getNodeConfig } from './nodeTypeMapping'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateDiagram(editor: Editor, data: DiagramData, explanation: string = '') {
    if (!editor) return

    // 1. Prepare data for Dagre (Layout)
    const nodeWidth = 200
    const nodeHeight = 80

    const layoutNodes: LayoutNode[] = data.nodes.map((node) => ({
        id: node.id,
        width: nodeWidth,
        height: nodeHeight,
    }))

    const layoutEdges: LayoutEdge[] = data.edges.map((edge) => ({
        from: edge.source,
        to: edge.target,
    }))

    // 2. Calculate Layout
    // Direction 'LR' (Left to Right) is generally better for architectures
    const layout = autoLayout(layoutNodes, layoutEdges, 'LR')

    // 3. Create Nodes
    data.nodes.forEach((node) => {
        const position = layout.nodes.get(node.id)
        if (!position) return

        // Mapped Configuration (color, etc.)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const config = getNodeConfig(node.type)

        // Create Shape ID (deterministic or random)
        // We use a custom ID to easily find it if needed, or let Tldraw generate one
        // Here we generate a new one to avoid collisions with existing shapes
        const shapeId = createShapeId()

        // Determine specific properties based on type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let props: any = {
            w: nodeWidth,
            h: nodeHeight,
            text: node.label,
            nodeType: node.type, // Custom property for our RichNodeShape
        }

        // Special handling for icons
        if (node.type === 'icon' && node.iconName) {
            props = {
                ...props,
                iconName: node.iconName
            }
        }

        editor.createShape({
            id: shapeId,
            type: 'rich-node', // We use our custom shape 'rich-node'
            x: position.x,
            y: position.y,
            props: props,
        })
    })

    // 4. Create Edges (Arrows)
    data.edges.forEach((edge) => {
        // We need the exact positions of the created nodes.
        // Since we just created them, we can rely on the layout calculation.
        const fromNode = layout.nodes.get(edge.source)
        const toNode = layout.nodes.get(edge.target)

        if (!fromNode || !toNode) return

        // Calculate start and end points (centers of nodes)
        const startX = fromNode.x + nodeWidth / 2
        const startY = fromNode.y + nodeHeight / 2
        const endX = toNode.x + nodeWidth / 2
        const endY = toNode.y + nodeHeight / 2

        const arrowProps = {
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            text: edge.label || '',
            arrowheadEnd: 'arrow',
            font: 'draw',
        }

        editor.createShape({
            type: 'arrow',
            x: 0, // Arrows are often defined with relative points, but Tldraw 2.0+ uses absolute or relative depending on config.
            // Actually, in Tldraw SDK, arrows are shapes with 'start' and 'end' handles.
            // If we set x,y to 0, start/end are absolute coordinates.
            y: 0,
            props: arrowProps,
        })
    })

    // 5. Add Explanation (if present)
    if (explanation) {
        // Position: Bottom of the diagram
        // We estimate the height of the diagram
        // let maxY = 0
        // layout.nodes.forEach(pos => {
        //     if (pos.y > maxY) maxY = pos.y
        // })

        // Create a text shape or a "sticky note"
        // editor.createShape({
        //     type: 'note',
        //     x: 0,
        //     y: maxY + 150,
        //     props: {
        //         text: `📝 Résumé IA :\n${explanation}`,
        //         color: 'yellow',
        //     },
        // })
    }

    // 6. Zoom to Fit
    editor.zoomToFit()
}
