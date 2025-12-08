import { createShapeId, Editor, DefaultFontStyle, DefaultDashStyle, DefaultSizeStyle } from '@tldraw/tldraw'
import { autoLayout, LayoutNode, LayoutEdge } from './autoLayout'
import type { DiagramData } from '@shared/types'




export async function generateDiagram(
    editor: Editor,
    data: DiagramData,
    explanation: string = '',
): Promise<void> {
    if (!editor || !data.nodes || data.nodes.length === 0) {
        console.error('Invalid diagram data')
        return
    }

    // Options globales pour le style (désactiver le style "brouillon")
    editor.setStyleForNextShapes(DefaultFontStyle, 'sans')
    editor.setStyleForNextShapes(DefaultDashStyle, 'solid')
    editor.setStyleForNextShapes(DefaultSizeStyle, 'm')

    // Helper pour les dimensions
    const getNodeDimensions = (type: string) => {
        if (type === 'icon' || type === 'actor' || type === 'mobile' || type === 'payment') return { w: 80, h: 80 }
        if (['server', 'database', 'person'].includes(type)) return { w: 100, h: 100 }
        return { w: 200, h: 60 } // Standard Rectangle
    }

    // 1. Calcul du Layout avec les VRAIES dimensions
    const layoutNodes: LayoutNode[] = data.nodes.map((node) => {
        const dim = getNodeDimensions(node.type)
        return {
            id: node.id,
            width: dim.w,
            height: dim.h,
        }
    })

    const layoutEdges: LayoutEdge[] = data.edges.map((edge) => ({
        from: edge.source,
        to: edge.target,
    }))

    // Calcul du layout (TB pour top-to-bottom)
    const layout = autoLayout(layoutNodes, layoutEdges, 'TB')

    // 0. ID Mapping : Table de correspondance ID IA -> ID Tldraw
    // Ceci est crucial pour que les edges retrouvent les bons nodes
    const idMap = new Map<string, any>(); // Utilise TLShapeId idéalement mais any passe avec createShapeId

    // 2. Setup Caméra (Approximation)
    if (layout.width > 0 && layout.height > 0) {
        const center = { x: layout.width / 2, y: layout.height / 2 }
        editor.centerOnPoint({ x: center.x, y: center.y })
        editor.zoomToFit()
    }

    // 3. Animation des Nœuds
    for (const node of data.nodes) {
        // Génération d'un ID Tldraw frais
        const shapeId = createShapeId();
        idMap.set(node.id, shapeId);

        const layoutPos = layout.nodes.get(node.id);
        const x = node.x || layoutPos?.x || 0;
        const y = node.y || layoutPos?.y || 0;
        const dim = getNodeDimensions(node.type)

        // Logique de création de shape
        let props: any = {
            w: dim.w,
            h: dim.h,
            text: node.label,
            nodeType: node.type || 'action',
        };

        let shapeType = 'rich-node';

        // CAS A : C'est une Icône
        if (node.type === 'icon' && node.iconName) {
            props = { ...props, nodeType: 'icon', iconName: node.iconName };
        }
        // CAS B : Architecture Nodes
        else if (['server', 'database', 'person', 'mobile', 'payment', 'actor'].includes(node.type)) {
            props = { ...props, nodeType: node.type === 'actor' ? 'person' : node.type };
        }

        editor.createShape({
            id: shapeId,
            type: shapeType,
            x: x,
            y: y,
            props: props,
        });

        // Délai pour l'effet "Pop"
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 4. Animation des Liens (Mode Coordonnées - Infaillible)
    for (const edge of data.edges) {
        // Retrouver les positions calculées
        const sPos = layout.nodes.get(edge.source)
        const tPos = layout.nodes.get(edge.target)

        // Retrouver les métadonnées pour les dimensions
        const sNodeData = data.nodes.find(n => n.id === edge.source)
        const tNodeData = data.nodes.find(n => n.id === edge.target)

        if (!sPos || !tPos || !sNodeData || !tNodeData) {
            console.warn(`[DiagramGenerator] Edge ignoré: ${edge.source} -> ${edge.target}`)
            continue
        }

        const sDim = getNodeDimensions(sNodeData.type)
        const tDim = getNodeDimensions(tNodeData.type)

        // Calcul des centres
        const startX = sPos.x + sDim.w / 2
        const startY = sPos.y + sDim.h / 2
        const endX = tPos.x + tDim.w / 2
        const endY = tPos.y + tDim.h / 2

        const arrowId = createShapeId()

        // A. La Flèche (Points Absolus)
        editor.createShape({
            id: arrowId,
            type: 'arrow',
            x: 0,
            y: 0,
            props: {
                // On passe des points explicites {x, y}
                start: { x: startX, y: startY },
                end: { x: endX, y: endY },
                arrowheadStart: 'none',
                arrowheadEnd: 'arrow',
            },
        })

        // B. Le Label (Toujours séparé pour la sécurité)
        if (edge.label) {
            const midX = (startX + endX) / 2
            const midY = (startY + endY) / 2

            editor.createShape({
                id: createShapeId(),
                type: 'text',
                x: midX,
                y: midY,
                props: {
                    text: edge.label,
                    size: 's',
                    font: 'draw',
                    textAlign: 'middle',
                    autoSize: true,
                    color: 'grey'
                }
            })
        }

        // Délai pour l'effet "Dessin en direct"
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 5. Ajouter l'explication (si présente)
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

    // 5. Final : Cadrage parfait
    editor.zoomToFit()
}
