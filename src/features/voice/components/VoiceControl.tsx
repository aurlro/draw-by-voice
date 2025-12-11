'use client'

import { Editor } from '@tldraw/tldraw'
import { useCallback } from 'react'
import { useDiagramAgent } from '@diagram/hooks/useDiagramAgent'
import type { DiagramData } from '@shared/types'
import { RealtimeStatusPanel } from './RealtimeStatusPanel'

/**
 * Props for the VoiceControl component.
 */
interface VoiceControlProps {
    /** The Tldraw editor instance. */
    editor: Editor
    /** Callback function triggered when a diagram is generated. */
    onDiagramGenerated?: (data: DiagramData) => void
}

/**
 * VoiceControl Component.
 * Provides a user interface for controlling the voice interaction session.
 * It uses `useDiagramAgent` to manage the state and logic of the voice session.
 *
 * @param props - The props for the component.
 * @returns The rendered VoiceControl component.
 */
export default function VoiceControl({ editor, onDiagramGenerated }: VoiceControlProps) {
    /**
     * Diagram Agent Hook (complete orchestration).
     */
    const {
        isActive,
        isListening,
        isConnecting,
        error,
        audioLevel,
        events,
        lastToolCallArgs,
        startVoiceSession,
        stopVoiceSession,
        disconnect,
        resetSession
    } = useDiagramAgent({
        editor,
        onDiagramGenerated,
        onError: useCallback((err: string) => {
            console.error('❌ Voice control error:', err)
        }, []),
    })

    /**
     * Toggles the voice session (start/stop recording).
     */
    const toggleVoiceSession = useCallback(async () => {
        try {
            if (isListening) {
                stopVoiceSession()
            } else {
                await startVoiceSession()
            }
        } catch (error) {
            console.error('Failed to toggle voice session:', error)
        }
    }, [isListening, startVoiceSession, stopVoiceSession])

    // Removed unused helper functions for button styles and text as they are now handled in RealtimeStatusPanel.

    return (
        <RealtimeStatusPanel
            isActive={isActive}
            isListening={isListening}
            isConnecting={isConnecting}
            error={error}
            audioLevel={audioLevel}
            events={events}
            lastToolCallArgs={lastToolCallArgs}
            onToggleSession={toggleVoiceSession}
            onDisconnect={disconnect}
            onReset={resetSession}
        />
    )
}
