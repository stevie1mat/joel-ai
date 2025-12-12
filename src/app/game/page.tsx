
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import LedgerPanel from '@/components/game-ui/LedgerPanel';
import NarrativeFeed from '@/components/game-ui/NarrativeFeed';
import ActionDeck from '@/components/game-ui/ActionDeck';
import { mockInventory, NarrativeItem } from '@/lib/game-data';
import { supabase } from '@/lib/supabase';
import { Character } from '@/lib/character-types';

import VisualStage from '@/components/game-ui/VisualStage';
import InventoryPanel from '@/components/game-ui/InventoryPanel';
import GameToast from '@/components/game-ui/GameToast';
import SettingsModal from '@/components/game-ui/SettingsModal';
import SplashScreen from '@/components/game-ui/SplashScreen';
import { getVisualAsset } from '@/lib/visual-canon';

export default function GameUIPage() {
    const router = useRouter();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [narrative, setNarrative] = useState<NarrativeItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activePanel, setActivePanel] = useState<'none' | 'character' | 'inventory'>('none');
    const [animations, setAnimations] = useState({
        flickering_light: false,
        windy_foliage: false,
        rain: false,
        snow: false,
        fog: false,
        embers: false,
        lightning: false
    });

    const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
        setToast({ message, type });
    };

    const togglePanel = (panel: 'character' | 'inventory') => {
        setActivePanel(prev => prev === panel ? 'none' : panel);
    };

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
                    showToast('Failed to load character data.', 'error');
                    // Delay redirect slightly so user sees toast? No, redirecting is cleaner if critical.
                    // router.push('/character-creation');
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
                showToast('Network error loading character.', 'error');
                router.push('/character-creation');
            } finally {
                setLoading(false);
            }
        };

        loadCharacter();
    }, [router]);


    // Load History separately dependent on character
    useEffect(() => {
        const loadHistory = async () => {
            if (!character) return;

            const { data } = await supabase
                .from('narrative_history')
                .select('*')
                .eq('character_id', character.id)
                .order('created_at', { ascending: true });

            if (data && data.length > 0) {
                const historyItems: NarrativeItem[] = data.map(record => ({
                    id: record.id,
                    type: record.metadata?.type || 'narrative',
                    content: record.content,
                    result: record.role === 'assistant' ? 'AI DM Response' : undefined,
                    isVerified: true,
                    timestamp: new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    imageUrl: record.metadata?.imageUrl,
                    // If we stored animations, we could restore them here too, but usually only the last one matters?
                }));
                setNarrative(historyItems);

                // Restore last animations if available
                const lastAiResponse = [...data].reverse().find(r => r.role === 'assistant');
                if (lastAiResponse?.metadata?.animations) {
                    setAnimations(lastAiResponse.metadata.animations);
                }
            }
        };

        loadHistory();
    }, [character]);

    // Initial prompt generation - Only if no history exists
    useEffect(() => {
        if (character && narrative.length === 0 && !isProcessing && !loading) {
            // Check one last time if we really have no history (race condition prevention)
            handleAction("Begin the adventure");
        }
    }, [character, isProcessing, loading]); // Remove narrative.length dependency to avoid double firing, logic inside handles it

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
                body: JSON.stringify({
                    action,
                    characterId: character?.id,
                    userId: character?.user_id
                }),
            });

            const data = await response.json();

            if (data.error) {
                console.error('AI Error:', data.error);
                showToast(data.error || 'The Dungeon Master is silent...', 'error');
                return;
            }

            // Use generated scene image from backend
            const imageUrl = data.imageUrl;

            console.log("API Response Data:", data); // DEBUG LOG

            // Update animations if provided
            if (data.animations) {
                console.log("Setting animations:", data.animations); // DEBUG LOG
                setAnimations(data.animations);
            } else {
                console.log("No animations found in response"); // DEBUG LOG
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
            showToast('Connection to the Realm lost.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return <SplashScreen />;
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
        <div className="h-screen w-screen bg-black relative overflow-hidden font-[family-name:var(--font-cinzel)]">

            {/* Visual Stage (Background) */}
            <div className="absolute inset-0 z-0">
                <VisualStage
                    imageSrc={activeVisualSrc}
                    caption={activeCaption}
                />
            </div>

            {/* Dark Overlay for readability - VisualStage has its own, but we might need extra for UI contrast if needed, 
                but let's rely on VisualStage's gradient first. */}







            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 2s ease-in-out infinite;
                }
                @keyframes slide-wind {
                    0% { transform: translateX(-20%); }
                    100% { transform: translateX(20%); }
                }
                .animate-slide-wind {
                    animation: slide-wind 3s linear infinite alternate;
                }
                @keyframes rain {
                    0% { background-position: 0 0; }
                    100% { background-position: 10px 100vh; }
                }
                .animate-rain {
                    animation: rain 0.5s linear infinite;
                }
                @keyframes snow {
                    0% { background-position: 0 0; }
                    100% { background-position: 20px 100vh; }
                }
                .animate-snow {
                    animation: snow 5s linear infinite;
                }
                @keyframes fog {
                    0% { transform: translateX(-10%) translateY(0); opacity: 0.3; }
                    50% { transform: translateX(10%) translateY(-5%); opacity: 0.5; }
                    100% { transform: translateX(-10%) translateY(0); opacity: 0.3; }
                }
                .animate-fog {
                    animation: fog 20s ease-in-out infinite;
                }
                .animate-fog-slow {
                    animation: fog 30s ease-in-out infinite reverse;
                }
                @keyframes embers {
                    0% { background-position: 0 100vh; opacity: 1; }
                    100% { background-position: 20px 0; opacity: 0; }
                }
                .animate-embers {
                    animation: embers 4s linear infinite;
                }
                @keyframes lightning {
                    0%, 90%, 100% { opacity: 0; }
                    92%, 96% { opacity: 0.8; }
                    94%, 98% { opacity: 0.1; }
                }
                .animate-lightning {
                    animation: lightning 5s linear infinite;
                }
            `}</style>

            {/* Top Right HUD - Icons */}
            <div className="absolute top-6 right-6 z-50 flex gap-4">
                {/* Character Sheet Toggle (Ring Icon) */}
                <button
                    onClick={() => togglePanel('character')}
                    className={`group relative p-3 rounded-full transition-all duration-300 ${activePanel === 'character' ? 'bg-[#ffb74d]/20 scale-110' : 'bg-black/40 hover:bg-black/60'}`}
                    title="Character Sheet"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#ffb74d] drop-shadow-[0_0_10px_rgba(255,183,77,0.5)]">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                        <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
                    </svg>
                    <div className="absolute inset-0 rounded-full ring-2 ring-[#ffb74d]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Inventory Toggle (Jewel Icon) */}
                <button
                    onClick={() => togglePanel('inventory')}
                    className={`group relative p-3 rounded-full transition-all duration-300 ${activePanel === 'inventory' ? 'bg-[#ef4444]/20 scale-110' : 'bg-black/40 hover:bg-black/60'}`}
                    title="Inventory"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#ef4444] drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.902 7.098a3.75 3.75 0 0 1 3.804 0l.001.001a6.75 6.75 0 0 1 3.844 3.844l.001.001a3.75 3.75 0 0 1 0 3.804l-.001.001a6.75 6.75 0 0 1-3.844 3.844l-.001.001a3.75 3.75 0 0 1-3.804 0l-.001-.001a6.75 6.75 0 0 1-3.844-3.844l-.001-.001a3.75 3.75 0 0 1 0-3.804l.001-.001a6.75 6.75 0 0 1 3.844-3.844l.001-.001Z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute inset-0 rounded-full ring-2 ring-[#ef4444]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-8">

                {/* Narrative Feed - Centered, Scrollable */}
                <div className="w-full max-w-3xl flex-1 overflow-y-auto mb-4 px-4 scrollbar-hide mask-gradient-top">
                    <NarrativeFeed items={narrative} isProcessing={isProcessing} onAction={handleAction} />
                </div>

                {/* Action Deck - Fixed Bottom */}
                <div className="w-full max-w-3xl px-4">
                    <ActionDeck inventory={mockInventory} onAction={handleAction} />
                </div>
            </div>

            {/* Overlay Panels */}
            {activePanel === 'character' && (
                <div className="absolute top-20 right-6 z-40 w-[350px] bg-black/90 border border-[#ffb74d]/30 rounded-lg shadow-2xl backdrop-blur-md animate-slideInRight">
                    <LedgerPanel character={gameCharacter} />
                </div>
            )}

            {activePanel === 'inventory' && character && (
                <div className="absolute top-20 right-20 z-40 w-[350px] animate-slideInRight">
                    <InventoryPanel characterId={character.id as string} />
                </div>
            )}

            {/* System Toast */}
            {toast && (
                <GameToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Settings Modal */}
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </div>
    );
}
