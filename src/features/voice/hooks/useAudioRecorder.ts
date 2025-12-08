'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { AudioRecorderRef } from '@shared/types'


/**
 * Props pour le hook useAudioRecorder
 */
export interface UseAudioRecorderProps {
    onAudioData?: (base64Audio: string) => void
    onError?: (error: string) => void
}

/**
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
 */
export function useAudioRecorder({
    onAudioData,
    onError,
}: UseAudioRecorderProps = {}) {
    const [isRecording, setIsRecording] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mediaRecorderRef = useRef<AudioRecorderRef | null>(null)

    /**
     * Démarre l'enregistrement audio
     */
    const [audioLevel, setAudioLevel] = useState(0)
    const animationFrameRef = useRef<number>(0)

    /**
     * Analyse le volume audio en temps réel
     */
    const analyzeAudio = useCallback((analyser: AnalyserNode) => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount)

        const updateLevel = () => {
            analyser.getByteFrequencyData(dataArray)

            // Calculer la moyenne du volume
            // On se concentre sur les basses/moyennes fréquences pour la voix humaine
            let sum = 0
            // On prend un sous-ensemble des fréquences (les premières sont souvent les plus pertinentes pour la voix)
            const length = dataArray.length
            for (let i = 0; i < length; i++) {
                sum += dataArray[i]
            }

            const average = sum / length
            // Normaliser entre 0 et 1 (255 est le max pour getByteFrequencyData)
            const normalized = Math.min(1, average / 128)

            // Lissage pour éviter les sauts trop brusques (optionnel, mais agréable visuellement)
            setAudioLevel(prev => prev * 0.8 + normalized * 0.2)

            animationFrameRef.current = requestAnimationFrame(updateLevel)
        }

        updateLevel()
    }, [])

    /**
     * Arrête l'analyse audio
     */
    const stopAnalysis = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
        }
        setAudioLevel(0)
    }, [])

    /**
     * Démarre l'enregistrement audio
     */
    const startRecording = useCallback(async () => {
        try {
            setError(null)

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

            // Créer un analyser pour la visualisation
            const analyser = audioContext.createAnalyser()
            analyser.fftSize = 256 // Pas besoin d'une grande précision pour juste le volume
            analyser.smoothingTimeConstant = 0.5
            source.connect(analyser)

            // Démarrer l'analyse visuelle
            analyzeAudio(analyser)

            // Charger le module AudioWorklet
            try {
                await audioContext.audioWorklet.addModule('/audio-processor.js')
            } catch (e) {
                console.error('Failed to load audio worklet, falling back to ScriptProcessor or failing', e)
                throw new Error('AudioWorklet module loading failed')
            }

            // Créer le noeud Worklet
            const workletNode = new AudioWorkletNode(audioContext, 'audio-recorder-processor')

            workletNode.port.onmessage = (e) => {
                const inputData = e.data // Float32Array envoyé par le processor

                // Convertir Float32Array en Int16Array (PCM16)
                const pcm16 = new Int16Array(inputData.length)
                for (let i = 0; i < inputData.length; i++) {
                    // Convertir de [-1, 1] à [-32768, 32767]
                    const s = Math.max(-1, Math.min(1, inputData[i]))
                    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
                }

                // Convertir en base64
                // Utilisation optimisée de TextEncoder/Decoder ou btoa
                // Note: btoa sur des chunks binaires en JS est standard ici
                const base64Audio = btoa(
                    String.fromCharCode(...new Uint8Array(pcm16.buffer))
                )

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
            const errorMsg = err instanceof Error ? err.message : 'Impossible d\'accéder au microphone'
            setError(errorMsg)
            onError?.(errorMsg)
            throw err
        }
    }, [analyzeAudio, onAudioData, onError])

    /**
     * Arrête l'enregistrement audio
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

    // Cleanup effect pour s'assurer qu'on arrête l'animation frame si le composant est démonté
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
