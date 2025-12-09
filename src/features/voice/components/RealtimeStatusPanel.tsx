import React, { useRef, useEffect } from 'react';
import { VoiceIndicator } from './VoiceIndicator';

<<<<<<< HEAD
/**
 * Props for the RealtimeStatusPanel component.
 */
interface RealtimeStatusPanelProps {
    /** Indicates if the session is currently active. */
    isActive: boolean;
    /** Indicates if the microphone is currently recording. */
    isListening: boolean;
    /** Indicates if the session is currently connecting. */
    isConnecting: boolean;
    /** Current error message, if any. */
    error: string | null;
    /** Current audio level for visualization (0-1). */
    audioLevel: number;
    /** List of recent events to display in the log. */
    events: unknown[];
    /** Arguments of the last tool call, for debugging. */
    lastToolCallArgs: string | null;
    /** Callback to toggle the recording session. */
    onToggleSession: () => void;
    /** Callback to disconnect the session. */
    onDisconnect: () => void;
    /** Callback to reset the session and clear context. */
    onReset: () => void;
}

/**
 * RealtimeStatusPanel Component.
 * Displays the status of the realtime voice session, including connection state,
 * audio visualization, logs, and controls.
 *
 * @param props - The props for the component.
 * @returns The rendered RealtimeStatusPanel component.
 */
=======
interface RealtimeStatusPanelProps {
    isActive: boolean;
    isListening: boolean;
    isConnecting: boolean;
    error: string | null;
    audioLevel: number;
    events: unknown[];
    lastToolCallArgs: string | null;
    onToggleSession: () => void;
    onDisconnect: () => void;
    onReset: () => void;
}

>>>>>>> origin/enhance-diagram-visuals-bindings
export const RealtimeStatusPanel: React.FC<RealtimeStatusPanelProps> = ({
    isActive,
    isListening,
    isConnecting,
    error,
    audioLevel,
    events,
    lastToolCallArgs,
    onToggleSession,
    onDisconnect,
    onReset,
}) => {
    const logsRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
    }, [events]);

    const getStatusText = () => {
        if (isConnecting) return 'Connecting...';
        if (isListening) return 'Listening...';
        if (isActive) return 'Connected (Idle)';
        return 'Disconnected';
    };

    const getStatusColor = () => {
        if (error) return 'text-red-500';
        if (isListening) return 'text-green-500';
        if (isActive) return 'text-blue-500';
        return 'text-gray-400';
    };

    return (
        <div className="fixed top-4 right-4 z-50 w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 overflow-hidden text-xs font-mono flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <span className="font-bold text-gray-700">REALTIME STATUS</span>
                <span className={`font-semibold ${getStatusColor()}`}>
                    {getStatusText()}
                </span>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 p-2 text-red-600 border-b border-red-100 break-words">
                    {error}
                </div>
            )}

            {/* Controls */}
            <div className="p-3 space-y-2 border-b border-gray-100">
                <p className="text-gray-400 italic">
                    {isActive ? 'Listening for your commands...' : 'Connect to start capturing audio commands.'}
                </p>

                <div className="flex flex-col gap-2">
                    {/* Connect / Disconnect Main Button */}
                    {!isActive ? (
                        <button
                            onClick={onToggleSession}
                            disabled={isConnecting}
                            className="w-full py-2 bg-gray-900 hover:bg-black text-white rounded-lg transition-all font-semibold disabled:opacity-50"
                        >
                            {isConnecting ? 'Connecting...' : 'Connect Realtime'}
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={onDisconnect}
                                className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-semibold"
                            >
                                Disconnect
                            </button>
                            <button
                                onClick={onToggleSession}
                                className={`flex-1 py-2 rounded-lg transition-all font-semibold border ${isListening ? 'bg-red-600 border-red-600 text-white animate-pulse' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                {isListening ? 'Stop Mic' : 'Start Mic'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Reset / Optimization Button */}
                <button
                    onClick={onReset}
                    className="w-full mt-2 py-1.5 flex items-center justify-center gap-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg text-[10px] font-medium transition-colors border border-gray-200 hover:border-red-200"
                    title="Clear Canvas & Reset Session Context (Saves Tokens)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                    Reset & Optimize Tokens
                </button>
            </div>

            {/* Audio Visualizer (integrated) */}
            {isActive && (
                <div className="h-16 flex items-center justify-center border-b border-gray-100 bg-gray-50/30 relative overflow-hidden">
                    {/* We reuse the mechanic but style it flatly here */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <VoiceIndicator audioLevel={audioLevel} />
                    </div>
                    <span className="text-gray-400 z-10">Audio Level</span>
                </div>
            )}


            {/* Event Logs Stream */}
            <div className="flex-1 min-h-[150px] flex flex-col border-b border-gray-100">
                <div className="p-2 bg-gray-50 text-gray-500 font-bold text-[10px] uppercase tracking-wider">
                    Event Log
                </div>
                <div ref={logsRef} className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
                    {events.length === 0 && <span className="text-gray-300 italic">No events yet</span>}
<<<<<<< HEAD
                    {events.map((e: any, i) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
=======
                    {events.map((e: any, i) => (
>>>>>>> origin/enhance-diagram-visuals-bindings
                        <div key={i} className="flex gap-2 text-[10px] border-b border-gray-50 pb-1 last:border-0">
                            <span className="text-gray-400 w-16 shrink-0 truncate" title={e.event_id || 'no-id'}>
                                {e.type?.split('.').pop()}
                            </span>
                            <span className="text-gray-600 truncate flex-1">
                                {JSON.stringify(e).slice(0, 100)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Last Tool Call Args */}
            <div className="p-2 bg-gray-50 flex flex-col gap-1 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-600">Last generate_diagram args :</span>
                    <button
                        onClick={() => navigator.clipboard.writeText(lastToolCallArgs || '')}
                        className="text-[10px] bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded text-gray-600"
                    >
                        Copy
                    </button>
                </div>
                <pre className="bg-white border border-gray-200 rounded p-2 overflow-auto h-32 text-[10px] text-gray-600">
                    {lastToolCallArgs || '// tool not called yet'}
                </pre>
            </div>
        </div>
    );
};
