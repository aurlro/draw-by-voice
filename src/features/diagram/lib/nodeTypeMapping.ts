import type { NodeType } from '@shared/types'

/**
 * Configuration interface for a node type.
 */
export interface NodeTypeConfig {
    /** The color theme for the node. */
    color: string
    /** The geometric shape of the node. */
    geo: 'rectangle' | 'diamond' | 'ellipse' | 'cloud'
    /** Optional URL for the icon. */
    iconUrl?: string
    /** Text color for the label. */
    labelColor?: string
}

/**
 * Configuration mapping for all supported node types.
 */
export const NODE_TYPE_CONFIG: Record<NodeType, NodeTypeConfig> = {
    // Direct Tldraw geo shape types
    rectangle: {
        color: 'grey',
        geo: 'rectangle',
        labelColor: 'black'
    },
    ellipse: {
        color: 'green',
        geo: 'ellipse',
        labelColor: 'black'
    },
    diamond: {
        color: 'yellow',
        geo: 'diamond',
        labelColor: 'black'
    },
    cloud: {
        color: 'light-blue',
        geo: 'cloud',
        labelColor: 'black'
    },
    // Special types for icons and actors
    icon: {
        color: 'grey',
        geo: 'rectangle',
        labelColor: 'black'
        // iconUrl will be determined dynamically via iconName
    },
    actor: {
        color: 'green',
        geo: 'ellipse',
        iconUrl: 'https://cdn.simpleicons.org/person',
        labelColor: 'black'
    },
    // Entity types (Architecture)
    person: {
        color: 'green',
        geo: 'ellipse',
        iconUrl: 'https://cdn.simpleicons.org/person',
        labelColor: 'black'
    },
    mobile: {
        color: 'grey',
        geo: 'rectangle',
        labelColor: 'black'
    },
    payment: {
        color: 'orange',
        geo: 'rectangle',
        labelColor: 'black'
    },
    // Legacy abstract types (mapped to geo shapes)
    user: {
        color: 'green',
        geo: 'ellipse',
        iconUrl: 'https://cdn.simpleicons.org/users',
        labelColor: 'black'
    },
    server: {
        color: 'grey',
        geo: 'rectangle',
        labelColor: 'black'
    },
    database: {
        color: 'red',
        geo: 'rectangle',
        iconUrl: 'https://cdn.simpleicons.org/postgresql/black',
        labelColor: 'black'
    },
    decision: {
        color: 'yellow',
        geo: 'diamond',
        labelColor: 'black'
    },
    step: {
        color: 'blue',
        geo: 'rectangle',
        labelColor: 'white'
    }
}

/**
 * Retrieves the configuration for a given node type.
 * @param type - The node type.
 * @returns The configuration object for the node type.
 */
export function getNodeConfig(type: NodeType): NodeTypeConfig {
    return NODE_TYPE_CONFIG[type] || NODE_TYPE_CONFIG.step
}
