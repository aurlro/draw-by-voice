import React, { useMemo } from 'react';

/**
 * Props for the VoiceIndicator component.
 */
interface VoiceIndicatorProps {
    /**
     * Normalized audio level between 0 and 1.
     * Used to drive the visual feedback of the indicator.
     */
    audioLevel: number;
}

/**
 * VoiceIndicator Component.
 * Visualizes the current audio level with a pulsing halo effect.
 *
 * @param props - The props for the component.
 * @returns The rendered VoiceIndicator component.
 */
export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ audioLevel }) => {
    // Scale dynamically based on audio volume.
    // We add a base scale (1) + a multiplier for the audio level.
    const dynamicStyle = useMemo(() => ({
        transform: `scale(${1 + audioLevel * 0.4})`,
        opacity: 0.8 + audioLevel * 0.2, // Slightly more opaque when loud
    }), [audioLevel]);

    return (
        <div className="relative flex items-center justify-center w-24 h-24">
            {/* Background pulsing halo - always gently pulsing, but gets slightly bigger/louder with voice */}
            <div
                className="absolute w-full h-full rounded-full bg-gradient-to-r from-orange-200 to-pink-200 blur-xl opacity-50 transition-transform duration-75"
                style={{
                    transform: `scale(${1 + audioLevel * 0.8})`
                }}
            />

            {/* Inner pulsing ring */}
            <div
                className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-orange-300 to-pink-300 animate-pulse blur-md transition-all duration-75"
                style={dynamicStyle}
            />

            {/* Core indicator */}
            <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
                <div className={`w-3 h-3 rounded-full transition-colors duration-200 ${audioLevel > 0.1 ? 'bg-orange-500' : 'bg-neutral-300'}`} />
            </div>
        </div>
    );
};
