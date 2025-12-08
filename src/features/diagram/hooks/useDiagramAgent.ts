'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Editor } from '@tldraw/tldraw'
import { useRealtimeConnection } from '@voice/hooks/useRealtimeConnection'
import { useAudioRecorder } from '@voice/hooks/useAudioRecorder'
import { useAudioPlayer } from '@voice/hooks/useAudioPlayer'
import { generateDiagram } from '../lib/diagramGenerator'
import { SYSTEM_PROMPT } from '@voice/lib/systemPrompt'
import { GENERATE_DIAGRAM_FUNCTION } from '@voice/lib/functionDefinitions'
import { DiagramDataSchema } from '@shared/lib/validation/schemas'
import type { DiagramData } from '@shared/types'
// Removed unused DiagramAnimator import for now as it seems to be unused in the hook logic based on linter warning
// import { DiagramAnimator } from '../lib/DiagramAnimator'

/**
 * Props for the useDiagramAgent hook.
 */
export interface UseDiagramAgentProps {
    /** The Tldraw editor instance. */
    editor: Editor
    /** Callback function triggered when a diagram is generated. */
    onDiagramGenerated?: (data: DiagramData) => void
    /** Callback function triggered when an error occurs. */
    onError?: (error: string) => void
}

/**
 * Business logic hook to orchestrate voice-controlled diagram generation.
 * 
 * Responsibility: Orchestration of business logic.
 * - Compose useRealtimeConnection + useAudioRecorder + useAudioPlayer.
 * - Manage the lifecycle of the voice session.
 * - Parse and validate OpenAI function calls.
 * - Generate diagrams on the tldraw canvas.
 * 
 * @param props - Configuration for the hook.
 * @returns State and methods to control the agent.
 */
