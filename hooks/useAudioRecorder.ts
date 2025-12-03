'use client'

import { useState, useRef, useCallback } from 'react'
import type { AudioRecorderRef } from '@/types'

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

            // Créer un ScriptProcessorNode pour capturer les échantillons PCM
            // Note: ScriptProcessorNode est déprécié mais AudioWorklet nécessite un fichier séparé
            const bufferSize = 4096
            const processor = audioContext.createScriptProcessor(bufferSize, 1, 1)

            processor.onaudioprocess = (e) => {
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

                // Envoyer les données audio via le callback
                onAudioData?.(base64Audio)
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
    }, [onAudioData, onError])

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
            setIsRecording(false)
            if (process.env.NODE_ENV === 'development') {
                console.log('⏹️ Recording stopped')
            }
        }
    }, [])

    return {
        isRecording,
        error,
        startRecording,
        stopRecording,
    }
}
