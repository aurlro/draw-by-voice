'use client'

import { Editor } from '@tldraw/tldraw'

import { useCallback, useEffect } from 'react'
import { useOpenAIRealtime } from '@/hooks/useOpenAIRealtime'
import { generateDiagram } from '@/lib/diagramGenerator'
import { DiagramData } from '@/lib/functionDefinitions'

interface VoiceControlProps {
    editor: Editor
    onDiagramGenerated?: (data: DiagramData) => void
}

export default function VoiceControl({ editor, onDiagramGenerated }: VoiceControlProps) {
    /**
     * Handler pour les appels de fonction de l'IA
     */
    const handleFunctionCall = useCallback(
        (functionName: string, args: Record<string, unknown>) => {
            console.log('🎯 Function called:', functionName, args)

            if (functionName === 'generate_diagram' && args.diagram_data) {
                const diagramData = args.diagram_data as DiagramData

                // Générer le diagramme sur le canvas
                generateDiagram(editor, diagramData, 'LR')

                // Callback optionnel
                onDiagramGenerated?.(diagramData)
            }
        },
        [editor, onDiagramGenerated]
    )

    /**
     * Handler pour les erreurs
     */
    const handleError = useCallback((error: string) => {
        console.error('❌ Voice control error:', error)
    }, [])

    /**
     * Hook OpenAI Realtime
     */
    const { state, connect, disconnect, startRecording, stopRecording } = useOpenAIRealtime({
        onFunctionCall: handleFunctionCall,
        onError: handleError,
    })

    /**
     * Toggle de l'enregistrement
     */
    const toggleRecording = useCallback(async () => {
        if (!state.isConnected) {
            // Connecter d'abord
            await connect()
            // Attendre un peu que la connexion s'établisse
            setTimeout(() => {
                startRecording()
            }, 500)
        } else if (state.isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
    }, [state.isConnected, state.isRecording, connect, startRecording, stopRecording])

    /**
     * Cleanup à la destruction
     */
    useEffect(() => {
        return () => {
            if (state.isConnected) {
                disconnect()
            }
        }
    }, [state.isConnected, disconnect])

    /**
     * Classe CSS pour l'animation du bouton
     */
    const getButtonClass = () => {
        if (state.isRecording) {
            return 'bg-red-600 hover:bg-red-700 animate-pulse'
        }
        if (state.isConnected) {
            return 'bg-blue-600 hover:bg-blue-700'
        }
        return 'bg-gray-600 hover:bg-gray-700'
    }

    /**
     * Icône du bouton
     */
    const getButtonIcon = () => {
        if (state.isRecording) {
            return '🔴'
        }
        if (state.isConnected) {
            return '🎤'
        }
        return '🎤'
    }

    /**
     * Texte du bouton
     */
    const getButtonText = () => {
        if (state.isRecording) {
            return 'Arrêter'
        }
        if (state.isConnected) {
            return 'Parler'
        }
        return 'Micro'
    }

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
            {/* Message d'erreur */}
            {state.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-sm shadow-lg">
                    <p className="text-sm font-semibold">Erreur</p>
                    <p className="text-xs">{state.error}</p>
                </div>
            )}

            {/* Indicateur d'état */}
            {state.isConnected && !state.isRecording && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded-lg text-xs shadow-md">
                    Connecté - Prêt à écouter
                </div>
            )}

            {/* Bouton micro principal */}
            <button
                onClick={toggleRecording}
                className={`${getButtonClass()} text-white font-semibold px-6 py-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center gap-2`}
                title={state.isRecording ? 'Arrêter l\'enregistrement' : 'Démarrer le contrôle vocal'}
            >
                <span className="text-2xl">{getButtonIcon()}</span>
                <span>{getButtonText()}</span>
            </button>

            {/* Bouton déconnexion (si connecté) */}
            {state.isConnected && !state.isRecording && (
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
