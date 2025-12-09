import { Editor, createShapeId, TLShapeId } from '@tldraw/tldraw'
import { DiagramData } from '@shared/types'
import { autoLayout, LayoutNode, LayoutEdge } from './autoLayout'
import { DefaultFontStyle, DefaultDashStyle, DefaultSizeStyle } from '@tldraw/tldraw'

const DEFAULT_NODE_WIDTH = 200
const DEFAULT_NODE_HEIGHT = 60
const ANIMATION_DELAY_MS = 250
const TEXT_STREAM_SPEED_MS = 20

/**
 * Orchestrateur pour l'animation de la création du diagramme
 */
export class DiagramAnimator {
    private editor: Editor
    private isAnimating: boolean = false
    private abortController: AbortController | null = null

    constructor(editor: Editor) {
        this.editor = editor
    }

    /**
     * Anime la génération du diagramme
     */
    async animate(data: DiagramData, explanation: string = '') {
        if (this.isAnimating) {
            this.cancel()
        }

        this.isAnimating = true
        this.abortController = new AbortController()

        try {
            // Configuration du style
            this.editor.setStyleForNextShapes(DefaultFontStyle, 'sans')
            this.editor.setStyleForNextShapes(DefaultDashStyle, 'solid')
            this.editor.setStyleForNextShapes(DefaultSizeStyle, 'm')

            // 1. Calcul du Layout (identique à diagramGenerator)
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

            // 2. Création progressive des nœuds
            for (const node of data.nodes) {
                if (this.abortController.signal.aborted) break

                const layoutPos = layout.nodes.get(node.id)
                const x = node.x || layoutPos?.x || 0
                const y = node.y || layoutPos?.y || 0

                // Créer le nœud
                await this.createNodeAnimated(node, x, y)

                // Attendre un peu avant le prochain
                await this.wait(ANIMATION_DELAY_MS)
            }

            // 3. Création des liens (tous d'un coup ou animés aussi ? Disons groupés pour l'instant)
            if (!this.abortController.signal.aborted) {
                this.createEdges(data.edges, layout)
            }

            // 4. Ajouter l'explication (streaming)
            if (explanation && !this.abortController.signal.aborted) {
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
     * Crée un nœud avec animation de texte
     */
    private async createNodeAnimated(node: { id: string, type?: string, iconName?: string, label?: string }, x: number, y: number): Promise<TLShapeId> {
        // Validation et formatage de l'ID Tldraw (doit commencer par 'shape:')
        let shapeId: TLShapeId
        if (typeof node.id === 'string' && node.id.startsWith('shape:')) {
            shapeId = node.id as TLShapeId
        } else if (typeof node.id === 'string') {
            // Si l'ID est une simple string (ex: 'node-1'), on le préfixe
            shapeId = `shape:${node.id}` as TLShapeId
        } else {
            // Fallback
            shapeId = createShapeId()
        }

        // Déterminer le type et les props initiales (Universal Rich Node)
        const type = 'rich-node'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let props: any = {
            w: DEFAULT_NODE_WIDTH,
            h: DEFAULT_NODE_HEIGHT,
            text: '', // On commence vide pour le streaming
            nodeType: node.type || 'action',
        }

        // Cas spéciaux: Adapter les props pour RichNodeShape
        if (node.type === 'icon' && node.iconName) {
            props = {
                w: 80, h: 80,
                text: '', // Label séparé ou intégré ? Intégré dans RichNodeShape (voir composant) -> Ah non, RichNodeShape affiche text en bas.
                // Wait, logic change: RichNodeShape now handles icon display internally if nodeType='icon'
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

        // Création de la forme initiale
        this.editor.createShape({
            id: shapeId,
            type,
            x,
            y,
            props,
        })

        // Animation "Streaming Text"
        const fullText = node.label || ''
        if (fullText) {
            await this.streamTextToShape(shapeId, fullText)
        }

        return shapeId
    }

    /**
     * Simule l'écriture du texte caractère par caractère
     */
    private async streamTextToShape(shapeId: TLShapeId, fullText: string) {
        for (let i = 1; i <= fullText.length; i++) {
            if (this.abortController?.signal.aborted) return

            const partialText = fullText.slice(0, i)

            this.editor.updateShape({
                id: shapeId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type: this.editor.getShape(shapeId)?.type as any,
                props: { text: partialText }
            })

            // Variation légère de la vitesse pour effet "humain"
            const randomDelay = TEXT_STREAM_SPEED_MS + Math.random() * 10
            await this.wait(randomDelay)
        }
    }

    /**
     * Crée les liens
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
     * Stream l'explication finale
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
                h: 200, // Hauteur approximative, RichNode n'a pas d'autoSize mais le contenu HTML scrolera ou dépassera si besoin.
                // Note: RichNodeShape utilise HTMLContainer, donc le contenu s'adapte mais la hit box est w/h.
                // Idéalement on calculerait la taille mais pour l'instant une taille fixe large est OK.
                text: '',
                nodeType: 'explanation',
            },
        })

        await this.streamTextToShape(id, text)
    }

    private wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    cancel() {
        if (this.abortController) {
            this.abortController.abort()
        }
    }
}
