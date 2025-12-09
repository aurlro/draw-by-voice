// Feature: Voice - Public Exports

// Components (default export)
<<<<<<< HEAD
/**
 * VoiceControl Component.
 * The main UI component for controlling the voice interaction session.
 */
export { default as VoiceControl } from './components/VoiceControl'

// Hooks
/**
 * Hook to manage Realtime WebSocket connection.
 */
export { useRealtimeConnection } from './hooks/useRealtimeConnection'
/**
 * Hook to record audio from microphone.
 */
export { useAudioRecorder } from './hooks/useAudioRecorder'
/**
 * Hook to play audio from AI response.
 */
export { useAudioPlayer } from './hooks/useAudioPlayer'

// Lib
/**
 * Function definition for the AI model to call for generating diagrams.
 */
export { GENERATE_DIAGRAM_FUNCTION } from './lib/functionDefinitions'
/**
 * The system prompt defining the AI's persona and rules.
 */
export { SYSTEM_PROMPT } from './lib/systemPrompt'
=======
export { default as VoiceControl } from './components/VoiceControl'

// Hooks
export { useRealtimeConnection } from './hooks/useRealtimeConnection'
export { useAudioRecorder } from './hooks/useAudioRecorder'
export { useAudioPlayer } from './hooks/useAudioPlayer'

// Lib
export { GENERATE_DIAGRAM_FUNCTION } from './lib/functionDefinitions'
export { SYSTEM_PROMPT } from './lib/systemPrompt'

>>>>>>> origin/enhance-diagram-visuals-bindings
