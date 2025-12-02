/**
 * Type definitions pour les nodes du diagramme
 */
export type NodeType = 'user' | 'server' | 'database' | 'decision' | 'step'

/**
 * Interface pour les données du diagramme reçues de l'IA
 */
export interface DiagramNode {
    id: string
    label: string
    type: NodeType
}

export interface DiagramEdge {
    source: string
    target: string
    label?: string
}

export interface DiagramData {
    nodes: DiagramNode[]
    edges: DiagramEdge[]
    explanation: string
}

/**
 * Function definition pour OpenAI Realtime API
 * Définit la structure de la fonction generate_diagram
 */
export const GENERATE_DIAGRAM_FUNCTION = {
    name: 'generate_diagram',
    description: 'Generate an architectural diagram with nodes and edges based on user description',
    parameters: {
        type: 'object',
        properties: {
            diagram_data: {
                type: 'object',
                description: 'The diagram structure containing nodes and edges',
                properties: {
                    nodes: {
                        type: 'array',
                        description: 'List of nodes (entities, steps, actors) in the diagram',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Unique identifier for the node (e.g., "user1", "server1")'
                                },
                                label: {
                                    type: 'string',
                                    description: 'Short, punchy label for the node (e.g., "Auth Service")'
                                },
                                type: {
                                    type: 'string',
                                    enum: ['user', 'server', 'database', 'decision', 'step'],
                                    description: 'Type of node: user (actors), server (services), database (storage), decision (if/else), step (process)'
                                }
                            },
                            required: ['id', 'label', 'type']
                        }
                    },
                    edges: {
                        type: 'array',
                        description: 'List of connections (arrows) between nodes',
                        items: {
                            type: 'object',
                            properties: {
                                source: {
                                    type: 'string',
                                    description: 'ID of the source node'
                                },
                                target: {
                                    type: 'string',
                                    description: 'ID of the target node'
                                },
                                label: {
                                    type: 'string',
                                    description: 'Optional label for the edge (e.g., "HTTP Request")'
                                }
                            },
                            required: ['source', 'target']
                        }
                    }
                },
                required: ['nodes', 'edges']
            },
            explanation: {
                type: 'string',
                description: 'A markdown summary of the architecture flow and key decisions.'
            }
        },
        required: ['diagram_data', 'explanation']
    }
}
