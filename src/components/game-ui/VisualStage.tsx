
import React from 'react';

interface VisualStageProps {
    imageSrc?: string;
    caption?: string;
}

export default function VisualStage({ imageSrc, caption }: VisualStageProps) {
    return (
        <div className="w-full h-full relative bg-black/50 border-b border-white/10 overflow-hidden group">
            {/* Main Image */}
            {imageSrc ? (
                <>
                    <img
                        src={imageSrc}
                        alt={caption || "Scene"}
                        className="w-full h-full object-cover transition-transform duration-[20s] ease-linear scale-100 group-hover:scale-110"
                    />

                    {/* Vignette & Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13141c] via-transparent to-black/40" />

                    {/* Caption/Context */}
                    {caption && (
                        <div className="absolute bottom-4 left-6 right-6 animate-fadeIn">
                            <div className="inline-block px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-xs font-bold text-amber-500 tracking-widest uppercase shadow-lg">
                                {caption}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 font-[family-name:var(--font-cinzel)] tracking-widest uppercase text-sm">
                    Awaiting Visual Uplink...
                </div>
            )}

            {/* Scanline Effect (Optional Aesthetic) */}
            <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 pointer-events-none mix-blend-overlay" />
        </div>
    );
}
