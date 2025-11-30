"use client";

import { useState } from "react";
import { FACTIONS } from "@/lib/character-types";

interface AllegianceStepProps {
    onComplete: (allegiance: string) => void;
    onBack: () => void;
}

export default function AllegianceStep({ onComplete, onBack }: AllegianceStepProps) {
    const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
    const [hoveredFaction, setHoveredFaction] = useState<string | null>(null);

    const handleSelect = (factionId: string) => {
        setSelectedFaction(factionId);
    };

    const handleContinue = () => {
        if (selectedFaction) {
            onComplete(selectedFaction);
        }
    };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-[#ffb74d] mb-4 font-[family-name:var(--font-cinzel)]">
                    CHOOSE YOUR ALLEGIANCE
                </h1>
                <p className="text-gray-400 text-lg mb-4 italic font-[family-name:var(--font-lato)]">
                    "Your faction shapes your destiny and grants unique powers"
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
                {FACTIONS.map((faction) => {
                    const isSelected = selectedFaction === faction.id;
                    const isHovered = hoveredFaction === faction.id;

                    return (
                        <button
                            key={faction.id}
                            onClick={() => handleSelect(faction.id)}
                            onMouseEnter={() => setHoveredFaction(faction.id)}
                            onMouseLeave={() => setHoveredFaction(null)}
                            className={`bg-black/50 border-2 rounded-sm p-6 text-left transition-all hover:scale-105 relative overflow-hidden ${isSelected
                                    ? 'border-[#ffb74d] shadow-[0_0_20px_rgba(255,183,77,0.5)]'
                                    : 'border-[#ffb74d]/30 hover:border-[#ffb74d]/60'
                                }`}
                        >
                            {/* Faction Icon */}
                            <div className="text-6xl mb-4 text-center">{faction.icon}</div>

                            {/* Faction Name */}
                            <h3 className="text-xl font-bold text-[#ffb74d] mb-2 text-center font-[family-name:var(--font-cinzel)]">
                                {faction.name.toUpperCase()}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-400 mb-4 font-[family-name:var(--font-lato)] text-center">
                                {faction.description}
                            </p>

                            {/* Lore - Show on hover or selection */}
                            {(isHovered || isSelected) && (
                                <div className="mb-4 animate-[fadeIn_0.3s_ease-out]">
                                    <p className="text-xs text-gray-300 italic font-[family-name:var(--font-lato)] border-t border-gray-700 pt-3">
                                        "{faction.lore}"
                                    </p>
                                </div>
                            )}

                            {/* Faction Benefit */}
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="text-xs text-[#ffb74d] font-[family-name:var(--font-cinzel)] mb-1">
                                    FACTION BENEFIT:
                                </p>
                                <p className="text-xs text-green-400 font-[family-name:var(--font-lato)]">
                                    {faction.benefit}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-4 max-w-md mx-auto">
                <button
                    onClick={onBack}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 font-[family-name:var(--font-cinzel)]"
                >
                    [ BACK ]
                </button>
                <button
                    onClick={handleContinue}
                    disabled={!selectedFaction}
                    className="flex-1 bg-[#DC143C] hover:bg-[#B22222] disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_15px_rgba(220,20,60,0.5)] hover:shadow-[0_0_25px_rgba(220,20,60,0.8)] font-[family-name:var(--font-cinzel)]"
                >
                    [ CONTINUE ]
                </button>
            </div>
        </div>
    );
}
