
import React, { useState } from 'react';
import { CharacterState } from '@/lib/game-data';
import { getVisualAsset } from '@/lib/visual-canon';
import { mockInventory } from '@/lib/game-data';
import { supabase } from '@/lib/supabase';

interface LedgerPanelProps {
    character: CharacterState;
    characterId?: string;
    characterClass?: string;
    allegiance?: string;
}

const STAT_LABELS: Record<string, string> = {
    strength: 'STR',
    dexterity: 'DEX',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom: 'WIS',
    charisma: 'CHA',
};

function modifier(val: number) {
    const mod = Math.floor((val - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function LedgerPanel({ character, characterId, characterClass, allegiance }: LedgerPanelProps) {
    const [activeTab, setActiveTab] = useState<'character' | 'stats' | 'inventory'>('character');
    const [portraitSrc, setPortraitSrc] = useState<string | undefined>(
        character.portraitId?.startsWith('http')
            ? character.portraitId
            : character.portraitId
                ? getVisualAsset(character.portraitId)
                : undefined
    );
    const [generating, setGenerating] = useState(false);
    const [saved, setSaved] = useState(false);
    const [genError, setGenError] = useState<string | null>(null);

    const handleRegenerate = async () => {
        if (!characterId) return;
        setGenerating(true);
        setSaved(false);
        setGenError(null);

        try {
            const res = await fetch('/api/generate-portrait', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterId,
                    name: character.name,
                    characterClass: characterClass || character.class,
                    race: character.race,
                    allegiance,
                }),
            });

            const data = await res.json();

            if (data.error) {
                setGenError(data.error);
            } else {
                setPortraitSrc(data.imageUrl);

                // Save to Supabase using the client-side session
                const { error: saveError } = await supabase
                    .from('characters')
                    .update({ avatar_url: data.imageUrl })
                    .eq('id', characterId);

                if (saveError) {
                    console.error('Failed to save to Supabase:', saveError);
                    setGenError('Image generated but failed to save to database. Check RLS policies.');
                } else {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 3000);
                }
            }
        } catch (err: any) {
            setGenError('Connection failed');
        } finally {
            setGenerating(false);
        }
    };

    const tabs = [
        { id: 'character', label: 'Hero', icon: '⚔' },
        { id: 'stats', label: 'Stats', icon: '⚛' },
        { id: 'inventory', label: 'Gear', icon: '📦' },
    ] as const;

    return (
        <div className="h-full bg-[#0f1018]/98 flex flex-col font-sans">
            {/* Tab Bar */}
            <div className="flex border-b border-white/10 shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 text-[13px] font-bold tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                            activeTab === tab.id
                                ? 'bg-[#ffb74d]/15 text-[#ffb74d] border-b-2 border-[#ffb74d] shadow-[inset_0_-8px_12px_rgba(255,183,77,0.05)]'
                                : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/5'
                        }`}
                    >
                        <span className="text-base opacity-70">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">

                {/* ── HERO TAB ── */}
                {activeTab === 'character' && (
                    <div className="space-y-3 p-4">
                        {/* Portrait Card */}
                        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-white/10 group">
                            {portraitSrc ? (
                                <img
                                    src={portraitSrc}
                                    alt={character.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#13141c]">
                                    <span className="text-5xl opacity-20">⚔</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                            {/* Regenerate button — appears on hover */}
                            <div className="absolute top-3 right-3 z-10">
                                <button
                                    onClick={handleRegenerate}
                                    disabled={generating || !characterId}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all
                                        ${generating
                                            ? 'bg-black/70 text-[#ffb74d]/50 cursor-not-allowed'
                                            : saved
                                                ? 'bg-emerald-900/80 text-emerald-400 border border-emerald-500/40'
                                                : 'bg-black/70 text-[#ffb74d] border border-[#ffb74d]/30 hover:bg-[#ffb74d]/10 hover:border-[#ffb74d]/60'
                                        }
                                        backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                                    title="Regenerate portrait with AI"
                                >
                                    {generating ? (
                                        <>
                                            <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Generating...
                                        </>
                                    ) : saved ? (
                                        <>✓ Saved</>
                                    ) : (
                                        <>✦ Regenerate</>
                                    )}
                                </button>
                            </div>

                            {/* Generating overlay */}
                            {generating && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 rounded-full border border-[#ffb74d]/20 animate-ping" style={{ animationDuration: '2s' }} />
                                        <div className="absolute inset-0 rounded-full border border-[#ffb74d]/40 animate-spin" style={{ animationDuration: '3s' }} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl text-[#ffb74d]/70">✦</span>
                                        </div>
                                    </div>
                                    <p className="text-[#ffb74d] text-xs font-bold tracking-widest uppercase font-[family-name:var(--font-cinzel)]">
                                        Summoning Likeness...
                                    </p>
                                    <p className="text-zinc-500 text-[10px] mt-1 italic">This may take a moment</p>
                                </div>
                            )}

                            {/* Error message */}
                            {genError && (
                                <div className="absolute bottom-20 left-3 right-3 z-10 bg-red-900/80 text-red-300 text-[10px] px-3 py-2 rounded-lg border border-red-500/30 backdrop-blur-sm">
                                    {genError}
                                </div>
                            )}

                            {/* Name / class overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <h2 className="text-2xl font-bold text-white mb-1 font-[family-name:var(--font-cinzel)]">
                                    {character.name.split(' ')[0]}
                                </h2>
                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#ffb74d] uppercase mb-4">
                                    <span>{character.race}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                    <span>{character.class}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {[
                                        { label: 'Lvl', value: character.level },
                                        { label: 'AC', value: character.ac },
                                        { label: '♥', value: character.hp.current },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded flex items-center gap-1.5 border border-white/10">
                                            <span className="text-[9px] font-bold text-zinc-400 uppercase">{label}</span>
                                            <span className="text-xs font-bold text-white">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* XP */}
                        <div className="bg-[#13141c] p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Experience</span>
                                <span className="text-[10px] text-zinc-500">0 / 300 XP</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[0%] rounded-full" />
                            </div>
                        </div>

                        {/* Background */}
                        <div className="bg-[#13141c] p-4 rounded-xl border border-white/5">
                            <p className="text-xs font-bold text-[#ffb74d]/60 tracking-widest uppercase mb-1">Background</p>
                            <p className="text-xs text-zinc-300">{character.background}</p>
                        </div>
                    </div>
                )}

                {/* ── STATS TAB ── */}
                {activeTab === 'stats' && (
                    <div className="p-4 space-y-4">
                        <p className="text-xs font-bold text-[#ffb74d]/60 tracking-widest uppercase">Core Attributes</p>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(STAT_LABELS).map(([key, abbr]) => {
                                const val = (character.stats as any)?.[key] ?? 10;
                                const mod = modifier(val);
                                return (
                                    <div key={key} className="bg-[#13141c] rounded-xl border border-white/5 p-3 flex flex-col items-center gap-1">
                                        <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">{abbr}</span>
                                        <span className="text-2xl font-bold text-white font-[family-name:var(--font-cinzel)]">{val}</span>
                                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${parseInt(mod) >= 0 ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                                            {mod}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="text-xs font-bold text-[#ffb74d]/60 tracking-widest uppercase pt-2">Combat</p>
                        <div className="space-y-2">
                            {[
                                { label: 'Armor Class', value: character.ac, icon: '🛡' },
                                { label: 'Hit Points', value: `${character.hp.current} / ${character.hp.max}`, icon: '♥' },
                                { label: 'Speed', value: `${character.speed} ft`, icon: '⚡' },
                                { label: 'Initiative', value: modifier((character.stats as any)?.dexterity ?? 10), icon: '⚔' },
                            ].map(({ label, value, icon }) => (
                                <div key={label} className="bg-[#13141c] rounded-lg border border-white/5 px-4 py-2.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">{icon}</span>
                                        <span className="text-sm text-zinc-400">{label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">{value}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs font-bold text-[#ffb74d]/60 tracking-widest uppercase pt-2">
                            Skills <span className="text-zinc-600 normal-case tracking-normal font-normal">(coming soon)</span>
                        </p>
                        <div className="space-y-1.5">
                            {['Stealth', 'Perception', 'Persuasion', 'Athletics', 'Deception'].map((skill) => (
                                <div key={skill} className="flex items-center justify-between opacity-40">
                                    <span className="text-xs text-zinc-400">{skill}</span>
                                    <div className="w-24 h-1 bg-zinc-800 rounded-full">
                                        <div className="h-full bg-[#ffb74d]/30 rounded-full" style={{ width: `${Math.random() * 60 + 10}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── GEAR TAB ── */}
                {activeTab === 'inventory' && (
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-[#ffb74d]/60 tracking-widest uppercase">Carried Items</p>
                            <span className="text-xs text-zinc-600">{mockInventory.length} / 20 slots</span>
                        </div>

                        <div className="bg-[#13141c] rounded-lg border border-white/5 px-3 py-2">
                            <div className="flex justify-between mb-1.5">
                                <span className="text-[11px] text-zinc-500 uppercase tracking-wider">Encumbrance</span>
                                <span className="text-[11px] text-zinc-500">12 / 75 lbs</span>
                            </div>
                            <div className="h-1 bg-zinc-800 rounded-full">
                                <div className="h-full bg-[#ffb74d]/50 rounded-full w-[16%]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {mockInventory.map((item) => {
                                const rarityColor: Record<string, string> = {
                                    common: 'text-zinc-400',
                                    uncommon: 'text-emerald-400',
                                    rare: 'text-blue-400',
                                    epic: 'text-purple-400',
                                    legendary: 'text-[#ffb74d]',
                                };
                                return (
                                    <div key={item.id} className="bg-[#13141c] rounded-xl border border-white/5 p-3 flex gap-3 items-center hover:border-white/10 transition-colors">
                                        <div className="w-10 h-10 bg-zinc-800/80 rounded-lg flex items-center justify-center text-lg shrink-0 border border-white/5">
                                            {item.type === 'weapon' || item.type === 'Weapon' ? '⚔' : item.type === 'armor' || item.type === 'Armor' ? '🛡' : item.type === 'consumable' || item.type === 'Potion' ? '🧪' : '📦'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-zinc-200 truncate">{item.name}</div>
                                            <div className={`text-xs uppercase tracking-wider font-bold ${rarityColor[item.rarity] || 'text-zinc-500'}`}>
                                                {item.rarity} · {item.type}
                                            </div>
                                        </div>
                                        <div className="text-xs text-zinc-600 shrink-0">×1</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-[#13141c] rounded-xl border border-[#ffb74d]/10 px-4 py-3 flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🪙</span>
                                <span className="text-sm font-bold text-zinc-400">Gold Coins</span>
                            </div>
                            <span className="text-base font-bold text-[#ffb74d]">150</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
