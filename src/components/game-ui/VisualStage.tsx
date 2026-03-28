
import React, { useState } from 'react';

interface VisualStageProps {
    imageSrc?: string;
    caption?: string;
}

export default function VisualStage({ imageSrc, caption }: VisualStageProps) {
    const [imageLoading, setImageLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Reset loading state when imageSrc changes
    React.useEffect(() => {
        if (imageSrc) {
            setImageLoading(true);
            setImageLoaded(false);
        }
    }, [imageSrc]);

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageLoaded(false);
    };

    return (
        <div className="w-full h-full relative bg-black/50 border-b border-white/10 overflow-hidden group">
            {imageSrc ? (
                <>
                    {/* ── Generating Scene overlay ── */}
                    {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
                            <div className="text-center px-8">
                                {/* Spinning sigil rings */}
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

                                <p className="text-[#ffb74d] font-[family-name:var(--font-cinzel)] text-sm tracking-[0.3em] uppercase mb-2">
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

                    <img
                        src={imageSrc}
                        alt={caption || 'Scene'}
                        className="w-full h-full object-cover transition-transform duration-[20s] ease-linear scale-100 group-hover:scale-110"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />

                    {/* Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13141c] via-transparent to-black/40" />

                    {/* Caption */}
                    {caption && imageLoaded && (
                        <div className="absolute bottom-4 left-6 right-6 animate-fadeIn">
                            <div className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-xs font-bold text-amber-500 tracking-widest uppercase shadow-lg">
                                {caption}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* ── First-load / empty state ── */
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-black/80 to-[#0d0e14]">
                    {/* Animated sigil */}
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

                    {/* Flavor text */}
                    <div className="text-center px-6">
                        <p className="text-[#ffb74d]/70 font-[family-name:var(--font-cinzel)] text-sm tracking-[0.4em] uppercase mb-2">
                            The Vision Awaits
                        </p>
                        <p className="text-zinc-600 font-[family-name:var(--font-lato)] text-xs tracking-widest italic leading-relaxed">
                            Your first action will summon the scene.<br />
                            Speak, traveler — your story begins here.
                        </p>
                    </div>

                    {/* Decorative divider */}
                    <div className="flex items-center gap-3 w-36 opacity-25">
                        <div className="flex-1 h-px bg-[#ffb74d]" />
                        <span className="text-[#ffb74d] text-xs">⚔</span>
                        <div className="flex-1 h-px bg-[#ffb74d]" />
                    </div>
                </div>
            )}

            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 pointer-events-none mix-blend-overlay" />
        </div>
    );
}
