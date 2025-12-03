'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Editor } from '@tldraw/tldraw'
import { useRealtimeConnection } from './useRealtimeConnection'
import { useAudioRecorder } from './useAudioRecorder'
import { useAudioPlayer } from './useAudioPlayer'
import { generateDiagram } from '@/lib/diagramGenerator'
import { SYSTEM_PROMPT } from '@/lib/systemPrompt'
import { GENERATE_DIAGRAM_FUNCTION } from '@/lib/functionDefinitions'
import { DiagramDataSchema } from '@/lib/schemas'
import type { DiagramData } from '@/types'

/**
 * Props pour le hook useDiagramAgent
 */
export interface UseDiagramAgentProps {
    editor: Editor
    onDiagramGenerated?: (data: DiagramData) => void
    onError?: (error: string) => void
}

/**
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
 */
export function useDiagramAgent({
    editor,
    onDiagramGenerated,
    onError,
}: UseDiagramAgentProps) {
    const [error, setError] = useState<string | null>(null)

    /**
     * Hook de lecture audio (pour entendre l'IA parler)
     */
    const audioPlayer = useAudioPlayer()

    /**
     * Configuration de la session OpenAI (memoized pour performance)
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

    /**
     * Hook de connexion WebSocket
     */
    const connection = useRealtimeConnection({
        sessionConfig,
        onError: useCallback((err: string) => {
            setError(err)
            onError?.(err)
        }, [onError]),
    })

    /**
     * Handler pour envoyer l'audio au WebSocket (memoized)
     */
    const handleAudioData = useCallback((base64Audio: string) => {
        connection.sendMessage({
            type: 'input_audio_buffer.append',
            audio: base64Audio,
        })
    }, [connection])

    /**
     * Hook d'enregistrement audio
     */
    const audioRecorder = useAudioRecorder({
        onAudioData: handleAudioData,
        onError: useCallback((err: string) => {
            setError(err)
            onError?.(err)
        }, [onError]),
    })

    /**
     * Handler pour les messages WebSocket (memoized pour éviter re-renders)
     */
    const handleMessage = useCallback((message: unknown) => {
        const msg = message as {
            type: string
            name?: string
            arguments?: string
            delta?: string
            audio?: string
        }

        // Jouer l'audio de sortie de l'IA
        if (msg.type === 'response.audio.delta' && msg.delta) {
            audioPlayer.playAudio(msg.delta)
        }

        // Parser les appels de fonction OpenAI
        if (msg.type === 'response.function_call_arguments.done') {
            if (process.env.NODE_ENV === 'development') {
                console.log('🤖 Tool Call:', msg.name)
            }

            if (msg.name === 'generate_diagram' && msg.arguments) {
                try {
                    const args = JSON.parse(msg.arguments)

                    if (process.env.NODE_ENV === 'development') {
                        console.log('📦 Arguments:', args)
                    }

                    // Validation runtime avec Zod
                    const validationResult = DiagramDataSchema.safeParse(args.diagram_data)

                    if (!validationResult.success) {
                        const zodError = validationResult.error.format()
                        console.error('❌ Invalid diagram data:', zodError)

                        // Message d'erreur convivial pour l'utilisateur
                        const userFriendlyError = "L'IA a généré des données invalides. Réessayez avec une description plus claire."
                        setError(userFriendlyError)
                        onError?.(userFriendlyError)
                        return
                    }

                    const diagramData = validationResult.data

                    // Générer le diagramme sur le canvas
                    generateDiagram(editor, diagramData, diagramData.explanation)

                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Diagram generated!')
                    }

                    // Callback optionnel
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
     * Abonner le handler aux messages WebSocket
     */
    useEffect(() => {
        const unsubscribe = connection.onMessage(handleMessage)
        return unsubscribe
    }, [connection, handleMessage])

    /**
     * Démarre une session vocale (connexion + enregistrement)
     */
    const startVoiceSession = useCallback(async () => {
        try {
            setError(null)

            // D'abord, connecter au WebSocket
            if (!connection.state.isConnected) {
                await connection.connect()
            }

            // Puis démarrer l'enregistrement audio
            await audioRecorder.startRecording()
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Erreur de démarrage de la session'
            setError(errorMsg)
            onError?.(errorMsg)
            throw err
        }
    }, [connection, audioRecorder, onError])

    /**
     * Arrête la session vocale (enregistrement uniquement, garde la connexion)
     */
    const stopVoiceSession = useCallback(() => {
        audioRecorder.stopRecording()
    }, [audioRecorder])

    /**
     * Déconnecte complètement (utilisé au cleanup)
     */
    const disconnect = useCallback(() => {
        audioRecorder.stopRecording()
        connection.disconnect()
        audioPlayer.cleanup()
    }, [audioRecorder, connection, audioPlayer])

    /**
     * Cleanup au démontage du composant
     * Note: On ne met PAS disconnect dans les deps pour éviter la boucle infinie
     * Le cleanup se fait via les références directes
     */
    useEffect(() => {
        return () => {
            // Cleanup direct sans passer par disconnect pour éviter la boucle
            audioRecorder.stopRecording()
            connection.disconnect()
            audioPlayer.cleanup()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * État agrégé (memoized pour performance)
     */
    const aggregatedState = useMemo(() => ({
        isActive: connection.state.isConnected,
        isListening: audioRecorder.isRecording,
        isConnecting: connection.state.isConnecting,
        error: error || connection.state.error || audioRecorder.error,
    }), [
        connection.state.isConnected,
        connection.state.isConnecting,
        connection.state.error,
        audioRecorder.isRecording,
        audioRecorder.error,
        error,
    ])

    return {
        ...aggregatedState,
        startVoiceSession,
        stopVoiceSession,
        disconnect,
    }
}
