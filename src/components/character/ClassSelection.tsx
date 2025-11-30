"use client";

import { useState } from "react";
import { CLASSES, CharacterStats } from "@/lib/character-types";

interface ClassSelectionProps {
    onComplete: (className: string) => void;
    onBack: () => void;
    stats?: CharacterStats;
}

export default function ClassSelection({ onComplete, onBack, stats }: ClassSelectionProps) {
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [hoveredClass, setHoveredClass] = useState<string | null>(null);

    // Calculate class synergy based on stats
    const getClassSynergy = (classData: typeof CLASSES[0]): number => {
        if (!stats) return 0;

        const primaryStat = classData.recommendedBuild?.primary;
        const secondaryStat = classData.recommendedBuild?.secondary;

        let synergy = 0;
        if (primaryStat && stats[primaryStat as keyof CharacterStats]) {
            synergy += stats[primaryStat as keyof CharacterStats] * 2;
        }
        if (secondaryStat && stats[secondaryStat as keyof CharacterStats]) {
            synergy += stats[secondaryStat as keyof CharacterStats];
        }

        return synergy;
    };

    // Get recommended classes sorted by synergy
    const getRecommendedClasses = () => {
        if (!stats) return [];
        return [...CLASSES]
            .sort((a, b) => getClassSynergy(b) - getClassSynergy(a))
            .slice(0, 3)
            .map(c => c.id);
    };

    const recommendedClasses = getRecommendedClasses();

    const handleSelect = (classId: string) => {
        setSelectedClass(classId);
    };

    const handleContinue = () => {
        if (selectedClass) {
            onComplete(selectedClass);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Tank': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'DPS': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'Healer': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'Support': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-[#ffb74d] mb-4 font-[family-name:var(--font-cinzel)]">
                    CHOOSE YOUR CLASS
                </h1>
                <p className="text-gray-400 text-lg mb-4 italic font-[family-name:var(--font-lato)]">
                    "Your path determines your destiny"
                </p>
                {stats && recommendedClasses.length > 0 && (
                    <div className="inline-block bg-black/50 border border-[#ffb74d]/30 rounded-sm px-4 py-2">
                        <span className="text-xs text-gray-400 font-[family-name:var(--font-cinzel)]">
                            ✨ RECOMMENDED BASED ON YOUR STATS ✨
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
                {CLASSES.map((classOption) => {
                    const isRecommended = recommendedClasses.includes(classOption.id);
                    const isSelected = selectedClass === classOption.id;
                    const isHovered = hoveredClass === classOption.id;
                    const synergy = getClassSynergy(classOption);

                    return (
                        <button
                            key={classOption.id}
                            onClick={() => handleSelect(classOption.id)}
                            onMouseEnter={() => setHoveredClass(classOption.id)}
                            onMouseLeave={() => setHoveredClass(null)}
                            className={`bg-black/50 border-2 rounded-sm p-6 text-left transition-all hover:scale-105 relative overflow-hidden ${isSelected
                                    ? 'border-[#ffb74d] shadow-[0_0_20px_rgba(255,183,77,0.5)]'
                                    : isRecommended
                                        ? 'border-green-400/50 hover:border-green-400'
                                        : 'border-[#ffb74d]/30 hover:border-[#ffb74d]/60'
                                }`}
                        >
                            {/* Recommended Badge */}
                            {isRecommended && (
                                <div className="absolute top-2 right-2">
                                    <div className="bg-green-400/20 text-green-400 text-xs px-2 py-1 rounded border border-green-400/50 font-[family-name:var(--font-cinzel)]">
                                        ⭐ RECOMMENDED
                                    </div>
                                </div>
                            )}

                            {/* Class Icon & Name */}
                            <div className="text-5xl mb-3">{classOption.icon}</div>
                            <h3 className="text-2xl font-bold text-[#ffb74d] mb-2 font-[family-name:var(--font-cinzel)]">
                                {classOption.name.toUpperCase()}
                            </h3>

                            {/* Role Badge */}
                            <div className="mb-3">
                                <span className={`text-xs px-2 py-1 rounded border font-[family-name:var(--font-cinzel)] ${getRoleBadgeColor(classOption.role)}`}>
                                    {classOption.role}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-400 mb-4 font-[family-name:var(--font-lato)]">
                                {classOption.description}
                            </p>

                            {/* Abilities Preview - Show on hover or selection */}
                            {(isHovered || isSelected) && classOption.abilities && (
                                <div className="mb-4 animate-[fadeIn_0.3s_ease-out]">
                                    <p className="text-xs text-[#ffb74d] mb-2 font-[family-name:var(--font-cinzel)]">CORE ABILITIES:</p>
                                    <ul className="space-y-1">
                                        {classOption.abilities.map((ability, idx) => (
                                            <li key={idx} className="text-xs text-gray-300 font-[family-name:var(--font-lato)]">
                                                • {ability}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Primary Stats */}
                            <div className="flex gap-2 flex-wrap">
                                {classOption.primaryStats.map((stat) => (
                                    <span
                                        key={stat}
                                        className="text-xs bg-[#DC143C]/20 text-[#DC143C] px-2 py-1 rounded border border-[#DC143C]/50 font-[family-name:var(--font-cinzel)]"
                                    >
                                        {stat}
                                    </span>
                                ))}
                            </div>

                            {/* Stat Synergy Indicator */}
                            {stats && synergy > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400 font-[family-name:var(--font-cinzel)]">Stat Fit:</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`w-2 h-2 rounded-full ${i <= Math.min(5, Math.floor(synergy / 6))
                                                            ? 'bg-green-400'
                                                            : 'bg-gray-600'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
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
                    disabled={!selectedClass}
                    className="flex-1 bg-[#DC143C] hover:bg-[#B22222] disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_15px_rgba(220,20,60,0.5)] hover:shadow-[0_0_25px_rgba(220,20,60,0.8)] font-[family-name:var(--font-cinzel)]"
                >
                    [ CONTINUE ]
                </button>
            </div>
        </div>
    );
}
