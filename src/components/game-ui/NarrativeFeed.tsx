
import React from 'react';
import { NarrativeItem } from '@/lib/game-data';
import { getVisualAsset } from '@/lib/visual-canon';

interface NarrativeFeedProps {
    items: NarrativeItem[];
    isProcessing?: boolean;
    onAction: (action: string) => void;
}

export default function NarrativeFeed({ items, isProcessing = false, onAction }: NarrativeFeedProps) {
    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Bot Header Removed */}

                {items.map((item) => (
                    <div key={item.id} className="animate-fadeIn max-w-4xl">
                        {/* Main Content Block */}
                        <div className="space-y-4">
                            {/* Inline Image (Items/Events) */}
                            {item.imageId && (
                                <div className="mb-4 rounded-lg overflow-hidden border border-white/10 shadow-2xl max-w-sm">
                                    <img
                                        src={getVisualAsset(item.imageId)}
                                        alt="Item/Event"
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                            )}

                            {/* Text Content */}
                            <div className="space-y-4">
                                <p className="font-sans text-lg leading-relaxed text-zinc-100">
                                    {item.content}
                                </p>

                                {/* System Result */}
                                {item.result && (
                                    <div className="inline-block px-3 py-1 bg-white/5 rounded border border-white/10 text-xs font-mono text-indigo-300">
                                        {item.result}
                                    </div>
                                )}

                                {/* Choices Grid */}
                                {item.choices && (
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        {item.choices.map((choice) => (
                                            <button
                                                key={choice.id}
                                                onClick={() => onAction(choice.title)}
                                                className="group relative overflow-hidden bg-[#1e1f2e] border border-[#2e2f45] hover:border-[#4e5075] rounded-lg p-6 text-left transition-all hover:bg-[#25263a]"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-bold text-[#818cf8] tracking-widest uppercase">{choice.title}</span>
                                                    <svg className="w-3 h-3 text-[#818cf8] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                                                    {choice.description}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Processing Indicator */}
                {isProcessing && (
                    <div className="flex items-center gap-3 text-indigo-400/50 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                )}
            </div>
        </div>
    );
}
