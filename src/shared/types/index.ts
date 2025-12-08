/**
 * Shared types used across both the Client and Server.
 * Centralized to avoid duplication and ensure consistency throughout the application.
 */

import type { DiagramData, DiagramNode, DiagramEdge, NodeType } from '../lib/validation/schemas'

/**
 * Re-export types from Zod schemas for easy access.
 */
export type { DiagramData, DiagramNode, DiagramEdge, NodeType }

/**
 * Interface representing the state of the Realtime connection (legacy).
 */
export interface RealtimeState {
    /** Indicates if the client is currently connected to the realtime service. */
    isConnected: boolean
    /** Indicates if audio recording is currently active. */
    isRecording: boolean
    /** Contains error message if an error occurred, otherwise null. */
    error: string | null
}

/**
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
    onError?: (error: string) => void
}

/**
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
    source: MediaStreamAudioSourceNode
}

/**
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
    expires_at: number
}
