import dagre from 'dagre'

/**
 * Interface for a node to be layouted.
 */
export interface LayoutNode {
    id: string
    width: number
    height: number
}

/**
 * Interface for a connection between nodes.
 */
export interface LayoutEdge {
    from: string
    to: string
}

/**
 * Result of the layout calculation.
 */
export interface LayoutResult {
    nodes: Map<string, { x: number; y: number }>
    width: number
    height: number
}

/**
 * Calculates the automatic layout of a graph using dagre.
 * 
 * @param nodes - List of nodes with their dimensions.
 * @param edges - List of connections between nodes.
 * @param direction - Direction of the graph ('LR' = Left-to-Right, 'TB' = Top-to-Bottom).
 * @returns The calculated positions for each node and total graph dimensions.
 */
export function autoLayout(
    nodes: LayoutNode[],
    edges: LayoutEdge[],
    direction: 'LR' | 'TB' = 'TB'
): LayoutResult {
    // Create a new dagre graph
    const g = new dagre.graphlib.Graph()

    // Configure graph parameters
    g.setGraph({
        rankdir: direction,     // Top-to-Bottom (natural flow)
        ranksep: 150,           // VERTICAL spacing (between ranks) -> Increased for labels
        nodesep: 100,           // HORIZONTAL spacing (between branches) -> Increased to avoid overlap
        edgesep: 50,            // Spacing between edges
        marginx: 50,
        marginy: 50,
    })

    // Default edge label
    g.setDefaultEdgeLabel(() => ({}))

    // Add all nodes to the graph
    nodes.forEach((node) => {
        g.setNode(node.id, {
            width: node.width,
            height: node.height,
        })
    })

    // Add all edges to the graph
    edges.forEach((edge) => {
        g.setEdge(edge.from, edge.to)
    })

    // Calculate layout
    dagre.layout(g)

    // Extract calculated positions
    const positions = new Map<string, { x: number; y: number }>()

    nodes.forEach((node) => {
        const dagreNode = g.node(node.id)
        if (dagreNode) {
            // dagre returns node center, convert to top-left corner
            positions.set(node.id, {
                x: dagreNode.x - node.width / 2,
                y: dagreNode.y - node.height / 2,
            })
        }
    })

    // Calculate total graph dimensions
    const graphInfo = g.graph()

    return {
        nodes: positions,
        width: graphInfo.width || 0,
        height: graphInfo.height || 0,
    }
}
