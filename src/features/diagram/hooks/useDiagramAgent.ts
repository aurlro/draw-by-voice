'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Editor } from '@tldraw/tldraw'
import { useRealtimeConnection } from '@voice/hooks/useRealtimeConnection'
import { useAudioRecorder } from '@voice/hooks/useAudioRecorder'
import { useAudioPlayer } from '@voice/hooks/useAudioPlayer'
import { generateDiagram } from '../lib/diagramGenerator'
<<<<<<< HEAD
=======
import { DiagramAnimator } from '../lib/DiagramAnimator'
>>>>>>> origin/enhance-diagram-visuals-bindings
import { SYSTEM_PROMPT } from '@voice/lib/systemPrompt'
import { GENERATE_DIAGRAM_FUNCTION } from '@voice/lib/functionDefinitions'
import { DiagramDataSchema } from '@shared/lib/validation/schemas'
import type { DiagramData } from '@shared/types'
<<<<<<< HEAD
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
=======

/**
 * Props pour le hook useDiagramAgent
 */
export interface UseDiagramAgentProps {
    editor: Editor
    onDiagramGenerated?: (data: DiagramData) => void
>>>>>>> origin/enhance-diagram-visuals-bindings
    onError?: (error: string) => void
}

/**
<<<<<<< HEAD
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
=======
 * Hook de couche métier pour orchestrer la génération de diagrammes par voix
 *
 * Responsabilité: Orchestration de la logique métier
 * - Composer useRealtimeConnection + useAudioRecorder + useAudioPlayer
 * - Gérer le cycle de vie de la session vocale
 * - Parser et valider les appels de fonction OpenAI
 * - Générer les diagrammes sur le canvas tldraw
 *
 * @param props - Configuration du hook
 * @returns État et méthodes de contrôle de l'agent
>>>>>>> origin/enhance-diagram-visuals-bindings
 */
