/**
<<<<<<< HEAD
 * Shared types used across both the Client and Server.
 * Centralized to avoid duplication and ensure consistency throughout the application.
=======
 * Types partagés entre Client et Server
 * Centralisés pour éviter la duplication et garantir la cohérence
>>>>>>> origin/enhance-diagram-visuals-bindings
 */

import type { DiagramData, DiagramNode, DiagramEdge, NodeType } from '../lib/validation/schemas'

/**
<<<<<<< HEAD
 * Re-export types from Zod schemas for easy access.
=======
 * Re-export des types depuis les schémas Zod
>>>>>>> origin/enhance-diagram-visuals-bindings
 */
export type { DiagramData, DiagramNode, DiagramEdge, NodeType }

/**
<<<<<<< HEAD
 * Interface representing the state of the Realtime connection (legacy).
 */
export interface RealtimeState {
    /** Indicates if the client is currently connected to the realtime service. */
    isConnected: boolean
    /** Indicates if audio recording is currently active. */
    isRecording: boolean
    /** Contains error message if an error occurred, otherwise null. */
=======
 * Interface pour l'état de connexion Realtime (legacy)
 */
export interface RealtimeState {
    isConnected: boolean
    isRecording: boolean
>>>>>>> origin/enhance-diagram-visuals-bindings
    error: string | null
}

/**
<<<<<<< HEAD
 * Props for the useOpenAIRealtime hook (legacy).
 */
export interface UseOpenAIRealtimeProps {
    /**
     * Callback function triggered when a function call is received from the AI.
     * @param functionName - The name of the function to call.
     * @param args - The arguments passed to the function.
     */
    onFunctionCall?: (functionName: string, args: Record<string, unknown>) => void
    /**
     * Callback function triggered when an error occurs.
     * @param error - The error message.
     */
=======
 * Props pour le hook useOpenAIRealtime (legacy)
 */
export interface UseOpenAIRealtimeProps {
    onFunctionCall?: (functionName: string, args: Record<string, unknown>) => void
>>>>>>> origin/enhance-diagram-visuals-bindings
    onError?: (error: string) => void
}

/**
<<<<<<< HEAD
 * Interface for the audio recorder reference.
 * Holds references to Web Audio API objects.
 */
export interface AudioRecorderRef {
    /** The MediaStream object representing the audio stream. */
    stream: MediaStream
    /** The AudioContext used for processing audio. */
    audioContext: AudioContext
    /** The AudioWorkletNode that processes audio data. */
    processor: AudioWorkletNode | ScriptProcessorNode
    /** The MediaStreamAudioSourceNode that acts as the audio source. */
=======
 * Interface pour le contexte audio
 */
export interface AudioRecorderRef {
    stream: MediaStream
    audioContext: AudioContext
    processor: AudioWorkletNode
>>>>>>> origin/enhance-diagram-visuals-bindings
    source: MediaStreamAudioSourceNode
}

/**
<<<<<<< HEAD
 * Type for the response from the ephemeral session API.
 */
export interface EphemeralSessionResponse {
    /** Object containing the client secret details. */
    client_secret: {
        /** The client secret value. */
        value: string
        /** The expiration timestamp of the client secret. */
        expires_at: number
    }
    /** The expiration timestamp of the session. */
=======
 * Type pour la réponse de la session ephemeral
 */
export interface EphemeralSessionResponse {
    client_secret: {
        value: string
        expires_at: number
    }
>>>>>>> origin/enhance-diagram-visuals-bindings
    expires_at: number
}
