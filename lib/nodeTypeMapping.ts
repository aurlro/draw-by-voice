import { NodeType } from './functionDefinitions'

/**
 * Configuration visuelle pour chaque type de node
 */
export interface NodeTypeConfig {
    color: string
    geo: 'rectangle' | 'diamond' | 'ellipse'
    emoji: string
}

/**
 * Mapping des types de nodes vers leurs propriétés visuelles
 * Utilisé pour convertir les types AI en propriétés tldraw
 */
export const NODE_TYPE_CONFIG: Record<NodeType, NodeTypeConfig> = {
    user: {
        color: 'green',
        geo: 'rectangle',
        emoji: '👤'
    },
    server: {
        color: 'blue',
        geo: 'rectangle',
        emoji: '🖥️'
    },
    database: {
        color: 'red',
        geo: 'rectangle',
        emoji: '💾'
    },
    decision: {
        color: 'yellow',
        geo: 'diamond',
        emoji: '❓'
    },
    step: {
        color: 'grey',
        geo: 'rectangle',
        emoji: '📝'
    }
}

/**
 * Obtient la configuration visuelle pour un type de node donné
 */
export function getNodeConfig(type: NodeType): NodeTypeConfig {
    return NODE_TYPE_CONFIG[type] || NODE_TYPE_CONFIG.step
}
