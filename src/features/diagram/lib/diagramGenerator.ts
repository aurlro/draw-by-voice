import { createShapeId, Editor, DefaultFontStyle, DefaultDashStyle, DefaultSizeStyle } from '@tldraw/tldraw'
import { autoLayout, LayoutNode, LayoutEdge } from './autoLayout'
import type { DiagramData } from '@shared/types'


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

    // Options globales pour le style (désactiver le style "brouillon")
    editor.setStyleForNextShapes(DefaultFontStyle, 'sans')
    editor.setStyleForNextShapes(DefaultDashStyle, 'solid')
    editor.setStyleForNextShapes(DefaultSizeStyle, 'm')

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

    // 3. Créer les nœuds
    data.nodes.forEach((node) => {
        const shapeId = node.id as any; // Cast as any to avoid TLShapeId import issue if not imported
        const layoutPos = layout.nodes.get(node.id);
        const x = node.x || layoutPos?.x || 0;
        const y = node.y || layoutPos?.y || 0;

        // CAS A : C'est une Icône (Logo Tech via Simple Icons)
        if (node.type === 'icon' && node.iconName) {
            editor.createShape({
                id: shapeId,
                type: 'rich-node',
                x: x,
                y: y,
                props: {
                    w: 80,
                    h: 80,
                    text: node.label,
                    nodeType: 'icon',
                    iconName: node.iconName,
                },
            });
        }

        // CAS B : C'est un Acteur (Utilisateur)
        else if (node.type === 'actor') {
            editor.createShape({
                id: shapeId,
                type: 'rich-node',
                x: x,
                y: y,
                props: {
                    w: 80,
                    h: 80,
                    text: node.label,
                    nodeType: 'person',
                },
            });
        }

        // CAS C : C'est une forme standard (Rich Node)
        else {
            editor.createShape({
                id: shapeId,
                type: 'rich-node',
                x: x,
                y: y,
                props: {
                    w: 200,
                    h: 60,
                    text: node.label,
                    nodeType: node.type || 'action', // 'action', 'decision', 'input', etc.
                },
            });
        }
    });

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
                arrowheadEnd: 'arrow',
                // Note: On ne met pas de label sur les flèches pour éviter les problèmes de validation
                // tldraw v4 a une API complexe pour les labels d'arrows
            },
        })
    })

    // 4. Ajouter l'explication (si présente)
    if (explanation && explanation.trim().length > 0) {
        const textX = (layout.width || 0) + 50;

        editor.createShape({
            id: createShapeId(),
            type: 'rich-node',
            x: textX,
            y: 0,
            props: {
                w: 400,
                h: 200,
                text: explanation,
                nodeType: 'explanation',
            },
        });
    }

    editor.zoomToFit()
}
