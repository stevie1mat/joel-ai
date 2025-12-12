
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
    onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("INITIALIZING SYSTEMS...");

    useEffect(() => {
        // Preload videos
        const videos = ["/intro-home.mp4", "/hero-videoa.mp4", "/hero-videob.mp4"];
        videos.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = src;
            document.head.appendChild(link);
        });
    }, []);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 2; // Slower, smoother loading
                if (next >= 100) {
                    clearInterval(interval);
                    if (onComplete) {
                        setTimeout(onComplete, 500); // Slight delay for effect
                    }
                    return 100;
                }

                // Update text based on progress thresholds
                if (next < 30) setStatusText("INITIALIZING...");
                else if (next < 80) setStatusText("LOADING ASSETS..."); // Main focus
                else setStatusText("PREPARING...");

                return next;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center font-mono z-[100]">
            <div className="w-full max-w-lg px-8">
                {/* Title */}
                <h1 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase font-sans">
                    AI D&D
                </h1>

                {/* Progress Bar Container */}
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-white transition-all duration-200 ease-out"
                        style={{ width: `${progress}% ` }}
                    />
                </div>

                {/* Status Line */}
                <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    <span className="text-zinc-300 w-8">{Math.round(progress)}%</span>
                    <span>·</span>
                    <span>{statusText}</span>
                </div>
            </div>
        </div>
    );
}
