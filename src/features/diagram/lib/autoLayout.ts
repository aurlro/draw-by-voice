import dagre from 'dagre'

/**
 * Interface pour un nœud à layouter
 */
export interface LayoutNode {
    id: string
    width: number
    height: number
}

/**
 * Interface pour une connexion entre nœuds
 */
export interface LayoutEdge {
    from: string
    to: string
}

/**
 * Résultat du calcul de layout
 */
export interface LayoutResult {
    nodes: Map<string, { x: number; y: number }>
    width: number
    height: number
}

/**
 * Calcule le layout automatique d'un graphe en utilisant dagre
 * 
 * @param nodes - Liste des nœuds avec leurs dimensions
 * @param edges - Liste des connexions entre nœuds
 * @param direction - Direction du graphe ('LR' = Left-to-Right, 'TB' = Top-to-Bottom)
 * @returns Les positions calculées pour chaque nœud et les dimensions totales du graphe
 */
export function autoLayout(
    nodes: LayoutNode[],
    edges: LayoutEdge[],
    direction: 'LR' | 'TB' = 'TB'
): LayoutResult {
    // Créer un nouveau graphe dagre
    const g = new dagre.graphlib.Graph()

    // Configurer les paramètres du graphe
    g.setGraph({
        rankdir: direction,     // Top-to-Bottom (flux naturel)
        ranksep: 200,           // Espace VERTICAL (entre les étages) -> Augmenté pour laisser place aux labels
        nodesep: 150,           // Espace HORIZONTAL (entre les branches) -> Augmenté pour éviter le chevauchement
        edgesep: 80,            // Espace entre les liens
        marginx: 100,
        marginy: 100,
    })

    // Label par défaut pour les arêtes
    g.setDefaultEdgeLabel(() => ({}))

    // Ajouter tous les nœuds au graphe
    nodes.forEach((node) => {
        g.setNode(node.id, {
            width: node.width,
            height: node.height,
        })
    })

    // Ajouter toutes les arêtes au graphe
    edges.forEach((edge) => {
        g.setEdge(edge.from, edge.to)
    })

    // Calculer le layout
    dagre.layout(g)

    // Extraire les positions calculées
    const positions = new Map<string, { x: number; y: number }>()

    nodes.forEach((node) => {
        const dagreNode = g.node(node.id)
        if (dagreNode) {
            // dagre retourne le centre du nœud, on convertit pour avoir le coin supérieur gauche
            positions.set(node.id, {
                x: dagreNode.x - node.width / 2,
                y: dagreNode.y - node.height / 2,
            })
        }
    })

    // Calculer les dimensions totales du graphe
    const graphInfo = g.graph()

    return {
        nodes: positions,
        width: graphInfo.width || 0,
        height: graphInfo.height || 0,
    }
}
