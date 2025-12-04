import type { NodeType } from '@shared/types'

/**
 * Function definition pour OpenAI Realtime API
 * Définit la structure de la fonction generate_diagram
 * 
 * NOTE: Cette définition doit être synchronisée avec DiagramDataSchema dans lib/schemas.ts
 */
export const GENERATE_DIAGRAM_FUNCTION = {
    type: 'function',
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
                                    enum: [
                                        // Tldraw geo shapes (preferred)
                                        'rectangle', 'ellipse', 'diamond', 'cloud',
                                        // Special types for icons and actors
                                        'icon', 'actor',
                                        // Legacy abstract types (backward compatibility)
                                        'user', 'server', 'database', 'decision', 'step'
                                    ] as const satisfies readonly NodeType[],
                                    description: 'Type of node. Prefer Tldraw geo shapes: rectangle (boxes), ellipse (rounded), diamond (decisions), cloud (abstract). Special: icon (external logos via CDN), actor (user/person). Legacy: user, server, database, decision, step'
                                },
                                iconName: {
                                    type: 'string',
                                    description: 'Optional. Technical slug for external icon (e.g., "react", "amazonwebservices", "docker", "python"). Used with type="icon" to load from SimpleIcons CDN.'
                                },
                                x: {
                                    type: 'number',
                                    description: 'Optional. Manual X coordinate for precise positioning'
                                },
                                y: {
                                    type: 'number',
                                    description: 'Optional. Manual Y coordinate for precise positioning'
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
                    },
                    explanation: {
                        type: 'string',
                        description: 'Optional markdown summary of the architecture flow and key decisions.'
                    }
                },
                required: ['nodes', 'edges']
            }
        },
        required: ['diagram_data']
    }
} as const
