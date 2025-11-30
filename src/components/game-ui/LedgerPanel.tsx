
import React, { useState } from 'react';
import { CharacterState } from '@/lib/game-data';
import { getVisualAsset } from '@/lib/visual-canon';

interface LedgerPanelProps {
    character: CharacterState;
}

export default function LedgerPanel({ character }: LedgerPanelProps) {
    const [activeTab, setActiveTab] = useState<'character' | 'campaign'>('character');

    return (
        <div className="h-full bg-[#1a1b26]/95 border-r border-white/10 flex flex-col font-sans">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('character')}
                    className={`flex-1 py-4 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'character'
                        ? 'bg-white text-black'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                        }`}
                >
                    My Character
                </button>
                <button
                    onClick={() => setActiveTab('campaign')}
                    className={`flex-1 py-4 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'campaign'
                        ? 'bg-white text-black'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                        }`}
                >
                    Campaign Info
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto">
                {activeTab === 'character' && (
                    <div className="space-y-4">
                        {/* Character Card */}
                        <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden border border-white/10 group">
                            {/* Image */}
                            <img
                                src={character.portraitId ? getVisualAsset(character.portraitId) : "https://placehold.co/400x600/1a1a1a/ffb74d?text=Character"}
                                alt={character.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h2 className="text-3xl font-bold text-white mb-1 font-[family-name:var(--font-cinzel)]">{character.name.split(' ')[0]}</h2>
                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-amber-500 uppercase mb-4">
                                    <span>{character.race}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-500" />
                                    <span>{character.class}</span>
                                </div>

                                {/* Stats Row */}
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded flex items-center gap-2 border border-white/10">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lvl</span>
                                        <span className="text-sm font-bold text-white">{character.level}</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded flex items-center gap-2 border border-white/10">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">AC</span>
                                        <span className="text-sm font-bold text-white">{character.ac}</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded flex items-center gap-2 border border-white/10">
                                        <span className="text-xs text-red-400">♥</span>
                                        <span className="text-sm font-bold text-white">{character.hp.current}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* XP Bar */}
                        <div className="bg-[#13141c] p-4 rounded-lg border border-white/5">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase">XP: 0 / 300</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[0%]" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'campaign' && (
                    <div className="text-center py-12 text-zinc-500 text-xs tracking-widest uppercase">
                        No Campaign Data
                    </div>
                )}
            </div>
        </div>
    );
}
