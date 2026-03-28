
import React, { useState } from 'react';
import { InventoryItem } from '@/lib/game-data';
import DiceRoller from './DiceRoller';

interface ActionDeckProps {
    inventory: InventoryItem[];
    onAction: (action: string) => void;
}

export default function ActionDeck({ inventory, onAction }: ActionDeckProps) {
    const [input, setInput] = useState('');
    const [rolling, setRolling] = useState(false);
    const [pendingAction, setPendingAction] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            setPendingAction(input);
            setRolling(true);
        }
    };

    const handleRollComplete = (result: number) => {
        setRolling(false);
        if (pendingAction) {
            // Append roll result to action for flavor (optional, or just send action)
            onAction(`${pendingAction} [Rolled: ${result}]`);
            setInput('');
            setPendingAction(null);
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
                        placeholder="What do you do?"
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#ffb74d]/50 focus:ring-1 focus:ring-[#ffb74d]/50 resize-none h-20 text-base pr-12 transition-all"
                    />

                    {/* Submit Button (Arrow) - Positioned inside textarea area */}
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim()}
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#ffb74d] hover:bg-[#ffb74d]/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-black transition-colors shadow-lg shadow-[#ffb74d]/20"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>
            </div>

            <DiceRoller rolling={rolling} onComplete={handleRollComplete} />
        </div>
    );
}
