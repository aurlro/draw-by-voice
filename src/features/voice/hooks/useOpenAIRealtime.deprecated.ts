'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { SYSTEM_PROMPT } from '../lib/systemPrompt'
import { GENERATE_DIAGRAM_FUNCTION } from '../lib/functionDefinitions'
import type { RealtimeState, UseOpenAIRealtimeProps, AudioRecorderRef } from '@shared/types'

/**
 * Custom hook to manage OpenAI Realtime API via WebSocket.
 * 
 * DEPRECATED: This hook handles too many responsibilities (connection + audio).
 * It has been split into `useRealtimeConnection` and `useAudioRecorder`.
 * Kept for reference or fallback.
 * 
 * IMPORTANT: This hook requires an ephemeral session token obtained via /api/realtime/session
 *
 * @deprecated Use useRealtimeConnection and useAudioRecorder instead.
 * @param props - Hook configuration.
 * @returns State and control methods.
 */
export function useOpenAIRealtime({ onFunctionCall, onError }: UseOpenAIRealtimeProps = {}) {
    const [state, setState] = useState<RealtimeState>({
        isConnected: false,
        isRecording: false,
        error: null,
    })

    const wsRef = useRef<WebSocket | null>(null)
    const mediaRecorderRef = useRef<AudioRecorderRef | null>(null)


    /**
     * Connects to the OpenAI Realtime API WebSocket.
     */
    const connect = useCallback(async () => {
        try {
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
                    setState(prev => ({ ...prev, isConnected: true, error: null }))

                    // Configure session
                    ws.send(JSON.stringify({
                        type: 'session.update',
                        session: {
                            modalities: ['text', 'audio'],
                            instructions: SYSTEM_PROMPT,
                            input_audio_format: 'pcm16',
                            output_audio_format: 'pcm16',
                            turn_detection: { type: 'server_vad' },
                            tools: [GENERATE_DIAGRAM_FUNCTION],
                            tool_choice: 'auto', // Keep auto, but improve system prompt if needed
                        }
                    }))
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Session configured')
                    }
                    resolve()
                }

                // Event: Message received
                ws.onmessage = (e) => {
                    const msg = JSON.parse(e.data)

                    // Debug: See what AI understands (Transcription)
                    if (msg.type === 'response.audio_transcript.delta') {
                        if (process.env.NODE_ENV === 'development') {
                            console.log('📝 AI Speech:', msg.delta)
                        }
                    }

                    // Debug: See what AI heard (Input)
                    if (msg.type === 'conversation.item.input_audio_transcription.completed') {
                        if (process.env.NODE_ENV === 'development') {
                            console.log('👂 User said:', msg.transcript)
                        }
                    }

                    if (msg.type === 'response.function_call_arguments.done') {
                        if (process.env.NODE_ENV === 'development') {
                            console.log('🤖 Tool Call:', msg.name)
                        }
                        const args = JSON.parse(msg.arguments)
                        onFunctionCall?.(msg.name, args)
                    }
                }

                // Event: Error
                ws.onerror = (error) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('❌ WebSocket error:', error)
                    }
                    setState((prev) => ({ ...prev, error: 'Erreur de connexion WebSocket' }))
                    onError?.('Erreur de connexion WebSocket')
                    if (ws.readyState === WebSocket.CONNECTING) {
                        reject(new Error('WebSocket connection failed'))
                    }
                }

                // Event: Close
                ws.onclose = () => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('🔌 WebSocket disconnected')
                    }
                    setState((prev) => ({ ...prev, isConnected: false, isRecording: false }))
                }
            })
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Connection error:', err)
            }
            const errorMsg = err instanceof Error ? err.message : 'Erreur de connexion'
            setState((prev) => ({ ...prev, error: errorMsg }))
            onError?.(errorMsg)
            throw err
        }
    }, [onFunctionCall, onError])

    /**
     * Disconnects from the WebSocket.
     */
    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close()
            wsRef.current = null
        }
        if (mediaRecorderRef.current) {
            const recorder = mediaRecorderRef.current
            if (recorder.processor) {
                recorder.processor.disconnect()
            }
            if (recorder.source) {
                recorder.source.disconnect()
            }
            if (recorder.audioContext) {
                recorder.audioContext.close()
            }
            if (recorder.stream) {
                recorder.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
            }
            mediaRecorderRef.current = null
        }
        setState({ isConnected: false, isRecording: false, error: null })
    }, [])

    /**
     * Starts audio recording.
     */
    const startRecording = useCallback(async () => {
        try {
            // Check if WebSocket is ready
            if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
                throw new Error('Not connected to WebSocket')
            }

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 24000, // OpenAI requires 24kHz
                    channelCount: 1,   // Mono
                    echoCancellation: true,
                    noiseSuppression: true,
                }
            })

            // Create AudioContext at 24kHz
            const audioContext = new AudioContext({ sampleRate: 24000 })
            const source = audioContext.createMediaStreamSource(stream)

            // Create ScriptProcessorNode to capture PCM samples
            // Note: ScriptProcessorNode is deprecated but AudioWorklet requires a separate file
            const bufferSize = 4096
            const processor = audioContext.createScriptProcessor(bufferSize, 1, 1)

            processor.onaudioprocess = (e) => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    const inputData = e.inputBuffer.getChannelData(0)

                    // Convert Float32Array to Int16Array (PCM16)
                    const pcm16 = new Int16Array(inputData.length)
                    for (let i = 0; i < inputData.length; i++) {
                        // Convert from [-1, 1] to [-32768, 32767]
                        const s = Math.max(-1, Math.min(1, inputData[i]))
                        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
                    }

                    // Convert to base64
                    const base64Audio = btoa(
                        String.fromCharCode(...new Uint8Array(pcm16.buffer))
                    )

                    // Send to WebSocket
                    const audioMessage = {
                        type: 'input_audio_buffer.append',
                        audio: base64Audio,
                    }
                    wsRef.current.send(JSON.stringify(audioMessage))
                }
            }

            // Connect nodes
            source.connect(processor)
            processor.connect(audioContext.destination)

            // Store references for cleanup
            mediaRecorderRef.current = {
                stream,
                audioContext,
                processor,
                source,
            }

            setState((prev) => ({ ...prev, isRecording: true }))
            if (process.env.NODE_ENV === 'development') {
                console.log('🎤 Recording started (PCM16 @ 24kHz)')
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Recording error:', err)
            }
            const errorMsg = err instanceof Error ? err.message : 'Unable to access microphone'
            setState((prev) => ({ ...prev, error: errorMsg }))
            onError?.(errorMsg)
        }
    }, [onError])

    /**
     * Stops audio recording.
     */
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current) {
            const recorder = mediaRecorderRef.current

            // Cleanup AudioContext resources
            if (recorder.processor) {
                recorder.processor.disconnect()
            }
            if (recorder.source) {
                recorder.source.disconnect()
            }
            if (recorder.audioContext) {
                recorder.audioContext.close()
            }
            if (recorder.stream) {
                recorder.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
            }

            mediaRecorderRef.current = null
            setState((prev) => ({ ...prev, isRecording: false }))
            if (process.env.NODE_ENV === 'development') {
                console.log('⏹️ Recording stopped')
            }

            // Note: We do NOT commit the buffer here because with server_vad,
            // OpenAI automatically detects the end of audio and creates a response.
            // Committing manually caused "buffer too small" and "response already in progress" errors.
        }
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
        startRecording,
        stopRecording,
    }
}
