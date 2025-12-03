import { createShapeId, Editor } from '@tldraw/tldraw'
import { autoLayout, LayoutNode, LayoutEdge } from './autoLayout'
import { DiagramData } from './functionDefinitions'
import { getNodeConfig } from './nodeTypeMapping'

const DEFAULT_NODE_WIDTH = 160
const DEFAULT_NODE_HEIGHT = 90

export function generateDiagram(
    editor: Editor,
    data: DiagramData,
    explanation: string = '',
): void {
    if (!editor || !data.nodes || data.nodes.length === 0) {
        console.error('Invalid diagram data')
        return
    }

    // 1. Calcul du Layout
    const layoutNodes: LayoutNode[] = data.nodes.map((node) => ({
        id: node.id,
        width: DEFAULT_NODE_WIDTH,
        height: DEFAULT_NODE_HEIGHT,
    }))

    const layoutEdges: LayoutEdge[] = data.edges.map((edge) => ({
        from: edge.source,
        to: edge.target,
    }))

    const layout = autoLayout(layoutNodes, layoutEdges, 'LR')

    // 2. Création des noeuds
    data.nodes.forEach((node) => {
        const position = layout.nodes.get(node.id)
        if (!position) return

        const shapeId = createShapeId()
        const config = getNodeConfig(node.type)

        let iconUrl = config.iconUrl
        // Petit hack pour les logos (Demo effect)
        const labelLower = node.label.toLowerCase()
        if (labelLower.includes('aws')) iconUrl = 'https://cdn.simpleicons.org/amazonaws/232F3E'
        if (labelLower.includes('react')) iconUrl = 'https://cdn.simpleicons.org/react/61DAFB'
        if (labelLower.includes('next')) iconUrl = 'https://cdn.simpleicons.org/nextdotjs/000000'
        if (labelLower.includes('node')) iconUrl = 'https://cdn.simpleicons.org/nodedotjs/339933'
        if (labelLower.includes('db') || labelLower.includes('sql')) iconUrl = 'https://cdn.simpleicons.org/postgresql/black'

        // On utilise 'geo' (rectangle) qui est très sûr
        editor.createShape({
            id: shapeId,
            type: 'geo',
            x: position.x,
            y: position.y,
            props: {
                geo: config.geo || 'rectangle',
                w: DEFAULT_NODE_WIDTH,
                h: DEFAULT_NODE_HEIGHT,
                color: config.color || 'black',
                fill: 'semi',
                text: node.label,
                font: 'sans',
                size: 's',
                align: 'middle',
                verticalAlign: 'middle',
            },
        })

        if (iconUrl) {
            editor.createShape({
                type: 'image',
                x: position.x + 10,
                y: position.y + 10,
                props: {
                    w: 32,
                    h: 32,
                    url: iconUrl,
                },
            })
        }
    })

    // 3. Création des liens
    data.edges.forEach((edge) => {
        const fromNode = layout.nodes.get(edge.source)
        const toNode = layout.nodes.get(edge.target)
        if (!fromNode || !toNode) return

        editor.createShape({
            type: 'arrow',
            props: {
                start: { x: fromNode.x + DEFAULT_NODE_WIDTH / 2, y: fromNode.y + DEFAULT_NODE_HEIGHT / 2 },
                end: { x: toNode.x + DEFAULT_NODE_WIDTH / 2, y: toNode.y + DEFAULT_NODE_HEIGHT / 2 },
                text: edge.label || '',
                arrowheadEnd: 'arrow',
                font: 'mono',
                size: 's'
            },
        })
    })

    // 4. Explication (C'est ici que ça crashait avec 'note')
    // On utilise 'text' simple maintenant
    if (explanation && explanation.length > 0) {
        const textX = layout.width + 100
        editor.createShape({
            type: 'text',
            x: textX,
            y: 0,
            props: {
                text: explanation,
                font: 'sans',
                size: 'm',
                align: 'start',
                color: 'black',
                w: 400 // Largeur fixe pour le retour à la ligne
            }
        })
    }

    editor.zoomToFit()
}
