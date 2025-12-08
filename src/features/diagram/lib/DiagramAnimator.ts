import { Editor, createShapeId, TLShapeId } from '@tldraw/tldraw'
import { DiagramData } from '@shared/types'
import { autoLayout, LayoutNode, LayoutEdge } from './autoLayout'
import { DefaultFontStyle, DefaultDashStyle, DefaultSizeStyle } from '@tldraw/tldraw'

const DEFAULT_NODE_WIDTH = 200
const DEFAULT_NODE_HEIGHT = 60
const ANIMATION_DELAY_MS = 250
const TEXT_STREAM_SPEED_MS = 20

/**
 * Orchestrator for diagram creation animation.
 */
export class DiagramAnimator {
    private editor: Editor
    private isAnimating: boolean = false
    private abortController: AbortController | null = null

    constructor(editor: Editor) {
        this.editor = editor
    }

    /**
     * Animates the generation of the diagram.
     * @param data - The diagram data.
     * @param explanation - Optional explanation text.
     */
    async animate(data: DiagramData, explanation: string = '') {
        if (this.isAnimating) {
            this.cancel()
        }

        this.isAnimating = true
        this.abortController = new AbortController()

        try {
            // Style configuration
            this.editor.setStyleForNextShapes(DefaultFontStyle, 'sans')
            this.editor.setStyleForNextShapes(DefaultDashStyle, 'solid')
            this.editor.setStyleForNextShapes(DefaultSizeStyle, 'm')

            // 1. Calculate Layout (identical to diagramGenerator)
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

            // 2. Progressive creation of nodes
            for (const node of data.nodes) {
                if (this.abortController?.signal.aborted) break

                const layoutPos = layout.nodes.get(node.id)
                const x = node.x || layoutPos?.x || 0
                const y = node.y || layoutPos?.y || 0

                // Create node
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await this.createNodeAnimated(node as any, x, y) // Removed unused shapeId

                // Wait a bit before the next one
                await this.wait(ANIMATION_DELAY_MS)
            }

            // 3. Create edges (grouped for now)
            if (!this.abortController?.signal.aborted) {
                this.createEdges(data.edges, layout)
            }

            // 4. Add explanation (streaming)
            if (explanation && !this.abortController?.signal.aborted) {
                await this.wait(500)
                await this.streamExplanation(explanation, (layout.width || 0) + 50)
            }

            this.editor.zoomToFit()

        } catch (error) {
            console.error('Animation error:', error)
        } finally {
            this.isAnimating = false
            this.abortController = null
        }
    }

    /**
     * Creates a node with text animation.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async createNodeAnimated(node: any, x: number, y: number): Promise<TLShapeId> {
        // Validation and formatting of Tldraw ID (must start with 'shape:')
        let shapeId: TLShapeId
        if (typeof node.id === 'string' && node.id.startsWith('shape:')) {
            shapeId = node.id as TLShapeId
        } else if (typeof node.id === 'string') {
            // If ID is a simple string (e.g. 'node-1'), prefix it
            shapeId = `shape:${node.id}` as TLShapeId
        } else {
            // Fallback
            shapeId = createShapeId()
        }

        // Determine type and initial props (Universal Rich Node)
        const type = 'rich-node'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let props: any = {
            w: DEFAULT_NODE_WIDTH,
            h: DEFAULT_NODE_HEIGHT,
            text: '', // Start empty for streaming
            nodeType: node.type || 'action',
        }

        // Special cases: Adapt props for RichNodeShape
        if (node.type === 'icon' && node.iconName) {
            props = {
                w: 80, h: 80,
                text: '', // Label separated or integrated? Integrated in RichNodeShape.
                nodeType: 'icon',
                iconName: node.iconName,
            }
        } else if (node.type === 'actor') {
            // Actor -> nodeType='person' (mapped to User icon in RichNodeShape)
            props = {
                w: 80, h: 80,
                text: '',
                nodeType: 'person',
            }
        }

        // Initial shape creation
        this.editor.createShape({
            id: shapeId,
            type,
            x,
            y,
            props,
        })

        // "Streaming Text" animation
        const fullText = node.label || ''
        if (fullText) {
            await this.streamTextToShape(shapeId, fullText)
        }

        return shapeId
    }

    /**
     * Simulates text writing character by character.
     */
    private async streamTextToShape(shapeId: TLShapeId, fullText: string) {
        for (let i = 1; i <= fullText.length; i++) {
            if (this.abortController?.signal.aborted) return

            const partialText = fullText.slice(0, i)

            this.editor.updateShape({
                id: shapeId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type: (this.editor.getShape(shapeId)?.type as any) || 'rich-node',
                props: { text: partialText }
            })

            // Slight speed variation for "human" effect
            const randomDelay = TEXT_STREAM_SPEED_MS + Math.random() * 10
            await this.wait(randomDelay)
        }
    }

    /**
     * Creates edges.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private createEdges(edges: any[], layout: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        edges.forEach((edge: any) => {
            const fromNode = layout.nodes.get(edge.source)
            const toNode = layout.nodes.get(edge.target)
            if (!fromNode || !toNode) return

            this.editor.createShape({
                type: 'arrow',
                props: {
                    start: { x: fromNode.x + DEFAULT_NODE_WIDTH / 2, y: fromNode.y + DEFAULT_NODE_HEIGHT / 2 },
                    end: { x: toNode.x + DEFAULT_NODE_WIDTH / 2, y: toNode.y + DEFAULT_NODE_HEIGHT / 2 },
                    arrowheadEnd: 'arrow',
                },
            })
        })
    }

    /**
     * Streams the final explanation.
     */
    private async streamExplanation(text: string, x: number) {
        const id = createShapeId()
        this.editor.createShape({
            id,
            type: 'rich-node', // Universal shape
            x,
            y: 0,
            props: {
                w: 300,
                h: 200, // Approximate height, RichNode uses HTMLContainer so content adapts
                text: '',
                nodeType: 'explanation',
            },
        })

        await this.streamTextToShape(id, text)
    }

    private wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * Cancels the current animation.
     */
    cancel() {
        if (this.abortController) {
            this.abortController.abort()
        }
    }
}
