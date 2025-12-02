import { NodeType } from './functionDefinitions'

export interface NodeTypeConfig {
    color: string
    geo: 'rectangle' | 'diamond' | 'ellipse' | 'cloud'
    iconUrl?: string // Nouveau champ optionnel
    labelColor?: string
}

export const NODE_TYPE_CONFIG: Record<NodeType, NodeTypeConfig> = {
    user: {
        color: 'green',
        geo: 'ellipse',
        iconUrl: 'https://cdn.simpleicons.org/users', // Exemple
        labelColor: 'black'
    },
    server: {
        color: 'grey', // Plus neutre pour les serveurs
        geo: 'rectangle',
        labelColor: 'black'
        // Pas d'icône par défaut, on laissera l'IA spécifier le logo plus tard
    },
    database: {
        color: 'red',
        geo: 'rectangle', // Tldraw n'a pas de forme "cylindre" native simple, rectangle est safe
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
