import { createShapeId, Editor, DefaultFontStyle, DefaultDashStyle, DefaultSizeStyle, TLShapeId } from '@tldraw/tldraw'
// @ts-ignore - toRichText might be missing in type definitions but present in runtime or tldraw package
import { toRichText } from '@tldraw/tldraw'
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
    const idMap = new Map<string, TLShapeId>();

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
        let props: Record<string, unknown> = {
            w: dim.w,
            h: dim.h,
            text: node.label,
            nodeType: node.type || 'action',
        };

        const shapeType = 'rich-node';

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

    // 4. Animation des Liens (Mode Bindings - Connexions réelles)
    for (const edge of data.edges) {
        // Récupérer les IDs Tldraw des nœuds
        const sourceShapeId = idMap.get(edge.source)
        const targetShapeId = idMap.get(edge.target)

        if (!sourceShapeId || !targetShapeId) {
            console.warn(`[DiagramGenerator] Edge ignoré: ${edge.source} -> ${edge.target} (IDs introuvables)`)
            continue
        }

        const arrowId = createShapeId()

        // A. La Flèche
        // Note: text prop is deprecated/removed in favor of richText
        let arrowProps: any = {
            start: { x: 0, y: 0 },
            end: { x: 0, y: 0 },
            arrowheadStart: 'none',
            arrowheadEnd: 'arrow',
            font: 'draw',
        }

        if (edge.label && typeof toRichText === 'function') {
             arrowProps.richText = toRichText(edge.label)
        }

        editor.createShape({
            id: arrowId,
            type: 'arrow',
            x: 0,
            y: 0,
            props: arrowProps,
        })

        // B. Bindings
        // Dans les versions récentes de tldraw, les bindings sont des enregistrements séparés
        editor.createBindings([
            {
                fromId: arrowId,
                toId: sourceShapeId,
                type: 'arrow',
                props: {
                    terminal: 'start',
                    normalizedAnchor: { x: 0.5, y: 0.5 },
                    isExact: false,
                    isPrecise: false,
                },
            },
            {
                fromId: arrowId,
                toId: targetShapeId,
                type: 'arrow',
                props: {
                    terminal: 'end',
                    normalizedAnchor: { x: 0.5, y: 0.5 },
                    isExact: false,
                    isPrecise: false,
                },
            },
        ])

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
