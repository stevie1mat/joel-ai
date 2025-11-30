"use client";

import { Character, CLASSES, STAT_NAMES, calculateModifier, getStatModifierString, FACTIONS } from "@/lib/character-types";

interface CharacterSummaryProps {
    character: Character;
    onConfirm: () => void;
    onBack: () => void;
}

export default function CharacterSummary({ character, onConfirm, onBack }: CharacterSummaryProps) {
    const selectedClass = CLASSES.find(c => c.id === character.class);
    const selectedFaction = FACTIONS.find(f => f.id === character.allegiance);

    // Calculate starting HP (10 + CON modifier for level 1)
    const conModifier = calculateModifier(character.stats.constitution);
    const startingHP = 10 + conModifier;

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-[#ffb74d] mb-4 font-[family-name:var(--font-cinzel)]">
                    YOUR HERO AWAITS
                </h1>
                <p className="text-gray-400 text-lg mb-4 italic font-[family-name:var(--font-lato)]">
                    "Confirm your choices and begin your legend"
                </p>
            </div>

            <div className="max-w-2xl mx-auto bg-black/50 border-2 border-[#ffb74d]/30 rounded-sm p-8 mb-8">
                {/* Avatar and Character Name */}
                <div className="text-center mb-8 pb-8 border-b border-gray-700">
                    {character.avatar_url && (
                        <div className="mb-6">
                            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-[#ffb74d] shadow-[0_0_30px_rgba(255,183,77,0.5)]">
                                <img
                                    src={character.avatar_url}
                                    alt={character.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}
                    <h2 className="text-5xl font-bold text-[#ffb74d] font-[family-name:var(--font-cinzel)]">
                        {character.name}
                    </h2>
                    <p className="text-xl text-gray-400 mt-2 font-[family-name:var(--font-lato)]">
                        Level {character.level} {selectedClass?.name}
                    </p>
                    {selectedFaction && (
                        <div className="mt-3 inline-flex items-center gap-2 bg-black/30 border border-[#ffb74d]/30 rounded-sm px-4 py-2">
                            <span className="text-2xl">{selectedFaction.icon}</span>
                            <span className="text-sm text-[#ffb74d] font-[family-name:var(--font-cinzel)]">{selectedFaction.name}</span>
                        </div>
                    )}
                    <div className="mt-3">
                        <span className="text-sm text-gray-400 font-[family-name:var(--font-cinzel)]">Starting HP: </span>
                        <span className="text-2xl font-bold text-green-400">{startingHP}</span>
                    </div>
                </div>

                {/* Class Info with Abilities */}
                <div className="mb-8 pb-8 border-b border-gray-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-6xl">{selectedClass?.icon}</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-cinzel)]">
                                    {selectedClass?.name}
                                </h3>
                                {selectedClass?.role && (
                                    <span className="text-xs px-2 py-1 bg-[#DC143C]/20 text-[#DC143C] rounded border border-[#DC143C]/50 font-[family-name:var(--font-cinzel)]">
                                        {selectedClass.role}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm font-[family-name:var(--font-lato)]">
                                {selectedClass?.description}
                            </p>
                        </div>
                    </div>

                    {/* Class Abilities */}
                    {selectedClass?.abilities && (
                        <div className="mt-4 bg-black/30 border border-[#ffb74d]/20 rounded-sm p-4">
                            <h4 className="text-sm font-bold text-[#ffb74d] mb-2 font-[family-name:var(--font-cinzel)]">
                                STARTING ABILITIES
                            </h4>
                            <ul className="space-y-1">
                                {selectedClass.abilities.map((ability, idx) => (
                                    <li key={idx} className="text-xs text-gray-300 font-[family-name:var(--font-lato)]">
                                        • {ability}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Stats with Modifiers */}
                <div>
                    <h3 className="text-xl font-bold text-[#ffb74d] mb-4 font-[family-name:var(--font-cinzel)]">
                        ABILITY SCORES
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(character.stats).map(([key, value]) => {
                            const modifier = getStatModifierString(value);
                            return (
                                <div key={key} className="bg-black/50 border border-[#ffb74d]/20 rounded p-3 text-center">
                                    <div className="text-xs text-gray-400 font-[family-name:var(--font-cinzel)]">
                                        {STAT_NAMES[key as keyof typeof STAT_NAMES].toUpperCase()}
                                    </div>
                                    <div className="text-3xl font-bold text-white mt-1">
                                        {value}
                                    </div>
                                    <div className={`text-sm font-bold font-[family-name:var(--font-cinzel)] ${modifier.startsWith('+') ? 'text-green-400' :
                                        modifier.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                                        }`}>
                                        {modifier}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 max-w-md mx-auto">
                <button
                    onClick={onBack}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 font-[family-name:var(--font-cinzel)]"
                >
                    [ BACK ]
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 bg-[#DC143C] hover:bg-[#B22222] text-white font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 shadow-[0_0_15px_rgba(220,20,60,0.5)] hover:shadow-[0_0_25px_rgba(220,20,60,0.8)] font-[family-name:var(--font-cinzel)]"
                >
                    [ CREATE CHARACTER ]
                </button>
            </div>
        </div>
    );
}
