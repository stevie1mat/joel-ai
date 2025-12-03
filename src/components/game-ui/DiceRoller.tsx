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
            let duration = 1000; // 1 second roll
            let startTime = Date.now();

            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed > duration) {
                    clearInterval(interval);
                    const finalResult = Math.floor(Math.random() * 20) + 1;
                    setDisplayValue(finalResult);
                    setIsAnimating(false);
                    setShowResult(true);

                    // Show result for 2 seconds
                    setTimeout(() => {
                        setShowResult(false);
                        onComplete(finalResult);
                    }, 2000);
                } else {
                    setDisplayValue(Math.floor(Math.random() * 20) + 1);
                }
            }, 50);

            return () => clearInterval(interval);
        }
    }, [rolling, onComplete]);

    if (!rolling && !isAnimating && !showResult) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Hexagon Shape (CSS) */}
                <div className={`w-24 h-24 bg-indigo-600 flex items-center justify-center text-4xl font-bold text-white clip-path-hexagon transition-transform ${isAnimating ? 'animate-spin-slow' : showResult ? 'scale-110 shadow-xl shadow-indigo-500/50' : ''}`}>
                    {displayValue}
                </div>
                <style jsx>{`
                    .clip-path-hexagon {
                        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                    }
                    .animate-spin-slow {
                        animation: spin 0.5s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}
