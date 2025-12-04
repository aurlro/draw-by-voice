import type { NodeType } from '@shared/types'

export interface NodeTypeConfig {
    color: string
    geo: 'rectangle' | 'diamond' | 'ellipse' | 'cloud'
    iconUrl?: string // Nouveau champ optionnel
    labelColor?: string
}

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
    // Types spéciaux pour icônes et acteurs
    icon: {
        color: 'grey',
        geo: 'rectangle',
        labelColor: 'black'
        // iconUrl sera déterminé dynamiquement via iconName
    },
    actor: {
        color: 'green',
        geo: 'ellipse',
        iconUrl: 'https://cdn.simpleicons.org/person',
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

export function getNodeConfig(type: NodeType): NodeTypeConfig {
    return NODE_TYPE_CONFIG[type] || NODE_TYPE_CONFIG.step
}
