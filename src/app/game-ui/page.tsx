
'use client';

import React, { useState } from 'react';
import GameHeader from '@/components/game-ui/GameHeader';
import LedgerPanel from '@/components/game-ui/LedgerPanel';
import NarrativeFeed from '@/components/game-ui/NarrativeFeed';
import ActionDeck from '@/components/game-ui/ActionDeck';
import { mockCharacter, mockInventory, NarrativeItem } from '@/lib/game-data';

import VisualStage from '@/components/game-ui/VisualStage';
import { getVisualAsset } from '@/lib/visual-canon';

export default function GameUIPage() {
    const [narrative, setNarrative] = useState<NarrativeItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Derive the active visual from the latest narrative item that has one
    // Derive the active visual from the latest narrative item that has one (excluding items/events which stay inline)
    const activeVisualItem = [...narrative].reverse().find(item => item.imageUrl || item.portraitId);
    const activeVisualSrc = activeVisualItem
        ? (activeVisualItem.imageUrl || getVisualAsset(activeVisualItem.portraitId))
        : undefined;

    // Determine caption based on what kind of image it is
    const activeCaption = activeVisualItem?.portraitId ? "NPC Encounter"
        : activeVisualItem?.imageUrl ? "Environment"
            : undefined;

    const handleAction = async (action: string) => {
        setIsProcessing(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            });

            const data = await response.json();

            if (data.error) {
                console.error('AI Error:', data.error);
                // Fallback or error message
                return;
            }

            const newItem: NarrativeItem = {
                id: Date.now().toString(),
                type: 'narrative',
                content: data.response, // AI generated content
                result: 'AI DM Response', // We can parse this later if needed
                isVerified: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setNarrative(prev => [...prev, newItem]);

        } catch (error) {
            console.error('Failed to fetch AI response:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#13141c] flex flex-col overflow-hidden">
            <GameHeader />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Ledger */}
                <div className="w-[320px] flex-shrink-0">
                    <LedgerPanel character={mockCharacter} />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex relative bg-gradient-to-br from-[#1a1b26] to-[#13141c]">
                    {/* Left Column: Text Terminal */}
                    <div className="flex-1 flex flex-col relative border-r border-white/10">
                        {/* Chapter Header */}
                        <div className="px-8 py-4 border-b border-white/5 bg-[#1a1b26]/50 backdrop-blur-sm">
                            <h1 className="text-xl font-bold text-white font-[family-name:var(--font-cinzel)]">End of the World</h1>
                        </div>

                        {/* Narrative Feed (Scrollable Text Terminal) */}
                        <div className="flex-1 overflow-y-auto">
                            <NarrativeFeed items={narrative} isProcessing={isProcessing} onAction={handleAction} />
                        </div>

                        {/* Action Deck (Fixed Bottom) */}
                        <div className="p-8 pb-12 bg-gradient-to-t from-[#13141c] to-transparent">
                            <ActionDeck inventory={mockInventory} onAction={handleAction} />
                        </div>
                    </div>

                    {/* Right Column: Visual Stage */}
                    <div className="w-[40%] relative">
                        <VisualStage imageSrc={activeVisualSrc} caption={activeCaption} />
                    </div>
                </div>
            </div>
        </div>
    );
}
