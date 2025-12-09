'use client'

import { Editor } from '@tldraw/tldraw'
import { useCallback } from 'react'
import { useDiagramAgent } from '@diagram/hooks/useDiagramAgent'
import type { DiagramData } from '@shared/types'
import { RealtimeStatusPanel } from './RealtimeStatusPanel'

<<<<<<< HEAD
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
=======
interface VoiceControlProps {
    editor: Editor
    onDiagramGenerated?: (data: DiagramData) => void
}

export default function VoiceControl({ editor, onDiagramGenerated }: VoiceControlProps) {
    /**
     * Hook d'agent de diagramme (orchestration complète)
>>>>>>> origin/enhance-diagram-visuals-bindings
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
<<<<<<< HEAD
     * Toggles the voice session (start/stop recording).
=======
     * Toggle de la session vocale
>>>>>>> origin/enhance-diagram-visuals-bindings
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

<<<<<<< HEAD
    // Removed unused helper functions for button styles and text as they are now handled in RealtimeStatusPanel or not needed.
    // getButtonClass, getButtonIcon, getButtonText were identified as unused variables by linter.
=======
    /**
     * Classe CSS pour l'animation du bouton
     */
    const getButtonClass = () => {
        if (isListening) {
            return 'bg-red-600 hover:bg-red-700 animate-pulse'
        }
        if (isActive) {
            return 'bg-blue-600 hover:bg-blue-700'
        }
        if (isConnecting) {
            return 'bg-yellow-600 hover:bg-yellow-700'
        }
        return 'bg-gray-600 hover:bg-gray-700'
    }

    /**
     * Icône du bouton
     */
    const getButtonIcon = () => {
        if (isListening) {
            return '🔴'
        }
        if (isActive || isConnecting) {
            return '🎤'
        }
        return '🎤'
    }

    /**
     * Texte du bouton
     */
    const getButtonText = () => {
        if (isListening) {
            return 'Arrêter'
        }
        if (isConnecting) {
            return 'Connexion...'
        }
        if (isActive) {
            return 'Parler'
        }
        return 'Micro'
    }
>>>>>>> origin/enhance-diagram-visuals-bindings

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