export function useDiagramAgent({
    editor,
    onDiagramGenerated,
    onError,
}: UseDiagramAgentProps) {
    const [error, setError] = useState<string | null>(null)
    const [lastToolCallArgs, setLastToolCallArgs] = useState<string | null>(null)

    /**
     * Audio Player Hook (to hear the AI speak).
     */
    const audioPlayer = useAudioPlayer()

    /**
     * OpenAI Session Configuration (memoized for performance).
     */
    const sessionConfig = useMemo(() => ({
        modalities: ['text', 'audio'],
        instructions: SYSTEM_PROMPT,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        turn_detection: { type: 'server_vad' },
        tools: [GENERATE_DIAGRAM_FUNCTION],
        tool_choice: 'auto',
    }), [])

    // Removed unused animator instance
    // const animator = useMemo(() => new DiagramAnimator(editor), [editor])

    /**
     * WebSocket Connection Hook.
     */
    const connection = useRealtimeConnection({
        sessionConfig,
        onError: useCallback((err: string) => {
            setError(err)
            onError?.(err)
        }, [onError]),
    })

    /**
     * Handler to send audio to WebSocket (memoized).
     * @param base64Audio - The base64 encoded audio data.
     */
    const handleAudioData = useCallback((base64Audio: string) => {
        connection.sendMessage({
            type: 'input_audio_buffer.append',
            audio: base64Audio,
        })
    }, [connection])

    /**
     * Audio Recorder Hook.
     */
    const audioRecorder = useAudioRecorder({
        onAudioData: handleAudioData,
        onError: useCallback((err: string) => {
            setError(err)
            onError?.(err)
        }, [onError]),
    })

    /**
     * Handler for WebSocket messages (memoized to avoid re-renders).
     * @param message - The message received from the WebSocket.
     */
    const handleMessage = useCallback((message: unknown) => {
        const msg = message as {
            type: string
            name?: string
            arguments?: string
            delta?: string
            audio?: string
        }

        // Play AI audio output
        if (msg.type === 'response.audio.delta' && msg.delta) {
            audioPlayer.playAudio(msg.delta)
        }

        // Parse OpenAI function calls
        if (msg.type === 'response.function_call_arguments.done') {
            if (process.env.NODE_ENV === 'development') {
                console.log('🤖 Tool Call:', msg.name)
            }

            if (msg.name === 'generate_diagram' && msg.arguments) {
                let args
                try {
                    args = JSON.parse(msg.arguments)
                } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
                    // "SILENT WAIT" STRATEGY:
                    // If JSON is incomplete, ignore error and wait for next chunk.
                    return
                }

                try {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('📦 Arguments:', args)
                    }

                    // Save for debug display
                    setLastToolCallArgs(JSON.stringify(args, null, 2))

                    // Runtime validation with Zod
                    const validationResult = DiagramDataSchema.safeParse(args.diagram_data)

                    if (!validationResult.success) {
                        const zodError = validationResult.error.format()
                        console.error('❌ Invalid diagram data:', zodError)

                        // User-friendly error message
                        const userFriendlyError = "L'IA a généré des données invalides. Réessayez avec une description plus claire."
                        setError(userFriendlyError)
                        onError?.(userFriendlyError)
                        return
                    }

                    const diagramData = validationResult.data

                    // Generate diagram with animation
                    generateDiagram(editor, diagramData, diagramData.explanation)
                    // animator.animate(diagramData, diagramData.explanation)

                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Diagram generation started!')
                    }

                    // Optional callback
                    onDiagramGenerated?.(diagramData)
                } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la génération du diagramme'
                    console.error('❌ Error generating diagram:', err)
                    setError(errorMsg)
                    onError?.(errorMsg)
                }
            }
        }
    }, [editor, onDiagramGenerated, onError, audioPlayer])

    /**
     * Subscribe handler to WebSocket messages.
     */
    useEffect(() => {
        const unsubscribe = connection.onMessage(handleMessage)
        return unsubscribe
    }, [connection, handleMessage])

    /**
     * Starts a voice session (connection + recording).
     */
    const startVoiceSession = useCallback(async () => {
        try {
            setError(null)

            // First, connect to WebSocket
            if (!connection.state.isConnected) {
                await connection.connect()
            } else {
                // If already connected (interruption case), cancel current response
                audioPlayer.stop()
                connection.sendMessage({ type: 'response.cancel' })
            }

            // Then start audio recording
            await audioRecorder.startRecording()
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erreur de démarrage de la session'
            setError(errorMsg)
            onError?.(errorMsg)
            throw err
        }
    }, [connection, audioRecorder, onError, audioPlayer])

    /**
     * Stops the voice session (recording only, keeps connection).
     */
    const stopVoiceSession = useCallback(() => {
        audioRecorder.stopRecording()
    }, [audioRecorder])

    /**
     * Disconnects completely (used for cleanup).
     */
    const disconnect = useCallback(() => {
        audioRecorder.stopRecording()
        connection.disconnect()
        audioPlayer.cleanup()
    }, [audioRecorder, connection, audioPlayer])

    /**
     * Cleanup on component unmount.
     * Note: disconnect is NOT in deps to avoid infinite loop.
     * Cleanup is done via direct references.
     */
    useEffect(() => {
        return () => {
            // Direct cleanup without calling disconnect to avoid loop
            audioRecorder.stopRecording()
            connection.disconnect()
            audioPlayer.cleanup()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Aggregated state (memoized for performance).
     */
    const aggregatedState = useMemo(() => ({
        isActive: connection.state.isConnected,
        isListening: audioRecorder.isRecording,
        isConnecting: connection.state.isConnecting,
        error: error || connection.state.error || audioRecorder.error,
        events: connection.state.events,
        lastToolCallArgs
    }), [
        connection.state.isConnected,
        connection.state.isConnecting,
        connection.state.error,
        connection.state.events,
        audioRecorder.isRecording,
        audioRecorder.error,
        error,
        lastToolCallArgs
    ])

    /**
     * Completely resets the session (Canvas + OpenAI Context).
     * Useful for saving tokens and starting fresh.
     */
    const resetSession = useCallback(async () => {
        // 1. Clear Tldraw Canvas
        editor.selectAll()
        const selectedIds = editor.getSelectedShapeIds()
        if (selectedIds.length > 0) {
            editor.deleteShapes(selectedIds)
        }

        // 2. Clear local state
        setError(null)
        setLastToolCallArgs(null)

        // 3. Connection cycle (Disconnect -> Connect) to wipe context
        if (connection.state.isConnected) {
            connection.disconnect()
            // Small delay to ensure clean closure before reconnecting
            setTimeout(() => {
                connection.connect()
            }, 500)
        }
    }, [editor, connection])

    return {
        ...aggregatedState,
        audioLevel: audioRecorder.audioLevel,
        startVoiceSession,
        stopVoiceSession,
        disconnect,
        resetSession,
    }
}
