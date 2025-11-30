
import React, { useState } from 'react';
import { InventoryItem } from '@/lib/game-data';

interface ActionDeckProps {
    inventory: InventoryItem[];
    onAction: (action: string) => void;
}

export default function ActionDeck({ inventory, onAction }: ActionDeckProps) {
    const [input, setInput] = useState('');
    const [usedResources, setUsedResources] = useState<string[]>([]);

    const toggleResource = (resource: string) => {
        setUsedResources(prev =>
            prev.includes(resource)
                ? prev.filter(r => r !== resource)
                : [...prev, resource]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onAction(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
            {/* Input Area */}
            <div className="bg-[#1e1f2e] border border-[#2e2f45] rounded-xl p-4 shadow-lg">
                <div className="mb-4 flex justify-between items-center">
                    <label className="text-sm text-zinc-400 font-medium font-[family-name:var(--font-cinzel)] tracking-wide">WHAT WILL YOU DO?</label>

                    {/* Turn Economy Trackers */}
                    <div className="flex gap-2">
                        {['Action', 'Bonus', 'Reaction'].map((type) => {
                            const isUsed = usedResources.includes(type);
                            return (
                                <button
                                    key={type}
                                    onClick={() => toggleResource(type)}
                                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${isUsed
                                        ? 'bg-zinc-900/30 border-zinc-800 text-zinc-600 line-through decoration-zinc-600/50'
                                        : 'bg-emerald-900/20 border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/40'
                                        }`}
                                >
                                    {type}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Text Input */}
                <div className="relative mb-4">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Describe your action..."
                        className="w-full bg-[#13141c] border border-[#2e2f45] rounded-lg p-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none h-20 text-sm"
                    />
                </div>

                <div className="flex items-end gap-4">
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-[#2a2b3d] hover:bg-[#3a3b5d] rounded text-[10px] font-bold text-zinc-300 tracking-wider uppercase transition-colors border border-white/5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Generate Image
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-[#2a2b3d] hover:bg-[#3a3b5d] rounded text-[10px] font-bold text-zinc-300 tracking-wider uppercase transition-colors border border-white/5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            Start Narrate
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-[#2a2b3d] hover:bg-[#3a3b5d] rounded text-[10px] font-bold text-zinc-300 tracking-wider uppercase transition-colors border border-white/5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            Save Character
                        </button>
                    </div>

                    {/* Submit Button (Arrow) */}
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim()}
                        className="ml-auto w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
