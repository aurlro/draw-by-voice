'use client'

import { useState } from 'react'
import { Editor } from '@tldraw/tldraw'
import { generateDiagram } from '@/lib/diagramGenerator'
import { MOCK_DIAGRAMS } from '@/lib/mockData'

interface DemoButtonProps {
    editor: Editor
}

export default function DemoButton({ editor }: DemoButtonProps) {
    const [selectedDemo, setSelectedDemo] = useState<string>('AWS Architecture')
    const [isOpen, setIsOpen] = useState(false)

    const handleGenerateDemo = () => {
        const diagramData = MOCK_DIAGRAMS[selectedDemo as keyof typeof MOCK_DIAGRAMS]

        if (diagramData) {
            console.log('🎭 Generating demo diagram:', selectedDemo)
            generateDiagram(editor, diagramData, 'LR')
            setIsOpen(false)
        }
    }

    return (
        <div className="fixed top-40 right-4 z-50 flex flex-col items-end gap-2">
            {/* Dropdown menu */}
            {isOpen && (
                <div className="bg-white border border-gray-300 rounded-lg shadow-xl p-2 min-w-[200px]">
                    <p className="text-xs font-semibold text-gray-700 px-2 py-1">Choisir un exemple :</p>
                    {Object.keys(MOCK_DIAGRAMS).map((name) => (
                        <button
                            key={name}
                            onClick={() => setSelectedDemo(name)}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedDemo === name
                                ? 'bg-purple-100 text-purple-800 font-semibold'
                                : 'hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                            onClick={handleGenerateDemo}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded transition-colors"
                        >
                            Générer
                        </button>
                    </div>
                </div>
            )}

            {/* Main button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
                <span>🎭</span>
                <span>Demo</span>
            </button>
        </div>
    )
}
