'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * État de la connexion Realtime
 */
export interface RealtimeConnectionState {
    isConnected: boolean
    isConnecting: boolean
    error: string | null
    events: unknown[]
}

/**
 * Configuration de la session OpenAI Realtime
 */
export interface RealtimeSessionConfig {
    instructions: string
    tools: unknown[]
    modalities?: string[]
    input_audio_format?: string
    output_audio_format?: string
    turn_detection?: { type: string }
    tool_choice?: string
}

/**
 * Props pour le hook useRealtimeConnection
 */
export interface UseRealtimeConnectionProps {
    sessionConfig?: RealtimeSessionConfig
    onError?: (error: string) => void
}

/**
 * Hook pour gérer la connexion WebSocket avec OpenAI Realtime API
 * 
 * Responsabilité: Pure gestion de connexion WebSocket
 * - Obtenir un token ephemeral
 * - Établir la connexion WebSocket
 * - Envoyer/recevoir des messages
 * - Gérer les erreurs de connexion
 * 
 * @param props - Configuration du hook
 * @returns État et méthodes de contrôle de la connexion
 */
export function useRealtimeConnection({
    sessionConfig,
    onError,
}: UseRealtimeConnectionProps = {}) {
    const [state, setState] = useState<RealtimeConnectionState>({
        isConnected: false,
        isConnecting: false,
        error: null,
        events: []
    })

    const wsRef = useRef<WebSocket | null>(null)
    const messageHandlersRef = useRef<Set<(message: unknown) => void>>(new Set())

    /**
     * Envoie un message au WebSocket
     */
    const sendMessage = useCallback((message: object) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message))
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️ Cannot send message: WebSocket not connected')
            }
        }
    }, [])

    /**
     * Abonne un handler aux messages reçus
     */
    const onMessage = useCallback((handler: (message: unknown) => void) => {
        messageHandlersRef.current.add(handler)

        // Retourner une fonction de cleanup
        return () => {
            messageHandlersRef.current.delete(handler)
        }
    }, [])

    /**
     * Notifie tous les handlers d'un nouveau message
     */
    const notifyMessageHandlers = useCallback((message: unknown) => {
        messageHandlersRef.current.forEach(handler => {
            try {
                handler(message)
            } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('❌ Error in message handler:', err)
                }
            }
        })
    }, [])

    /**
     * Connecte au WebSocket OpenAI Realtime API
     */
    const connect = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isConnecting: true, error: null }))

            // Étape 1: Obtenir un token ephemeral depuis notre backend
            if (process.env.NODE_ENV === 'development') {
                console.log('🔑 Requesting ephemeral session from backend...')
            }
            const sessionResponse = await fetch('/api/realtime/session')

            if (!sessionResponse.ok) {
                throw new Error('Failed to create session')
            }

            const sessionData = await sessionResponse.json()
            const ephemeralKey = sessionData.client_secret.value
            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Ephemeral session created')
            }

            // Étape 2: Connecter au WebSocket avec le token dans l'URL
            const url = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`

            // Créer la promesse de connexion
            await new Promise<void>((resolve, reject) => {
                // Créer la connexion WebSocket avec le token dans les sous-protocoles
                const ws = new WebSocket(url, [
                    'realtime',
                    `openai-insecure-api-key.${ephemeralKey}`,
                    'openai-beta.realtime-v1'
                ])
                wsRef.current = ws

                // Event: Connexion ouverte
                ws.onopen = () => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Connected to OpenAI')
                    }
                    setState(prev => ({ ...prev, isConnected: true, isConnecting: false, error: null }))

                    // Configurer la session si fournie
                    if (sessionConfig) {
                        ws.send(JSON.stringify({
                            type: 'session.update',
                            session: sessionConfig
                        }))
                        if (process.env.NODE_ENV === 'development') {
                            console.log('✅ Session configured')
                        }
                    }
                    resolve()
                }

                // Event: Message reçu
                ws.onmessage = (e) => {
                    const msg = JSON.parse(e.data)

                    // Log pour debug en développement
                    if (process.env.NODE_ENV === 'development') {
                        if (msg.type === 'response.audio_transcript.delta') {
                            console.log('📝 AI Speech:', msg.delta)
                        }
                        if (msg.type === 'conversation.item.input_audio_transcription.completed') {
                            console.log('👂 User said:', msg.transcript)
                        }
                    }

                    // Notifier tous les handlers abonnés
                    notifyMessageHandlers(msg)

                    // Ajouter aux events (garder les 50 derniers)
                    setState(prev => ({
                        ...prev,
                        events: [msg, ...prev.events].slice(0, 50)
                    }))
                }

                // Event: Erreur
                ws.onerror = (error) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('❌ WebSocket error:', error)
                    }
                    const errorMsg = 'Erreur de connexion WebSocket'
                    setState((prev) => ({ ...prev, error: errorMsg, isConnecting: false }))
                    onError?.(errorMsg)
                    if (ws.readyState === WebSocket.CONNECTING) {
                        reject(new Error('WebSocket connection failed'))
                    }
                }

                // Event: Fermeture
                ws.onclose = () => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('🔌 WebSocket disconnected')
                    }
                    setState((prev) => ({ ...prev, isConnected: false, isConnecting: false }))
                }
            })
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Connection error:', err)
            }
            const errorMsg = err instanceof Error ? err.message : 'Erreur de connexion'
            setState((prev) => ({ ...prev, error: errorMsg, isConnecting: false }))
            onError?.(errorMsg)
            throw err
        }
    }, [sessionConfig, onError, notifyMessageHandlers])

    /**
     * Déconnecte du WebSocket
     */
    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
        setState(prev => ({ ...prev, isConnected: false, isConnecting: false, error: null }))
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
        sendMessage,
        onMessage,
    }
}
