
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
            {/* Main Image */}
            {imageSrc ? (
                <>
                    {/* Loading Overlay */}
                    {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                            <div className="text-center">
                                <div className="text-6xl mb-4 animate-pulse"></div>
                                <p className="text-[#ffb74d] font-[family-name:var(--font-cinzel)] text-sm tracking-widest uppercase">
                                    Generating Scene...
                                </p>
                                <div className="mt-4 flex gap-2 justify-center">
                                    <div className="w-2 h-2 bg-[#ffb74d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-[#ffb74d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-[#ffb74d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <img
                        src={imageSrc}
                        alt={caption || "Scene"}
                        className="w-full h-full object-cover transition-transform duration-[20s] ease-linear scale-100 group-hover:scale-110"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />

                    {/* Vignette & Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13141c] via-transparent to-black/40" />

                    {/* Caption/Context */}
                    {caption && imageLoaded && (
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
