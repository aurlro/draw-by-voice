'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { SYSTEM_PROMPT } from '@/lib/systemPrompt'
import { GENERATE_DIAGRAM_FUNCTION } from '@/lib/functionDefinitions'

/**
 * Interface pour l'état de connexion
 */
export interface RealtimeState {
    isConnected: boolean
    isRecording: boolean
    error: string | null
}

/**
 * Props pour le hook
 */
export interface UseOpenAIRealtimeProps {
    onFunctionCall?: (functionName: string, args: Record<string, unknown>) => void
    onError?: (error: string) => void
}

/**
 * Hook personnalisé pour gérer l'OpenAI Realtime API via WebSocket
 * 
 * IMPORTANT: Ce hook nécessite une clé API OpenAI valide dans NEXT_PUBLIC_OPENAI_API_KEY
 * 
 * @param props - Configuration du hook
 * @returns État et méthodes de contrôle
 */
export function useOpenAIRealtime({ onFunctionCall, onError }: UseOpenAIRealtimeProps = {}) {
    const [state, setState] = useState<RealtimeState>({
        isConnected: false,
        isRecording: false,
        error: null,
    })

    const wsRef = useRef<WebSocket | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)


    /**
     * Connecte au WebSocket OpenAI Realtime API
     */
    const connect = useCallback(async () => {
        try {
            // Étape 1: Obtenir un token ephemeral depuis notre backend
            console.log('🔑 Requesting ephemeral session from backend...')
            const sessionResponse = await fetch('/api/realtime/session')

            if (!sessionResponse.ok) {
                throw new Error('Failed to create session')
            }

            const sessionData = await sessionResponse.json()
            const ephemeralKey = sessionData.client_secret.value
            console.log('✅ Ephemeral session created')

            // Étape 2: Connecter au WebSocket avec le token dans l'URL
            const url = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`

            // Créer la connexion WebSocket
            const ws = new WebSocket(url)
            wsRef.current = ws

            // Stocker le token pour l'envoyer dans le premier message
            const ephemeralToken = ephemeralKey

            // Event: Connexion ouverte
            ws.onopen = () => {
                console.log('✅ WebSocket connected')

                // Envoyer le token d'authentification immédiatement
                ws.send(JSON.stringify({
                    type: 'session.update',
                    session: {
                        client_secret: ephemeralToken
                    }
                }))

                setState((prev) => ({ ...prev, isConnected: true, error: null }))

                // Configurer la session avec le system prompt et les fonctions
                const sessionConfig = {
                    type: 'session.update',
                    session: {
                        modalities: ['text', 'audio'],
                        instructions: SYSTEM_PROMPT,
                        voice: 'alloy',
                        input_audio_format: 'pcm16',
                        output_audio_format: 'pcm16',
                        turn_detection: {
                            type: 'server_vad',
                            threshold: 0.5,
                            prefix_padding_ms: 300,
                            silence_duration_ms: 500,
                        },
                        tools: [GENERATE_DIAGRAM_FUNCTION],
                        tool_choice: 'auto',
                    },
                }

                ws.send(JSON.stringify(sessionConfig))
                console.log('✅ Session configured')
            }

            // Event: Message reçu
            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data)
                    console.log('📨 WebSocket message:', message.type)

                    // Gérer les différents types de messages
                    switch (message.type) {
                        case 'session.created':
                        case 'session.updated':
                            console.log('✅ Session ready')
                            break

                        case 'response.function_call_arguments.done':
                            // L'IA a appelé une fonction
                            console.log('🎯 Function called:', message.name)
                            const args = JSON.parse(message.arguments)
                            onFunctionCall?.(message.name, args)
                            break

                        case 'response.audio.delta':
                            // Audio de réponse (peut être joué si nécessaire)
                            break

                        case 'error':
                            console.error('❌ WebSocket error:', message.error)
                            setState((prev) => ({ ...prev, error: message.error.message }))
                            onError?.(message.error.message)
                            break

                        default:
                            // Autres events (conversation.item.created, etc.)
                            break
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err)
                }
            }

            // Event: Erreur
            ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error)
                setState((prev) => ({ ...prev, error: 'Erreur de connexion WebSocket' }))
                onError?.('Erreur de connexion WebSocket')
            }

            // Event: Fermeture
            ws.onclose = () => {
                console.log('🔌 WebSocket disconnected')
                setState((prev) => ({ ...prev, isConnected: false, isRecording: false }))
            }
        } catch (err) {
            console.error('Connection error:', err)
            const errorMsg = err instanceof Error ? err.message : 'Erreur de connexion'
            setState((prev) => ({ ...prev, error: errorMsg }))
            onError?.(errorMsg)
        }
    }, [onFunctionCall, onError])

    /**
     * Déconnecte du WebSocket
     */
    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
        }
        setState({ isConnected: false, isRecording: false, error: null })
    }, [])

    /**
     * Démarre l'enregistrement audio
     */
    const startRecording = useCallback(async () => {
        try {
            if (!state.isConnected) {
                throw new Error('Non connecté au WebSocket')
            }

            // Demander l'accès au microphone
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            // Créer le MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
            })
            mediaRecorderRef.current = mediaRecorder

            // Envoyer l'audio au WebSocket
            mediaRecorder.ondataavailable = async (event) => {
                if (event.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
                    // Convertir en base64 et envoyer
                    const reader = new FileReader()
                    reader.onload = () => {
                        const base64Audio = (reader.result as string).split(',')[1]
                        const audioMessage = {
                            type: 'input_audio_buffer.append',
                            audio: base64Audio,
                        }
                        wsRef.current?.send(JSON.stringify(audioMessage))
                    }
                    reader.readAsDataURL(event.data)
                }
            }

            mediaRecorder.start(100) // Envoyer des chunks toutes les 100ms
            setState((prev) => ({ ...prev, isRecording: true }))
            console.log('🎤 Recording started')
        } catch (err) {
            console.error('Recording error:', err)
            const errorMsg = 'Impossible d\'accéder au microphone'
            setState((prev) => ({ ...prev, error: errorMsg }))
            onError?.(errorMsg)
        }
    }, [state.isConnected, onError])

    /**
     * Arrête l'enregistrement audio
     */
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
            mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
            setState((prev) => ({ ...prev, isRecording: false }))
            console.log('⏹️ Recording stopped')

            // Commit l'audio buffer
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                const commitMessage = {
                    type: 'input_audio_buffer.commit',
                }
                wsRef.current.send(JSON.stringify(commitMessage))

                // Créer une réponse
                const createResponse = {
                    type: 'response.create',
                }
                wsRef.current.send(JSON.stringify(createResponse))
            }
        }
    }, [])

    /**
     * Cleanup à la destruction du composant
     */
    useEffect(() => {
        return () => {
            disconnect()
        }
    }, [disconnect])

    return {
        state,
        connect,
        disconnect,
        startRecording,
        stopRecording,
    }
}
