'use client'

import { useRef, useCallback } from 'react'

/**
<<<<<<< HEAD
 * Hook to play PCM16 audio output from OpenAI.
 * 
 * Responsibility: Audio playback
 * - Decode base64 -> PCM16 -> Float32
 * - Play via AudioContext
 * - Manage audio queue
=======
 * Hook pour jouer l'audio de sortie PCM16 d'OpenAI
 *
 * Responsabilité: Lecture audio
 * - Décoder base64 -> PCM16 -> Float32
 * - Jouer via AudioContext
 * - Gérer la file d'attente audio
>>>>>>> origin/enhance-diagram-visuals-bindings
 */
export function useAudioPlayer() {
    const audioContextRef = useRef<AudioContext | null>(null)
    const audioQueueRef = useRef<Float32Array[]>([])
    const isPlayingRef = useRef(false)

    /**
<<<<<<< HEAD
     * Initializes the AudioContext (requires user interaction).
     * @returns The initialized AudioContext.
=======
     * Initialise l'AudioContext (nécessite une interaction utilisateur)
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext({ sampleRate: 24000 })
        }
        return audioContextRef.current
    }, [])

    /**
<<<<<<< HEAD
     * Converts base64 PCM16 string to Float32Array.
     * @param base64Audio - The base64 encoded audio string.
     * @returns The decoded Float32Array audio data.
     */
    const decodeAudio = useCallback((base64Audio: string): Float32Array => {
        // Decode base64 -> binary string
        const binaryString = atob(base64Audio)

        // Convert to Uint8Array
=======
     * Convertit base64 PCM16 en Float32Array
     */
    const decodeAudio = useCallback((base64Audio: string): Float32Array => {
        // Décoder base64 -> binary string
        const binaryString = atob(base64Audio)

        // Convertir en Uint8Array
>>>>>>> origin/enhance-diagram-visuals-bindings
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }

<<<<<<< HEAD
        // Convert to Int16Array (PCM16)
        const pcm16 = new Int16Array(bytes.buffer)

        // Convert to Float32Array (AudioContext format)
        const float32 = new Float32Array(pcm16.length)
        for (let i = 0; i < pcm16.length; i++) {
            // Normalize from [-32768, 32767] to [-1, 1]
=======
        // Convertir en Int16Array (PCM16)
        const pcm16 = new Int16Array(bytes.buffer)

        // Convertir en Float32Array (format AudioContext)
        const float32 = new Float32Array(pcm16.length)
        for (let i = 0; i < pcm16.length; i++) {
            // Normaliser de [-32768, 32767] à [-1, 1]
>>>>>>> origin/enhance-diagram-visuals-bindings
            float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF)
        }

        return float32
    }, [])

    /**
<<<<<<< HEAD
     * Plays the audio samples in the queue.
=======
     * Joue les échantillons audio en file d'attente
>>>>>>> origin/enhance-diagram-visuals-bindings
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

<<<<<<< HEAD
            // Create AudioBuffer
            const audioBuffer = audioContext.createBuffer(1, samples.length, 24000)

            // Copy samples to buffer
=======
            // Créer un AudioBuffer
            const audioBuffer = audioContext.createBuffer(1, samples.length, 24000)

            // Copier les samples dans le buffer
>>>>>>> origin/enhance-diagram-visuals-bindings
            const channelData = audioBuffer.getChannelData(0)
            for (let i = 0; i < samples.length; i++) {
                channelData[i] = samples[i]
            }

<<<<<<< HEAD
            // Create source and play
=======
            // Créer une source et la jouer
>>>>>>> origin/enhance-diagram-visuals-bindings
            const source = audioContext.createBufferSource()
            source.buffer = audioBuffer
            source.connect(audioContext.destination)

<<<<<<< HEAD
            // Wait for playback to finish
=======
            // Attendre la fin de la lecture
>>>>>>> origin/enhance-diagram-visuals-bindings
            await new Promise<void>((resolve) => {
                source.onended = () => resolve()
                source.start()
            })
        }

        isPlayingRef.current = false
    }, [initAudioContext])

    /**
<<<<<<< HEAD
     * Adds audio to the queue and starts playback.
     * @param base64Audio - The base64 encoded audio string to play.
=======
     * Ajoute de l'audio à la file d'attente et le joue
>>>>>>> origin/enhance-diagram-visuals-bindings
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
<<<<<<< HEAD
     * Stops playback and clears the audio queue.
=======
     * Arrête la lecture et vide la file d'attente
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const stop = useCallback(() => {
        isPlayingRef.current = false
        audioQueueRef.current = []
        if (audioContextRef.current && audioContextRef.current.state === 'running') {
            audioContextRef.current.suspend()
            audioContextRef.current.close()
            audioContextRef.current = null
        }
    }, [])

    /**
<<<<<<< HEAD
     * Cleans up audio resources.
=======
     * Nettoie les ressources audio
>>>>>>> origin/enhance-diagram-visuals-bindings
     */
    const cleanup = useCallback(() => {
        stop()
    }, [stop])

    return {
        playAudio,
        stop,
        cleanup,
    }
}
