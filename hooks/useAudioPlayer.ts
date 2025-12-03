'use client'

import { useRef, useCallback } from 'react'

/**
 * Hook pour jouer l'audio de sortie PCM16 d'OpenAI
 * 
 * Responsabilité: Lecture audio
 * - Décoder base64 -> PCM16 -> Float32
 * - Jouer via AudioContext
 * - Gérer la file d'attente audio
 */
export function useAudioPlayer() {
    const audioContextRef = useRef<AudioContext | null>(null)
    const audioQueueRef = useRef<Float32Array[]>([])
    const isPlayingRef = useRef(false)

    /**
     * Initialise l'AudioContext (nécessite une interaction utilisateur)
     */
    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext({ sampleRate: 24000 })
        }
        return audioContextRef.current
    }, [])

    /**
     * Convertit base64 PCM16 en Float32Array
     */
    const decodeAudio = useCallback((base64Audio: string): Float32Array => {
        // Décoder base64 -> binary string
        const binaryString = atob(base64Audio)

        // Convertir en Uint8Array
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }

        // Convertir en Int16Array (PCM16)
        const pcm16 = new Int16Array(bytes.buffer)

        // Convertir en Float32Array (format AudioContext)
        const float32 = new Float32Array(pcm16.length)
        for (let i = 0; i < pcm16.length; i++) {
            // Normaliser de [-32768, 32767] à [-1, 1]
            float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF)
        }

        return float32
    }, [])

    /**
     * Joue les échantillons audio en file d'attente
     */
    const playAudioQueue = useCallback(async () => {
        if (isPlayingRef.current || audioQueueRef.current.length === 0) {
            return
        }

        isPlayingRef.current = true
        const audioContext = initAudioContext()

        while (audioQueueRef.current.length > 0) {
            const samples = audioQueueRef.current.shift()
            if (!samples) continue

            // Créer un AudioBuffer
            const audioBuffer = audioContext.createBuffer(1, samples.length, 24000)

            // Copier les samples dans le buffer
            const channelData = audioBuffer.getChannelData(0)
            for (let i = 0; i < samples.length; i++) {
                channelData[i] = samples[i]
            }

            // Créer une source et la jouer
            const source = audioContext.createBufferSource()
            source.buffer = audioBuffer
            source.connect(audioContext.destination)

            // Attendre la fin de la lecture
            await new Promise<void>((resolve) => {
                source.onended = () => resolve()
                source.start()
            })
        }

        isPlayingRef.current = false
    }, [initAudioContext])

    /**
     * Ajoute de l'audio à la file d'attente et le joue
     */
    const playAudio = useCallback((base64Audio: string) => {
        try {
            const samples = decodeAudio(base64Audio)
            audioQueueRef.current.push(samples)
            playAudioQueue()
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('❌ Error playing audio:', err)
            }
        }
    }, [decodeAudio, playAudioQueue])

    /**
     * Nettoie les ressources audio
     */
    const cleanup = useCallback(() => {
        audioQueueRef.current = []
        if (audioContextRef.current) {
            audioContextRef.current.close()
            audioContextRef.current = null
        }
        isPlayingRef.current = false
    }, [])

    return {
        playAudio,
        cleanup,
    }
}
