'use client'

import { useRef, useCallback } from 'react'

/**
 * Hook to play PCM16 audio output from OpenAI.
 * 
 * Responsibility: Audio playback
 * - Decode base64 -> PCM16 -> Float32
 * - Play via AudioContext
 * - Manage audio queue
 */
export function useAudioPlayer() {
    const audioContextRef = useRef<AudioContext | null>(null)
    const audioQueueRef = useRef<Float32Array[]>([])
    const isPlayingRef = useRef(false)

    /**
     * Initializes the AudioContext (requires user interaction).
     * @returns The initialized AudioContext.
     */
    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext({ sampleRate: 24000 })
        }
        return audioContextRef.current
    }, [])

    /**
     * Converts base64 PCM16 string to Float32Array.
     * @param base64Audio - The base64 encoded audio string.
     * @returns The decoded Float32Array audio data.
     */
    const decodeAudio = useCallback((base64Audio: string): Float32Array => {
        // Decode base64 -> binary string
        const binaryString = atob(base64Audio)

        // Convert to Uint8Array
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }

        // Convert to Int16Array (PCM16)
        const pcm16 = new Int16Array(bytes.buffer)

        // Convert to Float32Array (AudioContext format)
        const float32 = new Float32Array(pcm16.length)
        for (let i = 0; i < pcm16.length; i++) {
            // Normalize from [-32768, 32767] to [-1, 1]
            float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF)
        }

        return float32
    }, [])

    /**
     * Plays the audio samples in the queue.
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

            // Create AudioBuffer
            const audioBuffer = audioContext.createBuffer(1, samples.length, 24000)

            // Copy samples to buffer
            const channelData = audioBuffer.getChannelData(0)
            for (let i = 0; i < samples.length; i++) {
                channelData[i] = samples[i]
            }

            // Create source and play
            const source = audioContext.createBufferSource()
            source.buffer = audioBuffer
            source.connect(audioContext.destination)

            // Wait for playback to finish
            await new Promise<void>((resolve) => {
                source.onended = () => resolve()
                source.start()
            })
        }

        isPlayingRef.current = false
    }, [initAudioContext])

    /**
     * Adds audio to the queue and starts playback.
     * @param base64Audio - The base64 encoded audio string to play.
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
     * Stops playback and clears the audio queue.
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
     * Cleans up audio resources.
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
