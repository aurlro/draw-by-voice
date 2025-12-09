'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { AudioRecorderRef } from '@shared/types'


/**
<<<<<<< HEAD
 * Props for the useAudioRecorder hook.
 */
export interface UseAudioRecorderProps {
    /** Callback function triggered when audio data is available (Base64 encoded). */
    onAudioData?: (base64Audio: string) => void
    /** Callback function triggered when an error occurs. */
=======
 * Props pour le hook useAudioRecorder
 */
export interface UseAudioRecorderProps {
    onAudioData?: (base64Audio: string) => void
>>>>>>> origin/enhance-diagram-visuals-bindings
    onError?: (error: string) => void
}

/**
<<<<<<< HEAD
 * Hook to manage audio recording and PCM16 conversion.
 * 
 * Responsibility: Microphone management and audio encoding.
 * - Request microphone access.
 * - Capture audio in real-time.
 * - Convert Float32 -> PCM16 -> Base64.
 * - Handle audio resource cleanup.
 * 
 * @param props - Configuration for the hook.
 * @returns State and methods to control recording.
=======
 * Hook pour gérer l'enregistrement audio et la conversion PCM16
 *
 * Responsabilité: Gestion du microphone et encodage audio
 * - Demander l'accès au microphone
 * - Capturer l'audio en temps réel
 * - Convertir Float32 -> PCM16 -> Base64
 * - Gérer le cleanup des ressources audio
 *
 * @param props - Configuration du hook
 * @returns État et méthodes de contrôle de l'enregistrement
>>>>>>> origin/enhance-diagram-visuals-bindings
 */
export function useAudioRecorder({
    onAudioData,
    onError,
}: UseAudioRecorderProps = {}) {
    const [isRecording, setIsRecording] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mediaRecorderRef = useRef<AudioRecorderRef | null>(null)

    /**
<<<<<<< HEAD
     * Starts audio recording.
=======
     * Démarre l'enregistrement audio
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const [audioLevel, setAudioLevel] = useState(0)
    const animationFrameRef = useRef<number>(0)

    /**
<<<<<<< HEAD
     * Analyzes audio volume in real-time.
     * @param analyser - The AnalyserNode to read data from.
=======
     * Analyse le volume audio en temps réel
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const analyzeAudio = useCallback((analyser: AnalyserNode) => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount)

        const updateLevel = () => {
            analyser.getByteFrequencyData(dataArray)

<<<<<<< HEAD
            // Calculate average volume
            // Focus on low/mid frequencies for human voice
            let sum = 0
            // Take a subset of frequencies (first ones are often most relevant for voice)
=======
            // Calculer la moyenne du volume
            // On se concentre sur les basses/moyennes fréquences pour la voix humaine
            let sum = 0
            // On prend un sous-ensemble des fréquences (les premières sont souvent les plus pertinentes pour la voix)
>>>>>>> origin/enhance-diagram-visuals-bindings
            const length = dataArray.length
            for (let i = 0; i < length; i++) {
                sum += dataArray[i]
            }

            const average = sum / length
<<<<<<< HEAD
            // Normalize between 0 and 1 (255 is max for getByteFrequencyData)
            const normalized = Math.min(1, average / 128)

            // Smoothing to avoid abrupt jumps (optional, but visually pleasing)
=======
            // Normaliser entre 0 et 1 (255 est le max pour getByteFrequencyData)
            const normalized = Math.min(1, average / 128)

            // Lissage pour éviter les sauts trop brusques (optionnel, mais agréable visuellement)
>>>>>>> origin/enhance-diagram-visuals-bindings
            setAudioLevel(prev => prev * 0.8 + normalized * 0.2)

            animationFrameRef.current = requestAnimationFrame(updateLevel)
        }

        updateLevel()
    }, [])

    /**
<<<<<<< HEAD
     * Stops audio analysis.
=======
     * Arrête l'analyse audio
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const stopAnalysis = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
        }
        setAudioLevel(0)
    }, [])

    /**
<<<<<<< HEAD
     * Starts audio recording.
=======
     * Démarre l'enregistrement audio
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const startRecording = useCallback(async () => {
        try {
            setError(null)

<<<<<<< HEAD
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 24000, // OpenAI requires 24kHz
=======
            // Demander l'accès au microphone
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 24000, // OpenAI demande 24kHz
>>>>>>> origin/enhance-diagram-visuals-bindings
                    channelCount: 1,   // Mono
                    echoCancellation: true,
                    noiseSuppression: true,
                }
            })

<<<<<<< HEAD
            // Create AudioContext at 24kHz
            const audioContext = new AudioContext({ sampleRate: 24000 })
            const source = audioContext.createMediaStreamSource(stream)

            // Create analyzer for visualization
            const analyser = audioContext.createAnalyser()
            analyser.fftSize = 256 // High precision not needed for just volume
            analyser.smoothingTimeConstant = 0.5
            source.connect(analyser)

            // Start visual analysis
            analyzeAudio(analyser)

            // Load AudioWorklet module
=======
            // Créer un AudioContext à 24kHz
            const audioContext = new AudioContext({ sampleRate: 24000 })
            const source = audioContext.createMediaStreamSource(stream)

            // Créer un analyser pour la visualisation
            const analyser = audioContext.createAnalyser()
            analyser.fftSize = 256 // Pas besoin d'une grande précision pour juste le volume
            analyser.smoothingTimeConstant = 0.5
            source.connect(analyser)

            // Démarrer l'analyse visuelle
            analyzeAudio(analyser)

            // Charger le module AudioWorklet
>>>>>>> origin/enhance-diagram-visuals-bindings
            try {
                await audioContext.audioWorklet.addModule('/audio-processor.js')
            } catch (e) {
                console.error('Failed to load audio worklet, falling back to ScriptProcessor or failing', e)
                throw new Error('AudioWorklet module loading failed')
            }

<<<<<<< HEAD
            // Create Worklet node
            const workletNode = new AudioWorkletNode(audioContext, 'audio-recorder-processor')

            workletNode.port.onmessage = (e) => {
                const inputData = e.data // Float32Array sent by processor

                // Convert Float32Array to Int16Array (PCM16)
                const pcm16 = new Int16Array(inputData.length)
                for (let i = 0; i < inputData.length; i++) {
                    // Convert from [-1, 1] to [-32768, 32767]
=======
            // Créer le noeud Worklet
            const workletNode = new AudioWorkletNode(audioContext, 'audio-recorder-processor')

            workletNode.port.onmessage = (e) => {
                const inputData = e.data // Float32Array envoyé par le processor

                // Convertir Float32Array en Int16Array (PCM16)
                const pcm16 = new Int16Array(inputData.length)
                for (let i = 0; i < inputData.length; i++) {
                    // Convertir de [-1, 1] à [-32768, 32767]
>>>>>>> origin/enhance-diagram-visuals-bindings
                    const s = Math.max(-1, Math.min(1, inputData[i]))
                    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
                }

<<<<<<< HEAD
                // Convert to base64
                // Optimized use of TextEncoder/Decoder or btoa
                // Note: btoa on binary chunks in JS is standard here
=======
                // Convertir en base64
                // Utilisation optimisée de TextEncoder/Decoder ou btoa
                // Note: btoa sur des chunks binaires en JS est standard ici
>>>>>>> origin/enhance-diagram-visuals-bindings
                const base64Audio = btoa(
                    String.fromCharCode(...new Uint8Array(pcm16.buffer))
                )

<<<<<<< HEAD
                // Send audio data
                onAudioData?.(base64Audio)
            }

            // Connect the graph
            source.connect(workletNode)
            workletNode.connect(audioContext.destination)

            // Store references for cleanup
            mediaRecorderRef.current = {
                stream,
                audioContext,
                processor: workletNode, // Kept "processor" name but it's a WorkletNode
=======
                // Envoyer les données audio
                onAudioData?.(base64Audio)
            }

            // Connecter le graphe
            source.connect(workletNode)
            workletNode.connect(audioContext.destination)

            // Stocker les références pour cleanup
            mediaRecorderRef.current = {
                stream,
                audioContext,
                processor: workletNode, // On garde le nom "processor" mais c'est un WorkletNode
>>>>>>> origin/enhance-diagram-visuals-bindings
                source,
            }

            setIsRecording(true)
            if (process.env.NODE_ENV === 'development') {
                console.log('🎤 Recording started (PCM16 @ 24kHz)')
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Recording error:', err)
            }
<<<<<<< HEAD
            const errorMsg = err instanceof Error ? err.message : 'Unable to access microphone'
=======
            const errorMsg = err instanceof Error ? err.message : 'Impossible d\'accéder au microphone'
>>>>>>> origin/enhance-diagram-visuals-bindings
            setError(errorMsg)
            onError?.(errorMsg)
            throw err
        }
    }, [analyzeAudio, onAudioData, onError])

    /**
<<<<<<< HEAD
     * Stops audio recording.
=======
     * Arrête l'enregistrement audio
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const stopRecording = useCallback(() => {
        stopAnalysis()

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
            setIsRecording(false)
            if (process.env.NODE_ENV === 'development') {
                console.log('⏹️ Recording stopped')
            }
        }
    }, [stopAnalysis])

<<<<<<< HEAD
    // Cleanup effect to ensure animation frame is stopped if component unmounts
=======
    // Cleanup effect pour s'assurer qu'on arrête l'animation frame si le composant est démonté
>>>>>>> origin/enhance-diagram-visuals-bindings
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    return {
        isRecording,
        error,
        startRecording,
        stopRecording,
        audioLevel
    }
}
