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
 * Interface pour le recorder audio (AudioContext)
 */
interface AudioRecorderRef {
    stream: MediaStream
    audioContext: AudioContext
    processor: ScriptProcessorNode
    source: MediaStreamAudioSourceNode
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
    const mediaRecorderRef = useRef<AudioRecorderRef | null>(null)


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
                    console.log('✅ Connected to OpenAI')
                    setState(prev => ({ ...prev, isConnected: true, error: null }))

                    // Configurer la session
                    ws.send(JSON.stringify({
                        type: 'session.update',
                        session: {
                            modalities: ['text', 'audio'],
                            instructions: SYSTEM_PROMPT,
                            input_audio_format: 'pcm16',
                            output_audio_format: 'pcm16',
                            turn_detection: { type: 'server_vad' },
                            tools: [GENERATE_DIAGRAM_FUNCTION],
                            tool_choice: 'auto', // On garde auto, mais on améliore le prompt système si besoin
                        }
                    }))
                    console.log('✅ Session configured')
                    resolve()
                }

                // Event: Message reçu
                ws.onmessage = (e) => {
                    const msg = JSON.parse(e.data)

                    // Debug: Voir ce que l'IA comprend (Transcription)
                    if (msg.type === 'response.audio_transcript.delta') {
                        console.log('📝 AI Speech:', msg.delta)
                    }

                    // Debug: Voir ce que l'IA a entendu (Input)
                    if (msg.type === 'conversation.item.input_audio_transcription.completed') {
                        console.log('👂 User said:', msg.transcript)
                    }

                    if (msg.type === 'response.function_call_arguments.done') {
                        console.log('🤖 Tool Call:', msg.name)
                        const args = JSON.parse(msg.arguments)
                        onFunctionCall?.(msg.name, args)
                    }
                }

                // Event: Erreur
                ws.onerror = (error) => {
                    console.error('❌ WebSocket error:', error)
                    setState((prev) => ({ ...prev, error: 'Erreur de connexion WebSocket' }))
                    onError?.('Erreur de connexion WebSocket')
                    if (ws.readyState === WebSocket.CONNECTING) {
                        reject(new Error('WebSocket connection failed'))
                    }
                }

                // Event: Fermeture
                ws.onclose = () => {
                    console.log('🔌 WebSocket disconnected')
                    setState((prev) => ({ ...prev, isConnected: false, isRecording: false }))
                }
            })
        } catch (err) {
            console.error('Connection error:', err)
            const errorMsg = err instanceof Error ? err.message : 'Erreur de connexion'
            setState((prev) => ({ ...prev, error: errorMsg }))
            onError?.(errorMsg)
            throw err
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
     * Démarre l'enregistrement audio
     */
    const startRecording = useCallback(async () => {
        try {
            // Vérifier que le WebSocket est prêt
            if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
                throw new Error('Non connecté au WebSocket')
            }

            // Demander l'accès au microphone
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 24000, // OpenAI demande 24kHz
                    channelCount: 1,   // Mono
                    echoCancellation: true,
                    noiseSuppression: true,
                }
            })

            // Créer un AudioContext à 24kHz
            const audioContext = new AudioContext({ sampleRate: 24000 })
            const source = audioContext.createMediaStreamSource(stream)

            // Créer un ScriptProcessorNode pour capturer les échantillons PCM
            // Note: ScriptProcessorNode est déprécié mais AudioWorklet nécessite un fichier séparé
            const bufferSize = 4096
            const processor = audioContext.createScriptProcessor(bufferSize, 1, 1)

            processor.onaudioprocess = (e) => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    const inputData = e.inputBuffer.getChannelData(0)

                    // Convertir Float32Array en Int16Array (PCM16)
                    const pcm16 = new Int16Array(inputData.length)
                    for (let i = 0; i < inputData.length; i++) {
                        // Convertir de [-1, 1] à [-32768, 32767]
                        const s = Math.max(-1, Math.min(1, inputData[i]))
                        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
                    }

                    // Convertir en base64
                    const base64Audio = btoa(
                        String.fromCharCode(...new Uint8Array(pcm16.buffer))
                    )

                    // Envoyer au WebSocket
                    const audioMessage = {
                        type: 'input_audio_buffer.append',
                        audio: base64Audio,
                    }
                    wsRef.current.send(JSON.stringify(audioMessage))
                }
            }

            // Connecter les nœuds
            source.connect(processor)
            processor.connect(audioContext.destination)

            // Stocker les références pour cleanup
            mediaRecorderRef.current = {
                stream,
                audioContext,
                processor,
                source,
            }

            setState((prev) => ({ ...prev, isRecording: true }))
            console.log('🎤 Recording started (PCM16 @ 24kHz)')
        } catch (err) {
            console.error('Recording error:', err)
            const errorMsg = err instanceof Error ? err.message : 'Impossible d\'accéder au microphone'
            setState((prev) => ({ ...prev, error: errorMsg }))
            onError?.(errorMsg)
        }
    }, [onError])

    /**
     * Arrête l'enregistrement audio
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
            console.log('⏹️ Recording stopped')

            // Note: On ne commit PAS le buffer ici car avec server_vad,
            // OpenAI détecte automatiquement la fin de l'audio et crée une réponse.
            // Committing manuellement causait des erreurs "buffer too small" et "response already in progress"
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
