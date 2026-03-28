
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

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
            {/* Input Area */}
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl">

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

                    {/* Submit Button (Arrow) - Positioned inside textarea area */}
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
