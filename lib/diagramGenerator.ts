import { createShapeId, Editor, AssetRecordType } from '@tldraw/tldraw'
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
        let iconUrl = config.iconUrl

        // DÉTECTION INTELLIGENTE DE LOGO (Mini-hack pour l'effet Wow)
        const labelLower = node.label.toLowerCase()
        if (labelLower.includes('aws')) iconUrl = 'https://cdn.simpleicons.org/amazonaws/232F3E'
        if (labelLower.includes('react')) iconUrl = 'https://cdn.simpleicons.org/react/61DAFB'
        if (labelLower.includes('next')) iconUrl = 'https://cdn.simpleicons.org/nextdotjs/000000'
        if (labelLower.includes('node')) iconUrl = 'https://cdn.simpleicons.org/nodedotjs/339933'
        if (labelLower.includes('docker')) iconUrl = 'https://cdn.simpleicons.org/docker/2496ED'
        if (labelLower.includes('postgres')) iconUrl = 'https://cdn.simpleicons.org/postgresql/336791'
        if (labelLower.includes('mongo')) iconUrl = 'https://cdn.simpleicons.org/mongodb/47A248'
        if (labelLower.includes('firebase')) iconUrl = 'https://cdn.simpleicons.org/firebase/FFCA28'
        if (labelLower.includes('vercel')) iconUrl = 'https://cdn.simpleicons.org/vercel/000000'
        if (labelLower.includes('supabase')) iconUrl = 'https://cdn.simpleicons.org/supabase/3ECF8E'

        // 1. Créer la shape container (geo)
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
                fill: 'semi', // 'semi' est plus joli que 'solid'
                text: node.label, // Tldraw gère le texte centré nativement dans 'geo'
                font: 'sans',
                size: 's',
            },
        })

        const shapesToGroup = [shapeId]

        // 2. Créer l'icône si une URL est fournie
        if (iconUrl) {
            const assetId = AssetRecordType.createId()
            const iconId = createShapeId()
            const iconSize = 32

            // Créer l'asset pour l'image
            editor.createAssets([{
                id: assetId,
                type: 'image',
                typeName: 'asset',
                props: {
                    name: 'icon',
                    src: iconUrl,
                    w: iconSize,
                    h: iconSize,
                    mimeType: 'image/svg+xml',
                    isAnimated: false
                },
                meta: {}
            }])

            // Positionner l'icône (Un peu décalé comme demandé)
            const iconX = position.x + 10
            const iconY = position.y + 10

            editor.createShape({
                id: iconId,
                type: 'image',
                x: iconX,
                y: iconY,
                props: {
                    assetId: assetId,
                    w: iconSize,
                    h: iconSize,
                },
            })
            shapesToGroup.push(iconId)
        }

        // Grouper les éléments (C'est mieux pour l'UX même si "gardons simple")
        if (shapesToGroup.length > 1) {
            editor.groupShapes(shapesToGroup)
        }
    })

    // Créer les flèches entre les nœuds
    data.edges.forEach((edge) => {
        const fromNode = layout.nodes.get(edge.source)
        const toNode = layout.nodes.get(edge.target)

        if (!fromNode || !toNode) return

        const arrowId = createShapeId()

        // Calculer les coordonnées du centre des nœuds
        const fromCenterX = fromNode.x + DEFAULT_NODE_WIDTH / 2
        const fromCenterY = fromNode.y + DEFAULT_NODE_HEIGHT / 2
        const toCenterX = toNode.x + DEFAULT_NODE_WIDTH / 2
        const toCenterY = toNode.y + DEFAULT_NODE_HEIGHT / 2

        // Créer une flèche
        editor.createShape({
            id: arrowId,
            type: 'arrow',
            x: fromCenterX,
            y: fromCenterY,
            props: {
                start: { x: 0, y: 0 },
                end: {
                    x: toCenterX - fromCenterX,
                    y: toCenterY - fromCenterY,
                },
                color: 'black',
                arrowheadEnd: 'arrow',
                text: edge.label || '',
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
