import React, { useState, useEffect } from 'react';

interface DiceRollerProps {
    rolling: boolean;
    onComplete: (result: number) => void;
}

export default function DiceRoller({ rolling, onComplete }: DiceRollerProps) {
    const [displayValue, setDisplayValue] = useState(20);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        if (rolling) {
            setIsAnimating(true);
            setShowResult(false);

            // Animation duration
            const duration = 1500;

            // Rapidly change numbers during roll
            const interval = setInterval(() => {
                setDisplayValue(Math.floor(Math.random() * 20) + 1);
            }, 50);

            setTimeout(() => {
                clearInterval(interval);
                const finalResult = Math.floor(Math.random() * 20) + 1;
                setDisplayValue(finalResult);
                setIsAnimating(false);
                setShowResult(true);

                // Keep result visible for a moment before notifying parent
                setTimeout(() => {
                    setShowResult(false);
                    onComplete(finalResult);
                }, 2000);
            }, duration);

            return () => clearInterval(interval);
        }
    }, [rolling, onComplete]);

    if (!rolling && !isAnimating && !showResult) return null;

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none rounded-2xl">
            <div className="relative flex flex-col items-center justify-center p-8 bg-black/60 rounded-3xl border border-[#ffb74d]/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] scale-125">

                {/* 3D Dice Container */}
                <div className={`relative w-24 h-24 transition-all duration-500 ${showResult ? 'scale-110' : 'scale-100'}`}>

                    {/* Spinning Animation Layer */}
                    {isAnimating && (
                        <div className="absolute inset-0 animate-spin-3d">
                            <D20Icon className="w-full h-full text-[#ffb74d] opacity-50 blur-sm" />
                        </div>
                    )}

                    {/* Result Layer */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isAnimating ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                        <D20Icon className="w-full h-full text-[#ffb74d] drop-shadow-[0_0_10px_rgba(255,183,77,0.4)]" />
                        <span className="absolute text-xl font-bold text-black font-[family-name:var(--font-cinzel)] mt-1">
                            {displayValue}
                        </span>
                    </div>
                </div>

                {/* Status Text (Optional, kept small) */}
                {isAnimating && (
                    <div className="mt-2 text-[#ffb74d] font-[family-name:var(--font-cinzel)] text-xs tracking-widest animate-pulse">
                        ROLLING...
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes spin-3d {
                    0% { transform: rotate3d(1, 1, 1, 0deg); }
                    100% { transform: rotate3d(1, 1, 1, 1080deg); }
                }
                .animate-spin-3d {
                    animation: spin-3d 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
}

// Realistic D20 SVG Icon
function D20Icon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 115" className={className} fill="currentColor">
            <path d="M50 0 L95 25 L95 75 L50 100 L5 75 L5 25 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            {/* Internal lines for 3D effect */}
            <path d="M50 0 L50 50 M50 50 L95 25 M50 50 L5 25 M50 50 L50 100 M50 100 L95 75 M50 100 L5 75" stroke="currentColor" strokeWidth="1" opacity="0.8" />
            {/* Shading for realism */}
            <path d="M50 0 L95 25 L50 50 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M5 25 L50 0 L50 50 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M5 75 L50 100 L50 50 Z" fill="currentColor" fillOpacity="0.3" />
            <path d="M95 75 L50 100 L50 50 Z" fill="currentColor" fillOpacity="0.15" />
        </svg>
    );
}
