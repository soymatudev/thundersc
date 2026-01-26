import React from 'react';

const Thermometer = ({ value, min, max, height = 150 }) => {
    // Logic to determine color based on thresholds
    const getLiquidColor = () => {
        if (value < min) return 'text-blue-500';
        if (value > max) return 'text-red-500';
        return 'text-cyan-400';
    };

    const getLiquidBg = () => {
        if (value < min) return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]';
        if (value > max) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
        return 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]';
    };

    // Calculate percentage for the liquid height (clamped between 0 and 100)
    // Assuming a range of -20 to 50 for display if not specified, 
    // but let's just use the min/max to define a safe range for the visual.
    const displayMin = Math.min(min - 5, -10);
    const displayMax = Math.max(max + 5, 45);
    const percentage = Math.min(Math.max(((value - displayMin) / (displayMax - displayMin)) * 100, 5), 95);

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="relative w-8 bg-gray-800 rounded-full border-2 border-gray-700 overflow-hidden flex flex-col justify-end p-0.5"
                style={{ height: `${height}px` }}
            >
                {/* The Liquid */}
                <div
                    className={`w-full rounded-full transition-all duration-1000 ease-out ${getLiquidBg()}`}
                    style={{ height: `${percentage}%` }}
                />

                {/* Markers (Optional suttle lines) */}
                <div className="absolute inset-0 flex flex-col justify-between py-4 pointer-events-none opacity-20">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-full h-px bg-white" />
                    ))}
                </div>
            </div>

            <div className={`text-xl font-bold font-mono ${getLiquidColor()}`}>
                {value.toFixed(1)}°C
            </div>
        </div>
    );
};

export default Thermometer;