export function useDiagramAgent({
    editor,
    onDiagramGenerated,
    onError,
}: UseDiagramAgentProps) {
    const [error, setError] = useState<string | null>(null)
    const [lastToolCallArgs, setLastToolCallArgs] = useState<string | null>(null)

    /**
<<<<<<< HEAD
     * Audio Player Hook (to hear the AI speak).
=======
     * Hook de lecture audio (pour entendre l'IA parler)
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const audioPlayer = useAudioPlayer()

    /**
<<<<<<< HEAD
     * OpenAI Session Configuration (memoized for performance).
=======
     * Configuration de la session OpenAI (memoized pour performance)
>>>>>>> origin/enhance-diagram-visuals-bindings
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

<<<<<<< HEAD
    // Removed unused animator instance
    // const animator = useMemo(() => new DiagramAnimator(editor), [editor])

    /**
     * WebSocket Connection Hook.
=======
    /**
     * Animator instance (memoized)
     */
    const animator = useMemo(() => new DiagramAnimator(editor), [editor])

    /**
     * Hook de connexion WebSocket
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const connection = useRealtimeConnection({
        sessionConfig,
        onError: useCallback((err: string) => {
            setError(err)
            onError?.(err)
        }, [onError]),
    })

    /**
<<<<<<< HEAD
     * Handler to send audio to WebSocket (memoized).
     * @param base64Audio - The base64 encoded audio data.
=======
     * Handler pour envoyer l'audio au WebSocket (memoized)
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const handleAudioData = useCallback((base64Audio: string) => {
        connection.sendMessage({
            type: 'input_audio_buffer.append',
            audio: base64Audio,
        })
    }, [connection])

    /**
<<<<<<< HEAD
     * Audio Recorder Hook.
=======
     * Hook d'enregistrement audio
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const audioRecorder = useAudioRecorder({
        onAudioData: handleAudioData,
        onError: useCallback((err: string) => {
            setError(err)
            onError?.(err)
        }, [onError]),
    })

    /**
<<<<<<< HEAD
     * Handler for WebSocket messages (memoized to avoid re-renders).
     * @param message - The message received from the WebSocket.
=======
     * Handler pour les messages WebSocket (memoized pour éviter re-renders)
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const handleMessage = useCallback((message: unknown) => {
        const msg = message as {
            type: string
            name?: string
            arguments?: string
            delta?: string
            audio?: string
        }

<<<<<<< HEAD
        // Play AI audio output
=======
        // Jouer l'audio de sortie de l'IA
>>>>>>> origin/enhance-diagram-visuals-bindings
        if (msg.type === 'response.audio.delta' && msg.delta) {
            audioPlayer.playAudio(msg.delta)
        }

<<<<<<< HEAD
        // Parse OpenAI function calls
=======
        // Parser les appels de fonction OpenAI
>>>>>>> origin/enhance-diagram-visuals-bindings
        if (msg.type === 'response.function_call_arguments.done') {
            if (process.env.NODE_ENV === 'development') {
                console.log('🤖 Tool Call:', msg.name)
            }

            if (msg.name === 'generate_diagram' && msg.arguments) {
                let args
                try {
                    args = JSON.parse(msg.arguments)
<<<<<<< HEAD
                } catch (e) { // eslint-disable-line @typescript-eslint/no-unused-vars
                    // "SILENT WAIT" STRATEGY:
                    // If JSON is incomplete, ignore error and wait for next chunk.
=======
                } catch (e) {
                    // STRATÉGIE "SILENT WAIT" :
                    // Si le JSON est incomplet, on ignore l'erreur et on attend le prochain chunk.
>>>>>>> origin/enhance-diagram-visuals-bindings
                    return
                }

                try {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('📦 Arguments:', args)
                    }

<<<<<<< HEAD
                    // Save for debug display
                    setLastToolCallArgs(JSON.stringify(args, null, 2))

                    // Runtime validation with Zod
=======
                    // Sauvegarder pour affichage debug
                    setLastToolCallArgs(JSON.stringify(args, null, 2))

                    // Validation runtime avec Zod
>>>>>>> origin/enhance-diagram-visuals-bindings
                    const validationResult = DiagramDataSchema.safeParse(args.diagram_data)

                    if (!validationResult.success) {
                        const zodError = validationResult.error.format()
                        console.error('❌ Invalid diagram data:', zodError)

<<<<<<< HEAD
                        // User-friendly error message
=======
                        // Message d'erreur convivial pour l'utilisateur
>>>>>>> origin/enhance-diagram-visuals-bindings
                        const userFriendlyError = "L'IA a généré des données invalides. Réessayez avec une description plus claire."
                        setError(userFriendlyError)
                        onError?.(userFriendlyError)
                        return
                    }

                    const diagramData = validationResult.data

<<<<<<< HEAD
                    // Generate diagram with animation
=======
                    // Générer le diagramme avec animation
>>>>>>> origin/enhance-diagram-visuals-bindings
                    generateDiagram(editor, diagramData, diagramData.explanation)
                    // animator.animate(diagramData, diagramData.explanation)

                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Diagram generation started!')
                    }

<<<<<<< HEAD
                    // Optional callback
=======
                    // Callback optionnel
>>>>>>> origin/enhance-diagram-visuals-bindings
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
<<<<<<< HEAD
     * Subscribe handler to WebSocket messages.
=======
     * Abonner le handler aux messages WebSocket
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    useEffect(() => {
        const unsubscribe = connection.onMessage(handleMessage)
        return unsubscribe
    }, [connection, handleMessage])

    /**
<<<<<<< HEAD
     * Starts a voice session (connection + recording).
=======
     * Démarre une session vocale (connexion + enregistrement)
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const startVoiceSession = useCallback(async () => {
        try {
            setError(null)

<<<<<<< HEAD
            // First, connect to WebSocket
            if (!connection.state.isConnected) {
                await connection.connect()
            } else {
                // If already connected (interruption case), cancel current response
=======
            // D'abord, connecter au WebSocket
            if (!connection.state.isConnected) {
                await connection.connect()
            } else {
                // Si déjà connecté (cas d'interruption), on annule la réponse en cours
>>>>>>> origin/enhance-diagram-visuals-bindings
                audioPlayer.stop()
                connection.sendMessage({ type: 'response.cancel' })
            }

<<<<<<< HEAD
            // Then start audio recording
=======
            // Puis démarrer l'enregistrement audio
>>>>>>> origin/enhance-diagram-visuals-bindings
            await audioRecorder.startRecording()
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erreur de démarrage de la session'
            setError(errorMsg)
            onError?.(errorMsg)
            throw err
        }
<<<<<<< HEAD
    }, [connection, audioRecorder, onError, audioPlayer])

    /**
     * Stops the voice session (recording only, keeps connection).
=======
    }, [connection, audioRecorder, onError])

    /**
     * Arrête la session vocale (enregistrement uniquement, garde la connexion)
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const stopVoiceSession = useCallback(() => {
        audioRecorder.stopRecording()
    }, [audioRecorder])

    /**
<<<<<<< HEAD
     * Disconnects completely (used for cleanup).
=======
     * Déconnecte complètement (utilisé au cleanup)
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const disconnect = useCallback(() => {
        audioRecorder.stopRecording()
        connection.disconnect()
        audioPlayer.cleanup()
    }, [audioRecorder, connection, audioPlayer])

    /**
<<<<<<< HEAD
     * Cleanup on component unmount.
     * Note: disconnect is NOT in deps to avoid infinite loop.
     * Cleanup is done via direct references.
     */
    useEffect(() => {
        return () => {
            // Direct cleanup without calling disconnect to avoid loop
=======
     * Cleanup au démontage du composant
     * Note: On ne met PAS disconnect dans les deps pour éviter la boucle infinie
     * Le cleanup se fait via les références directes
     */
    useEffect(() => {
        return () => {
            // Cleanup direct sans passer par disconnect pour éviter la boucle
>>>>>>> origin/enhance-diagram-visuals-bindings
            audioRecorder.stopRecording()
            connection.disconnect()
            audioPlayer.cleanup()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
<<<<<<< HEAD
     * Aggregated state (memoized for performance).
=======
     * État agrégé (memoized pour performance)
>>>>>>> origin/enhance-diagram-visuals-bindings
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
<<<<<<< HEAD
     * Completely resets the session (Canvas + OpenAI Context).
     * Useful for saving tokens and starting fresh.
     */
    const resetSession = useCallback(async () => {
        // 1. Clear Tldraw Canvas
=======
     * Réinitialise complètement la session (Canvas + Contexte OpenAI)
     * Utile pour économiser des tokens et repartir de zéro
     */
    const resetSession = useCallback(async () => {
        // 1. Nettoyer le Canvas Tldraw
>>>>>>> origin/enhance-diagram-visuals-bindings
        editor.selectAll()
        const selectedIds = editor.getSelectedShapeIds()
        if (selectedIds.length > 0) {
            editor.deleteShapes(selectedIds)
        }

        // 2. Clear local state
        setError(null)
        setLastToolCallArgs(null)

<<<<<<< HEAD
        // 3. Connection cycle (Disconnect -> Connect) to wipe context
        if (connection.state.isConnected) {
            connection.disconnect()
            // Small delay to ensure clean closure before reconnecting
=======
        // 3. Cycle de connexion (Disconnect -> Connect) pour wipe le contexte
        if (connection.state.isConnected) {
            connection.disconnect()
            // Petit délai pour assurer la fermeture propre avant de reconnecter
>>>>>>> origin/enhance-diagram-visuals-bindings
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
