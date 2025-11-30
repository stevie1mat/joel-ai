"use client";

import { useState } from "react";
import { Character, CLASSES, FACTIONS } from "@/lib/character-types";

interface AvatarStepProps {
    character: Partial<Character>;
    onComplete: (avatarUrl: string) => void;
    onBack: () => void;
}

export default function AvatarStep({ character, onComplete, onBack }: AvatarStepProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedClass = CLASSES.find(c => c.id === character.class);
    const selectedFaction = FACTIONS.find(f => f.id === character.allegiance);

    const generateAvatar = async () => {
        setGenerating(true);
        setError(null);

        try {
            // Build prompt based on character details
            const prompt = `Fantasy RPG character portrait, ${character.name}, ${selectedClass?.name} class, ${selectedFaction?.name} allegiance, dramatic lighting with glowing amber and golden accents, dark atmospheric background with mystical energy, cinematic fantasy art, highly detailed face and armor, painterly digital art style, warm amber highlights, mysterious shadows, epic fantasy illustration, character concept art, professional quality`;

            // Use Pollinations.AI (free, no API key needed)
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

            // Set URL immediately - the onLoad handler will stop the spinner
            setAvatarUrl(imageUrl);

        } catch (err: any) {
            setError(err.message || "Failed to generate avatar");
            setGenerating(false);
        }
    };

    const handleImageLoad = () => {
        // Called when image finishes loading
        setGenerating(false);
    };

    const handleImageError = () => {
        setError("Failed to load portrait");
        setGenerating(false);
    };

    const handleUseAvatar = () => {
        if (avatarUrl) {
            onComplete(avatarUrl);
        }
    };

    const handleRegenerate = () => {
        generateAvatar();
    };

    // Auto-generate on mount
    if (!avatarUrl && !generating && !error) {
        generateAvatar();
    }

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-[#ffb74d] mb-4 font-[family-name:var(--font-cinzel)]">
                    YOUR PORTRAIT
                </h1>
                <p className="text-gray-400 text-lg mb-4 italic font-[family-name:var(--font-lato)]">
                    "Behold your legend captured in amber light"
                </p>
            </div>

            <div className="max-w-lg mx-auto mb-8">
                {/* Avatar Display */}
                <div className="relative flex items-center justify-center mb-6">
                    {generating && !avatarUrl && (
                        <div className="w-80 h-80 rounded-full bg-black/50 border-4 border-[#ffb74d]/30 flex flex-col items-center justify-center">
                            <div className="text-6xl mb-4 animate-pulse">🎨</div>
                            <p className="text-[#ffb74d] font-[family-name:var(--font-cinzel)] text-sm">
                                FORGING YOUR PORTRAIT...
                            </p>
                            <div className="mt-4 flex gap-2">
                                <div className="w-2 h-2 bg-[#ffb74d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-[#ffb74d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-[#ffb74d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="w-80 h-80 rounded-full bg-black/50 border-4 border-red-400/50 flex flex-col items-center justify-center">
                            <div className="text-6xl mb-4">❌</div>
                            <p className="text-red-400 font-[family-name:var(--font-cinzel)] text-sm mb-4 text-center px-8">
                                {error}
                            </p>
                            <button
                                onClick={handleRegenerate}
                                className="bg-[#DC143C] hover:bg-[#B22222] text-white font-bold py-2 px-6 rounded-sm text-xs tracking-widest transition-all hover:scale-105 font-[family-name:var(--font-cinzel)]"
                            >
                                [ TRY AGAIN ]
                            </button>
                        </div>
                    )}

                    {avatarUrl && (
                        <div className="relative">
                            {generating && (
                                <div className="absolute inset-0 w-80 h-80 rounded-full bg-black/50 border-4 border-[#ffb74d]/30 flex flex-col items-center justify-center z-10">
                                    <div className="text-6xl mb-4 animate-pulse">🎨</div>
                                    <p className="text-[#ffb74d] font-[family-name:var(--font-cinzel)] text-sm">
                                        FORGING YOUR PORTRAIT...
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <div className="w-2 h-2 bg-[#ffb74d] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-[#ffb74d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-[#ffb74d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-[#ffb74d] shadow-[0_0_30px_rgba(255,183,77,0.5)]">
                                <img
                                    src={avatarUrl}
                                    alt={character.name}
                                    className="w-full h-full object-cover"
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                />
                            </div>
                            {/* Character name below */}
                            <p className="text-center text-2xl text-[#ffb74d] font-[family-name:var(--font-cinzel)] mt-4">
                                {character.name}
                            </p>
                            <p className="text-center text-sm text-gray-400 font-[family-name:var(--font-lato)]">
                                {selectedClass?.name} • {selectedFaction?.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* Regenerate Button (only show when avatar exists) */}
                {avatarUrl && !generating && (
                    <div className="text-center mb-6">
                        <button
                            onClick={handleRegenerate}
                            className="bg-black/50 hover:bg-black/70 border border-[#ffb74d]/30 hover:border-[#ffb74d] text-[#ffb74d] font-bold py-2 px-6 rounded-sm text-xs tracking-widest transition-all hover:scale-105 font-[family-name:var(--font-cinzel)]"
                        >
                            🔄 REGENERATE PORTRAIT
                        </button>
                    </div>
                )}
            </div>

            <div className="flex gap-4 max-w-md mx-auto">
                <button
                    onClick={onBack}
                    disabled={generating}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 disabled:cursor-not-allowed font-[family-name:var(--font-cinzel)]"
                >
                    [ BACK ]
                </button>
                <button
                    onClick={handleUseAvatar}
                    disabled={!avatarUrl || generating}
                    className="flex-1 bg-[#DC143C] hover:bg-[#B22222] disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_15px_rgba(220,20,60,0.5)] hover:shadow-[0_0_25px_rgba(220,20,60,0.8)] font-[family-name:var(--font-cinzel)]"
                >
                    [ USE THIS PORTRAIT ]
                </button>
            </div>
        </div>
    );
}
