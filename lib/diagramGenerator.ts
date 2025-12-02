import { createShapeId, Editor } from '@tldraw/tldraw'
import { autoLayout, LayoutNode, LayoutEdge } from './autoLayout'
import { DiagramData } from './functionDefinitions'
import { getNodeConfig } from './nodeTypeMapping'

/**
 * Dimensions par défaut des nodes
 */
const DEFAULT_NODE_WIDTH = 150
const DEFAULT_NODE_HEIGHT = 80

/**
 * Génère un diagramme sur le canvas tldraw à partir des données de l'IA
 * 
 * @param editor - Instance de l'éditeur tldraw
 * @param data - Données du diagramme (nodes + edges)
 * @param direction - Direction du layout ('LR' ou 'TB')
 */
export function generateDiagram(
    editor: Editor,
    data: DiagramData,
    direction: 'LR' | 'TB' = 'LR'
): void {
    if (!editor || !data.nodes || data.nodes.length === 0) {
        console.error('Invalid editor or diagram data')
        return
    }

    // Convertir les nodes AI vers le format autoLayout
    const layoutNodes: LayoutNode[] = data.nodes.map((node) => ({
        id: node.id,
        width: DEFAULT_NODE_WIDTH,
        height: DEFAULT_NODE_HEIGHT,
    }))

    // Convertir les edges AI vers le format autoLayout
    const layoutEdges: LayoutEdge[] = data.edges.map((edge) => ({
        from: edge.source,
        to: edge.target,
    }))

    // Calculer les positions avec dagre
    const layout = autoLayout(layoutNodes, layoutEdges, direction)

    // Map pour stocker les IDs des shapes créées
    const shapeIds = new Map<string, string>()

    // Créer toutes les shapes des nœuds aux positions calculées
    data.nodes.forEach((node) => {
        const position = layout.nodes.get(node.id)
        if (!position) return

        const shapeId = createShapeId()
        shapeIds.set(node.id, shapeId)

        // Obtenir la configuration visuelle pour ce type de node
        const config = getNodeConfig(node.type)

        // Créer la shape rectangle avec la couleur appropriée
        editor.createShape({
            id: shapeId,
            type: 'geo',
            x: position.x,
            y: position.y,
            props: {
                geo: config.geo,
                w: DEFAULT_NODE_WIDTH,
                h: DEFAULT_NODE_HEIGHT,
                color: config.color,
                fill: 'solid',
            },
        })
    })

    // Créer les flèches entre les nœuds
    data.edges.forEach((edge) => {
        const fromNode = layout.nodes.get(edge.source)
        const toNode = layout.nodes.get(edge.target)
        const fromNodeDef = layoutNodes.find((n) => n.id === edge.source)
        const toNodeDef = layoutNodes.find((n) => n.id === edge.target)

        if (!fromNode || !toNode || !fromNodeDef || !toNodeDef) return

        const arrowId = createShapeId()

        // Calculer les coordonnées du centre des nœuds
        const fromCenterX = fromNode.x + fromNodeDef.width / 2
        const fromCenterY = fromNode.y + fromNodeDef.height / 2
        const toCenterX = toNode.x + toNodeDef.width / 2
        const toCenterY = toNode.y + toNodeDef.height / 2

        // Créer une flèche
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

    // Zoomer pour afficher tout le diagramme
    editor.zoomToFit()

    console.log('✅ Diagram generated:', {
        nodes: data.nodes.length,
        edges: data.edges.length,
        direction,
    })
}
