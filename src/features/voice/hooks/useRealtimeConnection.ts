'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

/**
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
    events: unknown[]
}

/**
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
    tool_choice?: string
}

/**
 * Props for the useRealtimeConnection hook.
 */
export interface UseRealtimeConnectionProps {
    /** Configuration for the session. */
    sessionConfig?: RealtimeSessionConfig
    /** Callback function triggered when an error occurs. */
    onError?: (error: string) => void
}

/**
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
     * Sends a message to the WebSocket.
     * @param message - The message object to send.
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
     * Subscribes a handler to received messages.
     * @param handler - The function to call when a message is received.
     * @returns A cleanup function to unsubscribe the handler.
     */
    const onMessage = useCallback((handler: (message: unknown) => void) => {
        messageHandlersRef.current.add(handler)

        // Return a cleanup function
        return () => {
            messageHandlersRef.current.delete(handler)
        }
    }, [])

    /**
     * Notifies all subscribed handlers of a new message.
     * @param message - The received message.
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
     * Connects to the OpenAI Realtime API WebSocket.
     */
    const connect = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isConnecting: true, error: null }))

            // Step 1: Obtain an ephemeral token from our backend
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

            // Step 2: Connect to the WebSocket with the token in the URL
            const url = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`

            // Create connection promise
            await new Promise<void>((resolve, reject) => {
                // Create WebSocket connection with token in subprotocols
                const ws = new WebSocket(url, [
                    'realtime',
                    `openai-insecure-api-key.${ephemeralKey}`,
                    'openai-beta.realtime-v1'
                ])
                wsRef.current = ws

                // Event: Connection open
                ws.onopen = () => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Connected to OpenAI')
                    }
                    setState(prev => ({ ...prev, isConnected: true, isConnecting: false, error: null }))

                    // Configure session if provided
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

                // Event: Message received
                ws.onmessage = (e) => {
                    const msg = JSON.parse(e.data)

                    // Log for debug in development
                    if (process.env.NODE_ENV === 'development') {
                        if (msg.type === 'response.audio_transcript.delta') {
                            console.log('📝 AI Speech:', msg.delta)
                        }
                        if (msg.type === 'conversation.item.input_audio_transcription.completed') {
                            console.log('👂 User said:', msg.transcript)
                        }
                    }

                    // Notify all subscribed handlers
                    notifyMessageHandlers(msg)

                    // Add to events (keep last 50)
                    setState(prev => ({
                        ...prev,
                        events: [msg, ...prev.events].slice(0, 50)
                    }))
                }

                // Event: Error
                ws.onerror = (error) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('❌ WebSocket error:', error)
                    }
                    const errorMsg = 'WebSocket connection error'
                    setState((prev) => ({ ...prev, error: errorMsg, isConnecting: false }))
                    onError?.(errorMsg)
                    if (ws.readyState === WebSocket.CONNECTING) {
                        reject(new Error('WebSocket connection failed'))
                    }
                }

                // Event: Close
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
            const errorMsg = err instanceof Error ? err.message : 'Connection error'
            setState((prev) => ({ ...prev, error: errorMsg, isConnecting: false }))
            onError?.(errorMsg)
            throw err
        }
    }, [sessionConfig, onError, notifyMessageHandlers])

    /**
     * Disconnects from the WebSocket.
     */
    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
        setState(prev => ({ ...prev, isConnected: false, isConnecting: false, error: null }))
    }, [])

    /**
     * Cleanup on component unmount.
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
