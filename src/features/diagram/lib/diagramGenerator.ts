import { createShapeId, Editor } from '@tldraw/tldraw'
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
            // Création de l'image
            const iconUrl = `https://cdn.simpleicons.org/${node.iconName.toLowerCase()}/000000`;
            editor.createShape({
                id: shapeId,
                type: 'image',
                x: x,
                y: y,
                props: {
                    w: 60,  // Taille fixe pour l'icône
                    h: 60,
                    url: iconUrl,
                    assetId: null as any, // Indique une URL externe
                },
            });

            // Ajout du label en dessous (texte séparé)
            editor.createShape({
                id: createShapeId(),
                type: 'text',
                x: x,
                y: y + 70,
                props: {
                    text: node.label,
                    font: 'draw',
                    size: 's',
                    align: 'middle',
                    autoSize: true,
                    scale: 1
                }
            });
        }

        // CAS B : C'est un Acteur (Utilisateur)
        else if (node.type === 'actor') {
            editor.createShape({
                id: shapeId,
                type: 'geo',
                x: x,
                y: y,
                props: {
                    geo: 'star', // Une étoile pour représenter l'acteur
                    w: 80,       // PROPRIÉTÉ OBLIGATOIRE (pas 'width')
                    h: 80,       // PROPRIÉTÉ OBLIGATOIRE (pas 'height')
                    text: node.label,
                    font: 'draw',
                    size: 'm',
                    align: 'middle',
                    verticalAlign: 'middle',
                    growY: 0,
                    url: '',
                },
            });
        }

        // CAS C : C'est une forme standard (Rectangle, etc.)
        else {
            // Mappe les types OpenAI vers les types Tldraw
            let geoType = 'rectangle';
            if (node.type === 'ellipse') geoType = 'ellipse';
            if (node.type === 'diamond') geoType = 'diamond';
            if (node.type === 'cloud') geoType = 'cloud';

            editor.createShape({
                id: shapeId,
                type: 'geo',
                x: x,
                y: y,
                props: {
                    geo: geoType,
                    w: 150,      // Largeur par défaut OBLIGATOIRE
                    h: 100,      // Hauteur par défaut OBLIGATOIRE
                    text: node.label || '', // Sécurité chaîne vide
                    font: 'draw',
                    size: 'm',
                    align: 'middle',
                    verticalAlign: 'middle',
                    growY: 0,
                    url: '',
                    // INTERDIT : ne jamais mettre 'width', 'height' ou 'scale' ici
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
            type: 'text',
            x: textX,
            y: 0,
            props: {
                text: explanation,
                autoSize: true,
                align: 'start', // Valeurs valides: 'start', 'middle', 'end', 'justify'
                font: 'draw',   // Valeurs valides: 'draw', 'sans', 'serif', 'mono'
                size: 'm',      // Valeurs valides: 's', 'm', 'l', 'xl'
            },
        });
    }

    editor.zoomToFit()
}
