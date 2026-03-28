
import React, { useState } from 'react';
import { InventoryItem } from '@/lib/game-data';
import DiceRoller from './DiceRoller';

interface ActionDeckProps {
    inventory: InventoryItem[];
    onAction: (action: string) => void;
    rolling: boolean;
    onRollStart: (actionText: string) => void;
}

export default function ActionDeck({ inventory, onAction, rolling, onRollStart }: ActionDeckProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !rolling) {
            onRollStart(input);
            setInput('');
        }
    };

    const handleItemClick = (itemName: string) => {
        if (rolling) return;
        const useText = `I use the ${itemName}. `;
        setInput(prev => {
            const trimmed = prev.trim();
            if (!trimmed) return useText;
            return `${trimmed}\n${useText}`;
        });
    };

    const rarityColor: Record<string, string> = {
        common: 'border-zinc-700 text-zinc-400 bg-zinc-900/40',
        uncommon: 'border-emerald-900/50 text-emerald-400 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
        rare: 'border-blue-900/50 text-blue-400 bg-blue-950/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
        'very rare': 'border-purple-900/50 text-purple-400 bg-purple-950/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]',
        legendary: 'border-[#ffb74d]/30 text-[#ffb74d] bg-[#ffb74d]/5 shadow-[0_0_15px_rgba(255,183,77,0.15)]',
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-5xl mx-auto">
            {/* Quick Item Ribbon */}
            {inventory.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest shrink-0 mr-1">
                        Pouch:
                    </span>
                    {inventory.map((item, idx) => {
                        const rarity = (item.rarity || 'common').toLowerCase();
                        return (
                            <button
                                key={`${item.id}-${idx}`}
                                onClick={() => handleItemClick(item.name)}
                                disabled={rolling}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold whitespace-nowrap transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                    ${rarityColor[rarity] || rarityColor.common}
                                `}
                            >
                                <span className="opacity-70 text-sm">
                                    {item.type === 'weapon' || item.type === 'Weapon' ? '⚔' : item.type === 'armor' || item.type === 'Armor' ? '🛡' : item.type === 'Potion' ? '🧪' : '📦'}
                                </span>
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Input Area */}
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl relative">
                {/* Text Input */}
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        disabled={rolling}
                        placeholder={rolling ? "Rolling dice..." : "What do you do?"}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ffb74d]/50 focus:ring-1 focus:ring-[#ffb74d]/50 resize-none h-20 text-base pr-12 transition-all disabled:opacity-50"
                    />

                    {/* Submit Button (Arrow) */}
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || rolling}
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#ffb74d] hover:bg-[#ffb74d]/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-black transition-colors shadow-lg shadow-[#ffb74d]/20"
                    >
                        {rolling ? (
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
