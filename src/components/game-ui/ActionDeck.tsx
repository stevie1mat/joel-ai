
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
            <div className="bg-[#1e1f2e] border border-[#2e2f45] rounded-xl p-4 shadow-lg">

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
                        className="w-full bg-[#13141c] border border-[#2e2f45] rounded-lg p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none h-20 text-sm pr-12"
                    />

                    {/* Submit Button (Arrow) - Positioned inside textarea area */}
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim()}
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shadow-lg shadow-indigo-500/20"
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
