import { createShapeId, Editor, DefaultFontStyle, DefaultDashStyle, DefaultSizeStyle } from '@tldraw/tldraw'
import { autoLayout, LayoutNode, LayoutEdge } from './autoLayout'
import type { DiagramData } from '@shared/types'




/**
 * Generates a diagram on the Tldraw editor based on the provided data.
 * It handles creating nodes, edges, applying layout, and animations.
 *
 * @param editor - The Tldraw editor instance.
 * @param data - The diagram data (nodes and edges).
 * @param explanation - Optional textual explanation to add to the canvas.
 */
export async function generateDiagram(
    editor: Editor,
    data: DiagramData,
    explanation: string = '',
): Promise<void> {
    if (!editor || !data.nodes || data.nodes.length === 0) {
        console.error('Invalid diagram data')
        return
    }

    // Global style options (disable "draft" style)
    editor.setStyleForNextShapes(DefaultFontStyle, 'sans')
    editor.setStyleForNextShapes(DefaultDashStyle, 'solid')
    editor.setStyleForNextShapes(DefaultSizeStyle, 'm')

    // Helper for dimensions
    const getNodeDimensions = (type: string) => {
        if (type === 'icon' || type === 'actor' || type === 'mobile' || type === 'payment') return { w: 80, h: 80 }
        if (['server', 'database', 'person'].includes(type)) return { w: 100, h: 100 }
        return { w: 200, h: 60 } // Standard Rectangle
    }

    // 1. Calculate Layout with REAL dimensions
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

    // Calculate layout (TB for top-to-bottom)
    const layout = autoLayout(layoutNodes, layoutEdges, 'TB')

    // 0. ID Mapping: AI ID -> Tldraw ID map
    // Critical for edges to find the correct nodes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const idMap = new Map<string, any>(); // Uses TLShapeId ideally but any passes with createShapeId

    // 2. Setup Camera (Approximation)
    if (layout.width > 0 && layout.height > 0) {
        const center = { x: layout.width / 2, y: layout.height / 2 }
        editor.centerOnPoint({ x: center.x, y: center.y })
        editor.zoomToFit()
    }

    // 3. Animate Nodes
    for (const node of data.nodes) {
        // Generate a fresh Tldraw ID
        const shapeId = createShapeId();
        idMap.set(node.id, shapeId);

        const layoutPos = layout.nodes.get(node.id);
        const x = node.x || layoutPos?.x || 0;
        const y = node.y || layoutPos?.y || 0;
        const dim = getNodeDimensions(node.type)

        // Shape creation logic
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let props: any = {
            w: dim.w,
            h: dim.h,
            text: node.label,
            nodeType: node.type || 'action',
        };

        const shapeType = 'rich-node';

        // CASE A: It's an Icon
        if (node.type === 'icon' && node.iconName) {
            props = { ...props, nodeType: 'icon', iconName: node.iconName };
        }
        // CASE B: Architecture Nodes
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

        // Delay for "Pop" effect
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 4. Animate Edges (Coordinates Mode - Fail-safe)
    for (const edge of data.edges) {
        // Retrieve calculated positions
        const sPos = layout.nodes.get(edge.source)
        const tPos = layout.nodes.get(edge.target)

        // Retrieve metadata for dimensions
        const sNodeData = data.nodes.find(n => n.id === edge.source)
        const tNodeData = data.nodes.find(n => n.id === edge.target)

        if (!sPos || !tPos || !sNodeData || !tNodeData) {
            console.warn(`[DiagramGenerator] Edge ignoré: ${edge.source} -> ${edge.target}`)
            continue
        }

        const sDim = getNodeDimensions(sNodeData.type)
        const tDim = getNodeDimensions(tNodeData.type)

        // Calculate centers
        const startX = sPos.x + sDim.w / 2
        const startY = sPos.y + sDim.h / 2
        const endX = tPos.x + tDim.w / 2
        const endY = tPos.y + tDim.h / 2

        const arrowId = createShapeId()

        // A. The Arrow (Absolute Points)
        editor.createShape({
            id: arrowId,
            type: 'arrow',
            x: 0,
            y: 0,
            props: {
                // Pass explicit points {x, y}
                start: { x: startX, y: startY },
                end: { x: endX, y: endY },
                arrowheadStart: 'none',
                arrowheadEnd: 'arrow',
            },
        })

        // B. The Label (Always separate for safety)
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

        // Delay for "Live drawing" effect
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 5. Add explanation (if present)
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

    // 5. Final: Perfect Framing
    editor.zoomToFit()
}
