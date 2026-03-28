
import React, { useState } from 'react';

interface VisualStageProps {
    imageSrc?: string;
    caption?: string;
    /** External generation/loading state from parent request lifecycle */
    isGenerating?: boolean;
    /** Parallax offset X in pixels */
    parallaxX?: number;
    /** Parallax offset Y in pixels */
    parallaxY?: number;
}

export default function VisualStage({
    imageSrc,
    caption,
    isGenerating = false,
    parallaxX = 0,
    parallaxY = 0
}: VisualStageProps) {
    const [imageLoading, setImageLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const showLoadingOverlay = isGenerating || imageLoading;

    React.useEffect(() => {
        if (!imageSrc) {
            setImageLoading(false);
            setImageLoaded(false);
            return;
        }

        let cancelled = false;
        setImageLoading(true);
        setImageLoaded(false);

        // Some data-URI loads can behave inconsistently with onLoad timing.
        // Preload explicitly and also add a timeout so the loader cannot remain forever.
        const preload = new Image();
        preload.onload = () => {
            if (cancelled) return;
            setImageLoading(false);
            setImageLoaded(true);
        };
        preload.onerror = () => {
            if (cancelled) return;
            setImageLoading(false);
            setImageLoaded(false);
        };
        preload.src = imageSrc;

        const fallbackTimer = window.setTimeout(() => {
            if (cancelled) return;
            setImageLoading(false);
        }, 12000);

        return () => {
            cancelled = true;
            window.clearTimeout(fallbackTimer);
        };
    }, [imageSrc]);

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageLoaded(false);
    };

    // 3D rotation derived from parallax — gives the "looking into a scene" effect
    const rotateY = (parallaxX / 60) * 2.5;  // subtle Y-axis rotation
    const rotateX = (parallaxY / 15) * -0.8; // very subtle X tilt

    return (
        <div
            className="w-full h-full relative bg-black border-b border-white/10 overflow-hidden"
            style={{ perspective: '1200px' }}
        >
            {imageSrc ? (
                <>
                    {/* ── Generating Scene overlay ── */}
                    {showLoadingOverlay && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
                            <div className="text-center px-8">
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="absolute inset-0 rounded-full border-2 border-[#ffb74d]/20 animate-ping" />
                                    <div
                                        className="absolute inset-0 rounded-full border border-[#ffb74d]/50 animate-spin"
                                        style={{ animationDuration: '3s' }}
                                    />
                                    <div
                                        className="absolute inset-2 rounded-full border border-[#DC143C]/40 animate-spin"
                                        style={{ animationDuration: '2s', animationDirection: 'reverse' }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span
                                            className="text-3xl text-[#ffb74d]"
                                            style={{ filter: 'drop-shadow(0 0 8px #ffb74d)' }}
                                        >
                                            ⚔
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[#ffb74d] font-[family-name:var(--font-cinzel)] text-sm tracking-[0.2em] mb-2">
                                    Weaving the Realm...
                                </p>
                                <p className="text-zinc-500 font-[family-name:var(--font-lato)] text-xs tracking-widest italic">
                                    The chronicler renders your fate
                                </p>
                                <div className="mt-5 flex gap-2 justify-center">
                                    <div className="w-1.5 h-1.5 bg-[#ffb74d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1.5 h-1.5 bg-[#ffb74d]/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1.5 h-1.5 bg-[#ffb74d]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── 3D Scene Container ── */}
                    <div
                        className="absolute inset-0"
                        style={{
                            transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.2s ease-out',
                        }}
                    >
                        {/* Background layer (furthest, moves slowest) */}
                        <img
                            src={imageSrc}
                            alt={caption || 'Scene'}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{
                                transform: `scale(1.3) translate(${parallaxX}px, ${parallaxY}px) translateZ(-50px)`,
                                transition: 'transform 0.2s ease-out',
                                filter: 'brightness(0.85)',
                            }}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />

                        {/* Mid-depth atmospheric haze — moves slightly faster */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'radial-gradient(ellipse at 50% 80%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.3) 100%)',
                                transform: `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px) translateZ(20px)`,
                                transition: 'transform 0.2s ease-out',
                            }}
                        />

                        {/* Foreground fog wisps — moves fastest for depth illusion */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                transform: `translate(${parallaxX * -0.5}px, 0) translateZ(60px)`,
                                transition: 'transform 0.2s ease-out',
                            }}
                        >
                            {/* Left fog */}
                            <div
                                className="absolute left-0 bottom-0 w-[40%] h-[50%]"
                                style={{
                                    background: 'radial-gradient(ellipse at 20% 90%, rgba(30,25,20,0.5), transparent 70%)',
                                    filter: 'blur(30px)',
                                    animation: 'fog 20s ease-in-out infinite',
                                }}
                            />
                            {/* Right fog */}
                            <div
                                className="absolute right-0 bottom-0 w-[35%] h-[45%]"
                                style={{
                                    background: 'radial-gradient(ellipse at 80% 85%, rgba(25,20,30,0.4), transparent 70%)',
                                    filter: 'blur(25px)',
                                    animation: 'fog 25s ease-in-out infinite reverse',
                                }}
                            />
                            {/* Center fog */}
                            <div
                                className="absolute left-[20%] right-[20%] bottom-0 h-[30%]"
                                style={{
                                    background: 'linear-gradient(to top, rgba(20,18,25,0.4), transparent)',
                                    filter: 'blur(15px)',
                                }}
                            />
                        </div>

                        {/* Floating dust particles — foreground depth */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                transform: `translate(${parallaxX * -0.8}px, 0) translateZ(80px)`,
                                transition: 'transform 0.15s ease-out',
                            }}
                        >
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={`dust-${i}`}
                                    className="absolute rounded-full"
                                    style={{
                                        left: `${8 + (i * 7.5)}%`,
                                        top: `${20 + (i % 4) * 18}%`,
                                        width: `${1 + (i % 3)}px`,
                                        height: `${1 + (i % 3)}px`,
                                        backgroundColor: i % 3 === 0 ? 'rgba(255,183,77,0.3)' : 'rgba(200,200,200,0.15)',
                                        animation: `ember-float ${6 + i * 0.6}s ease-in-out infinite ${i * 0.5}s`,
                                        filter: 'blur(0.5px)',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Vignette — stays fixed, outside 3D transform */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: `
                            radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%),
                            linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 30%, transparent 80%, rgba(0,0,0,0.4) 100%)
                        `
                    }} />

                    {/* Caption */}
                    {caption && imageLoaded && (
                        <div className="absolute bottom-4 left-6 right-6 animate-fadeIn z-10">
                            <div className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-xs font-bold text-amber-500 tracking-widest uppercase shadow-lg">
                                {caption}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* ── First-load / empty state ── */
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-black/80 to-[#0d0e14]">
                    <div className="relative w-24 h-24">
                        <div
                            className="absolute inset-0 rounded-full border border-[#ffb74d]/10 animate-ping"
                            style={{ animationDuration: '2.5s' }}
                        />
                        <div
                            className="absolute inset-0 rounded-full border border-[#ffb74d]/25 animate-spin"
                            style={{ animationDuration: '8s' }}
                        />
                        <div
                            className="absolute inset-3 rounded-full border border-[#DC143C]/20 animate-spin"
                            style={{ animationDuration: '5s', animationDirection: 'reverse' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span
                                className="text-4xl text-[#ffb74d]/50 animate-pulse"
                                style={{ filter: 'drop-shadow(0 0 12px rgba(255,183,77,0.35))' }}
                            >
                                ✦
                            </span>
                        </div>
                    </div>
                    <div className="text-center px-6">
                        <p className="text-[#ffb74d]/70 font-[family-name:var(--font-cinzel)] text-sm tracking-[0.3em] mb-2">
                            The Vision Awaits
                        </p>
                        <p className="text-zinc-600 font-[family-name:var(--font-lato)] text-xs tracking-widest italic leading-relaxed">
                            Your first action will summon the scene.<br />
                            Speak, traveler — your story begins here.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-36 opacity-25">
                        <div className="flex-1 h-px bg-[#ffb74d]" />
                        <span className="text-[#ffb74d] text-xs">⚔</span>
                        <div className="flex-1 h-px bg-[#ffb74d]" />
                    </div>
                </div>
            )}
        </div>
    );
}
