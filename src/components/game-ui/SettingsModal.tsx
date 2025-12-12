
import React from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-[#1a1b26] border border-white/10 rounded-lg shadow-2xl p-6 font-sans relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-bold text-white mb-6 font-[family-name:var(--font-cinzel)] text-center tracking-widest border-b border-white/10 pb-4">
                    GAME SETTINGS
                </h2>

                <div className="space-y-6">
                    {/* Audio */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Master Volume</label>
                        <input type="range" className="w-full accent-[#ffb74d]" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ambience</label>
                        <input type="range" className="w-full accent-[#ffb74d]" defaultValue="80" />
                    </div>

                    {/* Text Speed */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Text Speed</label>
                        <div className="flex justify-between gap-2 text-xs text-zinc-500">
                            <span>Slow</span>
                            <span>Fast</span>
                        </div>
                        <input type="range" className="w-full accent-[#ffb74d]" defaultValue="100" />
                    </div>

                    {/* Graphics */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-300">High Quality Visuals</span>
                        <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-[#ffb74d]/10 border border-[#ffb74d] text-[#ffb74d] rounded hover:bg-[#ffb74d]/20 transition-colors font-bold tracking-widest uppercase text-xs"
                    >
                        Save & Close
                    </button>
                </div>
            </div>
        </div>
    );
}
