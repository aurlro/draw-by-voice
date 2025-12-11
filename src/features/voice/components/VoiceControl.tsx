'use client'

import { Editor } from '@tldraw/tldraw'
import { useCallback } from 'react'
import { useDiagramAgent } from '@diagram/hooks/useDiagramAgent'
import type { DiagramData } from '@shared/types'
import { RealtimeStatusPanel } from './RealtimeStatusPanel'

interface VoiceControlProps {
    editor: Editor
    onDiagramGenerated?: (data: DiagramData) => void
}

export default function VoiceControl({ editor, onDiagramGenerated }: VoiceControlProps) {
    /**
     * Hook d'agent de diagramme (orchestration complète)
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
     * Toggle de la session vocale
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

    // /**
    //  * Classe CSS pour l'animation du bouton
    //  */
    // const getButtonClass = () => {
    //     if (isListening) {
    //         return 'bg-red-600 hover:bg-red-700 animate-pulse'
    //     }
    //     if (isActive) {
    //         return 'bg-blue-600 hover:bg-blue-700'
    //     }
    //     if (isConnecting) {
    //         return 'bg-yellow-600 hover:bg-yellow-700'
    //     }
    //     return 'bg-gray-600 hover:bg-gray-700'
    // }
    //
    // /**
    //  * Icône du bouton
    //  */
    // const getButtonIcon = () => {
    //     if (isListening) {
    //         return '🔴'
    //     }
    //     if (isActive || isConnecting) {
    //         return '🎤'
    //     }
    //     return '🎤'
    // }
    //
    // /**
    //  * Texte du bouton
    //  */
    // const getButtonText = () => {
    //     if (isListening) {
    //         return 'Arrêter'
    //     }
    //     if (isConnecting) {
    //         return 'Connexion...'
    //     }
    //     if (isActive) {
    //         return 'Parler'
    //     }
    //     return 'Micro'
    // }

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
