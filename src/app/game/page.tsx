
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameHeader from '@/components/game-ui/GameHeader';
import LedgerPanel from '@/components/game-ui/LedgerPanel';
import NarrativeFeed from '@/components/game-ui/NarrativeFeed';
import ActionDeck from '@/components/game-ui/ActionDeck';
import { mockInventory, NarrativeItem } from '@/lib/game-data';
import { supabase } from '@/lib/supabase';
import { Character } from '@/lib/character-types';

import VisualStage from '@/components/game-ui/VisualStage';
import { getVisualAsset } from '@/lib/visual-canon';

export default function GameUIPage() {
    const router = useRouter();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [narrative, setNarrative] = useState<NarrativeItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Load character data on mount
    useEffect(() => {
        const loadCharacter = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/login');
                    return;
                }

                // Get the most recent character for this user
                const { data, error } = await supabase
                    .from('characters')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error) {
                    console.error('Error loading character:', error);
                    router.push('/character-creation');
                    return;
                }

                if (data) {
                    // Transform database format to Character interface
                    const char: Character = {
                        id: data.id,
                        user_id: data.user_id,
                        name: data.name,
                        class: data.class,
                        level: data.level,
                        allegiance: data.allegiance,
                        avatar_url: data.avatar_url,
                        stats: {
                            strength: data.strength,
                            dexterity: data.dexterity,
                            constitution: data.constitution,
                            intelligence: data.intelligence,
                            wisdom: data.wisdom,
                            charisma: data.charisma
                        }
                    };
                    setCharacter(char);
                }
            } catch (err) {
                console.error('Failed to load character:', err);
                router.push('/character-creation');
            } finally {
                setLoading(false);
            }
        };

        loadCharacter();
    }, [router]);

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

            // Generate scene image if we have an image prompt
            let imageUrl = undefined;
            if (data.imagePrompt) {
                const scenePrompt = `${data.imagePrompt}, dark fantasy Chronicles of Arn, cinematic lighting with amber glow, dramatic atmosphere, detailed digital art, painterly style`;
                imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(scenePrompt)}`;
            }

            const newItem: NarrativeItem = {
                id: Date.now().toString(),
                type: 'narrative',
                content: data.response, // AI generated content
                result: 'AI DM Response', // We can parse this later if needed
                isVerified: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                imageUrl: imageUrl // Add generated scene image
            };

            setNarrative(prev => [...prev, newItem]);

        } catch (error) {
            console.error('Failed to fetch AI response:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-screen bg-[#13141c] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">⚔️</div>
                    <h2 className="text-2xl font-bold text-[#ffb74d] font-[family-name:var(--font-cinzel)]">
                        LOADING YOUR ADVENTURE...
                    </h2>
                </div>
            </div>
        );
    }

    if (!character) {
        return null; // Will redirect
    }

    // Adapt character to game UI format
    const gameCharacter = {
        name: character.name,
        race: character.allegiance || 'Wanderer', // Use faction as race for now
        class: character.class,
        level: character.level,
        hp: {
            current: 10 + Math.floor((character.stats.constitution - 10) / 2),
            max: 10 + Math.floor((character.stats.constitution - 10) / 2),
            temp: 0
        },
        ac: 10 + Math.floor((character.stats.dexterity - 10) / 2),
        speed: 30,
        portraitId: character.avatar_url || undefined,
        background: character.allegiance || 'Free Adventurer',
        stats: character.stats,
        attributes: [],
        conditions: [],
        resources: []
    };

    return (
        <div className="h-screen w-screen bg-[#13141c] flex flex-col overflow-hidden">
            <GameHeader />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Ledger */}
                <div className="w-[320px] flex-shrink-0">
                    <LedgerPanel character={gameCharacter} />
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
