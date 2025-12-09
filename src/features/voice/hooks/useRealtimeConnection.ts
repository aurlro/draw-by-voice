'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

/**
<<<<<<< HEAD
 * State of the Realtime Connection.
 */
export interface RealtimeConnectionState {
    /** Indicates if the WebSocket connection is established. */
    isConnected: boolean
    /** Indicates if the connection is currently being established. */
    isConnecting: boolean
    /** Contains the error message if a connection error occurred, otherwise null. */
    error: string | null
    /** List of recent events received from the WebSocket. */
=======
 * État de la connexion Realtime
 */
export interface RealtimeConnectionState {
    isConnected: boolean
    isConnecting: boolean
    error: string | null
>>>>>>> origin/enhance-diagram-visuals-bindings
    events: unknown[]
}

/**
<<<<<<< HEAD
 * Configuration for the OpenAI Realtime Session.
 */
export interface RealtimeSessionConfig {
    /** System instructions for the model. */
    instructions: string
    /** List of tools available to the model. */
    tools: unknown[]
    /** Modalities to use (e.g., audio, text). */
    modalities?: string[]
    /** Input audio format (e.g., pcm16). */
    input_audio_format?: string
    /** Output audio format (e.g., pcm16). */
    output_audio_format?: string
    /** Turn detection configuration. */
    turn_detection?: { type: string }
    /** Tool choice configuration (e.g., auto). */
=======
 * Configuration de la session OpenAI Realtime
 */
export interface RealtimeSessionConfig {
    instructions: string
    tools: unknown[]
    modalities?: string[]
    input_audio_format?: string
    output_audio_format?: string
    turn_detection?: { type: string }
>>>>>>> origin/enhance-diagram-visuals-bindings
    tool_choice?: string
}

/**
<<<<<<< HEAD
 * Props for the useRealtimeConnection hook.
 */
export interface UseRealtimeConnectionProps {
    /** Configuration for the session. */
    sessionConfig?: RealtimeSessionConfig
    /** Callback function triggered when an error occurs. */
=======
 * Props pour le hook useRealtimeConnection
 */
export interface UseRealtimeConnectionProps {
    sessionConfig?: RealtimeSessionConfig
>>>>>>> origin/enhance-diagram-visuals-bindings
    onError?: (error: string) => void
}

/**
<<<<<<< HEAD
 * Hook to manage WebSocket connection with OpenAI Realtime API.
 * 
 * Responsibility: Pure WebSocket connection management.
 * - Obtain an ephemeral token.
 * - Establish the WebSocket connection.
 * - Send/receive messages.
 * - Handle connection errors.
 * 
 * @param props - Configuration for the hook.
 * @returns State and methods to control the connection.
=======
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
>>>>>>> origin/enhance-diagram-visuals-bindings
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
<<<<<<< HEAD
     * Sends a message to the WebSocket.
     * @param message - The message object to send.
=======
     * Envoie un message au WebSocket
>>>>>>> origin/enhance-diagram-visuals-bindings
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
<<<<<<< HEAD
     * Subscribes a handler to received messages.
     * @param handler - The function to call when a message is received.
     * @returns A cleanup function to unsubscribe the handler.
=======
     * Abonne un handler aux messages reçus
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const onMessage = useCallback((handler: (message: unknown) => void) => {
        messageHandlersRef.current.add(handler)

<<<<<<< HEAD
        // Return a cleanup function
=======
        // Retourner une fonction de cleanup
>>>>>>> origin/enhance-diagram-visuals-bindings
        return () => {
            messageHandlersRef.current.delete(handler)
        }
    }, [])

    /**
<<<<<<< HEAD
     * Notifies all subscribed handlers of a new message.
     * @param message - The received message.
=======
     * Notifie tous les handlers d'un nouveau message
>>>>>>> origin/enhance-diagram-visuals-bindings
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
<<<<<<< HEAD
     * Connects to the OpenAI Realtime API WebSocket.
=======
     * Connecte au WebSocket OpenAI Realtime API
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const connect = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isConnecting: true, error: null }))

<<<<<<< HEAD
            // Step 1: Obtain an ephemeral token from our backend
=======
            // Étape 1: Obtenir un token ephemeral depuis notre backend
>>>>>>> origin/enhance-diagram-visuals-bindings
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

<<<<<<< HEAD
            // Step 2: Connect to the WebSocket with the token in the URL
            const url = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`

            // Create connection promise
            await new Promise<void>((resolve, reject) => {
                // Create WebSocket connection with token in subprotocols
=======
            // Étape 2: Connecter au WebSocket avec le token dans l'URL
            const url = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`

            // Créer la promesse de connexion
            await new Promise<void>((resolve, reject) => {
                // Créer la connexion WebSocket avec le token dans les sous-protocoles
>>>>>>> origin/enhance-diagram-visuals-bindings
                const ws = new WebSocket(url, [
                    'realtime',
                    `openai-insecure-api-key.${ephemeralKey}`,
                    'openai-beta.realtime-v1'
                ])
                wsRef.current = ws

<<<<<<< HEAD
                // Event: Connection open
=======
                // Event: Connexion ouverte
>>>>>>> origin/enhance-diagram-visuals-bindings
                ws.onopen = () => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Connected to OpenAI')
                    }
                    setState(prev => ({ ...prev, isConnected: true, isConnecting: false, error: null }))

<<<<<<< HEAD
                    // Configure session if provided
=======
                    // Configurer la session si fournie
>>>>>>> origin/enhance-diagram-visuals-bindings
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

<<<<<<< HEAD
                // Event: Message received
                ws.onmessage = (e) => {
                    const msg = JSON.parse(e.data)

                    // Log for debug in development
=======
                // Event: Message reçu
                ws.onmessage = (e) => {
                    const msg = JSON.parse(e.data)

                    // Log pour debug en développement
>>>>>>> origin/enhance-diagram-visuals-bindings
                    if (process.env.NODE_ENV === 'development') {
                        if (msg.type === 'response.audio_transcript.delta') {
                            console.log('📝 AI Speech:', msg.delta)
                        }
                        if (msg.type === 'conversation.item.input_audio_transcription.completed') {
                            console.log('👂 User said:', msg.transcript)
                        }
                    }

<<<<<<< HEAD
                    // Notify all subscribed handlers
                    notifyMessageHandlers(msg)

                    // Add to events (keep last 50)
=======
                    // Notifier tous les handlers abonnés
                    notifyMessageHandlers(msg)

                    // Ajouter aux events (garder les 50 derniers)
>>>>>>> origin/enhance-diagram-visuals-bindings
                    setState(prev => ({
                        ...prev,
                        events: [msg, ...prev.events].slice(0, 50)
                    }))
                }

<<<<<<< HEAD
                // Event: Error
=======
                // Event: Erreur
>>>>>>> origin/enhance-diagram-visuals-bindings
                ws.onerror = (error) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('❌ WebSocket error:', error)
                    }
<<<<<<< HEAD
                    const errorMsg = 'WebSocket connection error'
=======
                    const errorMsg = 'Erreur de connexion WebSocket'
>>>>>>> origin/enhance-diagram-visuals-bindings
                    setState((prev) => ({ ...prev, error: errorMsg, isConnecting: false }))
                    onError?.(errorMsg)
                    if (ws.readyState === WebSocket.CONNECTING) {
                        reject(new Error('WebSocket connection failed'))
                    }
                }

<<<<<<< HEAD
                // Event: Close
=======
                // Event: Fermeture
>>>>>>> origin/enhance-diagram-visuals-bindings
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
<<<<<<< HEAD
            const errorMsg = err instanceof Error ? err.message : 'Connection error'
=======
            const errorMsg = err instanceof Error ? err.message : 'Erreur de connexion'
>>>>>>> origin/enhance-diagram-visuals-bindings
            setState((prev) => ({ ...prev, error: errorMsg, isConnecting: false }))
            onError?.(errorMsg)
            throw err
        }
    }, [sessionConfig, onError, notifyMessageHandlers])

    /**
<<<<<<< HEAD
     * Disconnects from the WebSocket.
=======
     * Déconnecte du WebSocket
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
        setState(prev => ({ ...prev, isConnected: false, isConnecting: false, error: null }))
    }, [])

    /**
<<<<<<< HEAD
     * Cleanup on component unmount.
=======
     * Cleanup à la destruction du composant
>>>>>>> origin/enhance-diagram-visuals-bindings
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
