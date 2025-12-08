'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { AudioRecorderRef } from '@shared/types'


/**
 * Props for the useAudioRecorder hook.
 */
export interface UseAudioRecorderProps {
    /** Callback function triggered when audio data is available (Base64 encoded). */
    onAudioData?: (base64Audio: string) => void
    /** Callback function triggered when an error occurs. */
    onError?: (error: string) => void
}

/**
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
 */
export function useAudioRecorder({
    onAudioData,
    onError,
}: UseAudioRecorderProps = {}) {
    const [isRecording, setIsRecording] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const mediaRecorderRef = useRef<AudioRecorderRef | null>(null)

    /**
     * Starts audio recording.
     */
    const [audioLevel, setAudioLevel] = useState(0)
    const animationFrameRef = useRef<number>(0)

    /**
     * Analyzes audio volume in real-time.
     * @param analyser - The AnalyserNode to read data from.
     */
    const analyzeAudio = useCallback((analyser: AnalyserNode) => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount)

        const updateLevel = () => {
            analyser.getByteFrequencyData(dataArray)

            // Calculate average volume
            // Focus on low/mid frequencies for human voice
            let sum = 0
            // Take a subset of frequencies (first ones are often most relevant for voice)
            const length = dataArray.length
            for (let i = 0; i < length; i++) {
                sum += dataArray[i]
            }

            const average = sum / length
            // Normalize between 0 and 1 (255 is max for getByteFrequencyData)
            const normalized = Math.min(1, average / 128)

            // Smoothing to avoid abrupt jumps (optional, but visually pleasing)
            setAudioLevel(prev => prev * 0.8 + normalized * 0.2)

            animationFrameRef.current = requestAnimationFrame(updateLevel)
        }

        updateLevel()
    }, [])

    /**
     * Stops audio analysis.
     */
    const stopAnalysis = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
        }
        setAudioLevel(0)
    }, [])

    /**
     * Starts audio recording.
     */
    const startRecording = useCallback(async () => {
        try {
            setError(null)

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

            // Create analyzer for visualization
            const analyser = audioContext.createAnalyser()
            analyser.fftSize = 256 // High precision not needed for just volume
            analyser.smoothingTimeConstant = 0.5
            source.connect(analyser)

            // Start visual analysis
            analyzeAudio(analyser)

            // Load AudioWorklet module
            try {
                await audioContext.audioWorklet.addModule('/audio-processor.js')
            } catch (e) {
                console.error('Failed to load audio worklet, falling back to ScriptProcessor or failing', e)
                throw new Error('AudioWorklet module loading failed')
            }

            // Create Worklet node
            const workletNode = new AudioWorkletNode(audioContext, 'audio-recorder-processor')

            workletNode.port.onmessage = (e) => {
                const inputData = e.data // Float32Array sent by processor

                // Convert Float32Array to Int16Array (PCM16)
                const pcm16 = new Int16Array(inputData.length)
                for (let i = 0; i < inputData.length; i++) {
                    // Convert from [-1, 1] to [-32768, 32767]
                    const s = Math.max(-1, Math.min(1, inputData[i]))
                    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
                }

                // Convert to base64
                // Optimized use of TextEncoder/Decoder or btoa
                // Note: btoa on binary chunks in JS is standard here
                const base64Audio = btoa(
                    String.fromCharCode(...new Uint8Array(pcm16.buffer))
                )

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
            const errorMsg = err instanceof Error ? err.message : 'Unable to access microphone'
            setError(errorMsg)
            onError?.(errorMsg)
            throw err
        }
    }, [analyzeAudio, onAudioData, onError])

    /**
     * Stops audio recording.
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

    // Cleanup effect to ensure animation frame is stopped if component unmounts
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
