'use client'

import { Editor } from '@tldraw/tldraw'
import { useCallback } from 'react'
import { useDiagramAgent } from '@diagram/hooks/useDiagramAgent'
import type { DiagramData } from '@shared/types'

interface VoiceControlProps {
    editor: Editor
    onDiagramGenerated?: (data: DiagramData) => void
}

export default function VoiceControl({ editor, onDiagramGenerated }: VoiceControlProps) {
    /**
     * Hook d'agent de diagramme (orchestration complète)
     */
    const { isActive, isListening, isConnecting, error, startVoiceSession, stopVoiceSession, disconnect } = useDiagramAgent({
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

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
            {/* Message d'erreur */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-sm shadow-lg">
                    <p className="text-sm font-semibold">Erreur</p>
                    <p className="text-xs">{error}</p>
                </div>
            )}

            {/* Indicateur d'état */}
            {isActive && !isListening && !isConnecting && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded-lg text-xs shadow-md">
                    Connecté - Prêt à écouter
                </div>
            )}

            {/* Bouton micro principal */}
            <button
                onClick={toggleVoiceSession}
                disabled={isConnecting}
                className={`${getButtonClass()} text-white font-semibold px-6 py-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isListening ? 'Arrêter l\'enregistrement' : 'Démarrer le contrôle vocal'}
            >
                <span className="text-2xl">{getButtonIcon()}</span>
                <span>{getButtonText()}</span>
            </button>

            {/* Bouton déconnexion (si connecté) */}
            {isActive && !isListening && (
                <button
                    onClick={disconnect}
                    className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded-full shadow-md transition-all duration-200"
                >
                    Déconnecter
                </button>
            )}
        </div>
    )
}
