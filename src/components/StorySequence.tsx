import { useState, useEffect, useRef } from "react";

interface StorySequenceProps {
    onComplete: () => void;
}

interface SlideConfig {
    id: string;
    videoSrc: string;
    startTime: number; // seconds
    endTime: number; // seconds
    className?: string; // for filters
}

const SLIDES: SlideConfig[] = [
    {
        id: "slide1",
        videoSrc: "slides/slider-1.mp4",
        startTime: 3,
        endTime: 10,
        className: "opacity-50"
    },
    {
        id: "slide2",
        videoSrc: "slides/slider-2.mp4",
        startTime: 3,
        endTime: 10,
        className: "opacity-100 animate-shake" // Removed overlay, kept shake
    },
    {
        id: "slide3",
        videoSrc: "slides/slider-3.mp4",
        startTime: 3,
        endTime: 10,
        className: "opacity-100" // Removed overlay
    },
    {
        id: "slide4",
        videoSrc: "slides/slider-4.mp4",
        startTime: 3,
        endTime: 10,
        className: "opacity-100" // Removed overlay
    }
];

const VideoSlide = ({ config, onComplete }: { config: SlideConfig; onComplete: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime = config.startTime;

        const handleTimeUpdate = () => {
            if (video.currentTime >= config.endTime) {
                video.pause();
                onComplete();
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }, [config, onComplete]);

    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover -z-10 ${config.className}`}
        >
            <source src={config.videoSrc} type="video/mp4" />
        </video>
    );
};

export default function StorySequence({ onComplete }: StorySequenceProps) {
    const [stage, setStage] = useState<"loader" | number>(0); // DEV: Skip loader

    useEffect(() => {
        if (stage === "loader") {
            const timer = setTimeout(() => setStage(0), 3000);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    const handleSlideComplete = () => {
        if (typeof stage === "number") {
            if (stage < SLIDES.length - 1) {
                setStage(stage + 1);
            } else {
                onComplete();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-center px-4 font-[family-name:var(--font-cinzel)] overflow-hidden">

            {/* Loader Stage */}
            {stage === "loader" && (
                <div className="text-[#00ff00] font-mono text-lg md:text-xl tracking-widest animate-pulse">
                    <p className="mb-2">{">"} INITIALIZING CHRONICLES OF ARN...</p>
                    <p className="animate-[fadeIn_0.5s_ease-out_1s_forwards] opacity-0">{">"} SYNCING ASHENSPIRE SAGA...</p>
                </div>
            )}

            {/* Slides */}
            {typeof stage === "number" && (
                <div className={`relative z-10 w-full h-full ${stage === 1 ? "animate-burst-in" : "animate-fade-in"}`}>
                    <VideoSlide key={SLIDES[stage].id} config={SLIDES[stage]} onComplete={handleSlideComplete} />

                    {/* Slide 1 Content */}
                    {stage === 0 && (
                        <>
                            {/* Light Vignette */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.3)_100%)] z-0"></div>

                            <div className="absolute bottom-32 left-12 md:left-32 text-left max-w-2xl animate-fade-in z-10">
                                <p className="text-2xl md:text-4xl text-yellow-100 font-bold tracking-wide drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] font-[family-name:var(--font-play)]">
                                    "The First Flame was Mercy.<br />It saved us from the Rot."
                                </p>
                            </div>
                        </>
                    )}

                    {/* Slide 2 Content */}
                    {stage === 1 && (
                        <>
                            {/* Dark Overlay for Text (Bottom Right) */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(0,0,0,0.9)_0%,transparent_50%)] z-0"></div>
                            {/* Dark Overlay for Top Left */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(0,0,0,0.8)_0%,transparent_50%)] z-0"></div>
                            {/* Dark Overlay for Top Right */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(0,0,0,0.8)_0%,transparent_50%)] z-0"></div>

                            <div className="absolute bottom-32 right-12 md:right-32 text-right max-w-2xl animate-fade-in z-10">
                                <p className="text-2xl md:text-4xl text-white font-bold tracking-wide drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] font-[family-name:var(--font-play)]">
                                    "The Second Flame was Purity.<br />It burned the world to glass."
                                </p>
                            </div>
                        </>
                    )}

                    {/* Slide 3 Content */}
                    {stage === 2 && (
                        <>
                            {/* Dark Spotlight Overlay */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_70%,transparent_0%,rgba(0,0,0,0.6)_30%,rgba(0,0,0,0.95)_100%)] z-0"></div>

                            <div className="absolute bottom-48 left-16 md:left-48 text-left max-w-2xl animate-glitch z-10">
                                <p className="text-2xl md:text-4xl text-violet-300 font-bold tracking-wide drop-shadow-[0_0_30px_rgba(138,43,226,1)] font-[family-name:var(--font-play)]">
                                    "The Third Flame... is Erasure."
                                </p>
                            </div>
                        </>
                    )}

                    {/* Slide 4 Content */}
                    {stage === 3 && (
                        <>
                            {/* Dark Spotlight Overlay (Left Center) with Flicker */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,transparent_0%,rgba(0,0,0,0.6)_30%,rgba(0,0,0,0.95)_100%)] z-0 animate-flicker"></div>

                            <div className="absolute top-[60%] -translate-y-1/2 left-12 md:left-32 text-left max-w-3xl animate-fade-in z-10">
                                <p className="text-2xl md:text-4xl text-red-500 font-bold tracking-wide mb-4 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] font-[family-name:var(--font-play)]">
                                    "The Moonward Courts are watching.<br />History is being rewritten."
                                </p>
                                <p className="text-xl md:text-3xl text-white font-bold tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-[fadeIn_1s_ease-out_1.5s_forwards] opacity-0 font-[family-name:var(--font-play)]">
                                    "Will you remember?"
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
