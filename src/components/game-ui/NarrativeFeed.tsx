
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
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {items.map((item) => (
                    <div key={item.id} className="animate-fadeIn max-w-4xl mx-auto w-full">
                        {/* ── Player Action Bubble ── */}
                        {item.role === 'user' ? (
                            <div className="flex justify-end">
                                <div className="max-w-[80%] px-4 py-3 rounded-xl rounded-br-sm bg-[#ffb74d]/10 border border-[#ffb74d]/30 shadow-lg">
                                    <p className="font-[family-name:var(--font-lato)] text-sm text-[#ffb74d] leading-relaxed italic">
                                        {item.content}
                                    </p>
                                    <span className="block text-right text-[10px] text-[#ffb74d]/40 mt-1 tracking-wider">
                                        You · {item.timestamp}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            /* ── DM Narration Block ── */
                            <div className="space-y-4">
                                {/* Inline Image (Items/Events) */}
                                {item.imageId && (
                                    <div className="mb-4 rounded-lg overflow-hidden border border-[#ffb74d]/30 shadow-2xl max-w-sm mx-auto">
                                        <img
                                            src={getVisualAsset(item.imageId)}
                                            alt="Item/Event"
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                )}

                                {/* Text Content */}
                                <div className="space-y-4">
                                    <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/5 shadow-lg">
                                        <p className="font-[family-name:var(--font-lato)] text-lg leading-relaxed text-zinc-100">
                                            {item.content}
                                        </p>

                                        {/* System Result */}
                                        {item.result && (
                                            <div className="mt-2 inline-block px-3 py-1 bg-[#ffb74d]/10 rounded border border-[#ffb74d]/20 text-xs font-mono text-[#ffb74d]">
                                                {item.result}
                                            </div>
                                        )}
                                    </div>

                                    {/* Choices Grid */}
                                    {item.choices && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            {item.choices.map((choice) => (
                                                <button
                                                    key={choice.id}
                                                    onClick={() => onAction(choice.title)}
                                                    className="group relative overflow-hidden bg-black/60 border border-white/10 hover:border-[#ffb74d]/50 rounded-lg p-6 text-left transition-all hover:bg-black/80 hover:scale-[1.02]"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] font-bold text-[#ffb74d] tracking-widest">{choice.title}</span>
                                                        <svg className="w-3 h-3 text-[#ffb74d] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-sm text-zinc-300 leading-relaxed font-medium font-[family-name:var(--font-lato)]">
                                                        {choice.description}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Processing Indicator */}
                {isProcessing && (
                    <div className="flex items-center justify-center gap-3 text-[#ffb74d]/50 animate-pulse py-4">
                        <div className="w-2 h-2 rounded-full bg-[#ffb74d] animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-[#ffb74d] animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 rounded-full bg-[#ffb74d] animate-bounce [animation-delay:0.4s]" />
                    </div>
                )}
            </div>
        </div>
    );
}
