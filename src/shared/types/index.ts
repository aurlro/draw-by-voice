/**
 * Types partagés entre Client et Server
 * Centralisés pour éviter la duplication et garantir la cohérence
 */

import type { DiagramData, DiagramNode, DiagramEdge, NodeType } from '../lib/validation/schemas'

/**
 * Re-export des types depuis les schémas Zod
 */
export type { DiagramData, DiagramNode, DiagramEdge, NodeType }

/**
 * Interface pour l'état de connexion Realtime (legacy)
 */
export interface RealtimeState {
    isConnected: boolean
    isRecording: boolean
    error: string | null
}

/**
 * Props pour le hook useOpenAIRealtime (legacy)
 */
export interface UseOpenAIRealtimeProps {
    onFunctionCall?: (functionName: string, args: Record<string, unknown>) => void
    onError?: (error: string) => void
}

/**
 * Interface pour le contexte audio
 */
export interface AudioRecorderRef {
    stream: MediaStream
    audioContext: AudioContext
    processor: ScriptProcessorNode
    source: MediaStreamAudioSourceNode
}

/**
 * Type pour la réponse de la session ephemeral
 */
export interface EphemeralSessionResponse {
    client_secret: {
        value: string
        expires_at: number
    }
    expires_at: number
}
