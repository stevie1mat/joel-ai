"use client";

import { useState } from "react";
import { CharacterStats, STAT_NAMES, STAT_DESCRIPTIONS, POINT_BUY_TOTAL, STAT_MIN, STAT_MAX, getStatModifierString, STAT_PRESETS } from "@/lib/character-types";

interface StatsStepProps {
    initialStats: CharacterStats;
    onComplete: (stats: CharacterStats) => void;
    onBack: () => void;
}

export default function StatsStep({ initialStats, onComplete, onBack }: StatsStepProps) {
    const [stats, setStats] = useState<CharacterStats>(initialStats);
    const [animatingStats, setAnimatingStats] = useState<Set<keyof CharacterStats>>(new Set());

    const pointsUsed = Object.values(stats).reduce((sum, val) => sum + (val - 8), 0);
    const pointsRemaining = POINT_BUY_TOTAL - pointsUsed;

    const updateStat = (stat: keyof CharacterStats, value: number, animate = false) => {
        setStats({ ...stats, [stat]: value });
        if (animate) {
            setAnimatingStats(prev => new Set(prev).add(stat));
            setTimeout(() => {
                setAnimatingStats(prev => {
                    const next = new Set(prev);
                    next.delete(stat);
                    return next;
                });
            }, 300);
        }
    };

    const increment = (stat: keyof CharacterStats) => {
        if (stats[stat] < STAT_MAX && pointsRemaining > 0) {
            updateStat(stat, stats[stat] + 1, true);
        }
    };

    const decrement = (stat: keyof CharacterStats) => {
        if (stats[stat] > STAT_MIN) {
            updateStat(stat, stats[stat] - 1, true);
        }
    };

    const applyPreset = (presetKey: string) => {
        const preset = STAT_PRESETS[presetKey];
        if (preset) {
            setStats(preset.stats);
        }
    };

    const handleContinue = () => {
        if (pointsRemaining === 0) {
            onComplete(stats);
        }
    };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-[#ffb74d] mb-4 font-[family-name:var(--font-cinzel)]">
                    ALLOCATE YOUR STATS
                </h1>
                <p className="text-gray-400 text-lg mb-4 italic font-[family-name:var(--font-lato)]">
                    "Choose wisely, for these abilities will define your journey"
                </p>

                {/* Points Display */}
                <div className="inline-block bg-black/80 border-2 border-[#ffb74d] rounded px-6 py-3 mb-6">
                    <span className="text-gray-400 text-sm font-[family-name:var(--font-cinzel)]">POINTS REMAINING: </span>
                    <span className={`text-3xl font-bold font-[family-name:var(--font-cinzel)] transition-colors ${pointsRemaining === 0 ? 'text-green-400' : 'text-[#ffb74d]'
                        }`}>
                        {pointsRemaining}
                    </span>
                    <span className="text-gray-400 text-sm"> / {POINT_BUY_TOTAL}</span>
                </div>

                {/* Quick Presets */}
                <div className="max-w-3xl mx-auto mb-6">
                    <p className="text-xs text-gray-500 mb-2 font-[family-name:var(--font-cinzel)]">QUICK PRESETS</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {Object.entries(STAT_PRESETS).map(([key, preset]) => (
                            <button
                                key={key}
                                onClick={() => applyPreset(key)}
                                className="bg-black/30 hover:bg-black/50 border border-[#ffb74d]/20 hover:border-[#ffb74d]/50 text-[#ffb74d] px-3 py-1.5 rounded-sm text-xs font-[family-name:var(--font-cinzel)] transition-all hover:scale-105"
                                title={preset.description}
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-black/30 border border-[#ffb74d]/20 rounded-sm h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#DC143C] to-[#ffb74d] transition-all duration-300"
                        style={{ width: `${(pointsUsed / POINT_BUY_TOTAL) * 100}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
                {(Object.keys(STAT_NAMES) as Array<keyof CharacterStats>).map((stat) => {
                    const modifier = getStatModifierString(stats[stat]);
                    const isAnimating = animatingStats.has(stat);

                    return (
                        <div
                            key={stat}
                            className={`bg-black/50 border border-[#ffb74d]/30 rounded-sm p-6 transition-all ${isAnimating ? 'scale-105 border-[#ffb74d] shadow-[0_0_20px_rgba(255,183,77,0.3)]' : ''
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-[#ffb74d] font-[family-name:var(--font-cinzel)]">
                                        {STAT_NAMES[stat].toUpperCase()}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-[family-name:var(--font-lato)]">
                                        {STAT_DESCRIPTIONS[stat]}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className={`text-4xl font-bold text-white transition-transform ${isAnimating ? 'scale-110' : ''
                                        }`}>
                                        {stats[stat]}
                                    </div>
                                    <div className={`text-sm font-bold font-[family-name:var(--font-cinzel)] ${modifier.startsWith('+') ? 'text-green-400' :
                                            modifier.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                                        }`}>
                                        {modifier}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => decrement(stat)}
                                    disabled={stats[stat] <= STAT_MIN}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-2 rounded transition-all disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                                >
                                    −
                                </button>
                                <button
                                    onClick={() => increment(stat)}
                                    disabled={stats[stat] >= STAT_MAX || pointsRemaining === 0}
                                    className="flex-1 bg-[#DC143C] hover:bg-[#B22222] disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-2 rounded transition-all disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                                >
                                    +
                                </button>
                            </div>
                        </div>
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
                    disabled={pointsRemaining !== 0}
                    className="flex-1 bg-[#DC143C] hover:bg-[#B22222] disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_15px_rgba(220,20,60,0.5)] hover:shadow-[0_0_25px_rgba(220,20,60,0.8)] font-[family-name:var(--font-cinzel)]"
                >
                    [ CONTINUE ]
                </button>
            </div>
        </div>
    );
}
