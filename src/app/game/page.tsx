
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import LedgerPanel from '@/components/game-ui/LedgerPanel';
import NarrativeFeed from '@/components/game-ui/NarrativeFeed';
import ActionDeck from '@/components/game-ui/ActionDeck';
import { NarrativeItem } from '@/lib/game-data';
import { supabase } from '@/lib/supabase';
import { Character } from '@/lib/character-types';

import VisualStage from '@/components/game-ui/VisualStage';
import GameToast from '@/components/game-ui/GameToast';
import SettingsModal from '@/components/game-ui/SettingsModal';
import SplashScreen from '@/components/game-ui/SplashScreen';
import { getVisualAsset } from '@/lib/visual-canon';
import CharacterSprite from '@/components/game-ui/CharacterSprite';
import DiceRoller from '@/components/game-ui/DiceRoller';

export default function GameUIPage() {
    const router = useRouter();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [narrative, setNarrative] = useState<NarrativeItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [inventory, setInventory] = useState<any[]>([]);
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
    const [rolling, setRolling] = useState(false);
    const [pendingAction, setPendingAction] = useState<string | null>(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const hasLoadedHistory = useRef<string | null>(null);

    // ── Keyboard-driven character movement ──
    const [charPosX, setCharPosX] = useState(50); // percentage across stage
    const [charFacingRight, setCharFacingRight] = useState(true);
    const [charIsWalking, setCharIsWalking] = useState(false);
    const keysPressed = useRef<Set<string>>(new Set());
    const animFrameRef = useRef<number>(0);
    const MOVE_SPEED = 0.4; // % per frame

    // Keyboard listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't capture keys when typing in inputs
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;

            const key = e.key.toLowerCase();
            if (['arrowleft', 'arrowright', 'a', 'd'].includes(key)) {
                e.preventDefault();
                keysPressed.current.add(key);
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            keysPressed.current.delete(key);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Game loop for smooth movement
    useEffect(() => {
        const gameLoop = () => {
            const keys = keysPressed.current;
            const movingLeft = keys.has('arrowleft') || keys.has('a');
            const movingRight = keys.has('arrowright') || keys.has('d');

            if (movingLeft || movingRight) {
                setCharIsWalking(true);
                if (movingLeft) {
                    setCharFacingRight(false);
                    setCharPosX(prev => Math.max(5, prev - MOVE_SPEED));
                }
                if (movingRight) {
                    setCharFacingRight(true);
                    setCharPosX(prev => Math.min(95, prev + MOVE_SPEED));
                }
            } else {
                setCharIsWalking(false);
            }

            animFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animFrameRef.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, []);

    // Derive parallax from character position — bigger range for true exploration feel
    const parallaxX = (charPosX / 100 - 0.5) * -80;
    const parallaxY = -3; // subtle constant upward shift for ground perspective

    const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
        setToast({ message, type });
    };

    const togglePanel = (panel: 'character' | 'inventory') => {
        setActivePanel(prev => prev === panel ? 'none' : panel);
    };

    const loadInventoryData = async (charId: string) => {
        const { data, error } = await supabase
            .from('character_inventory')
            .select('*, item_templates (*)')
            .eq('character_id', charId);

        if (!error && data) {
            setInventory(data.map(row => ({
                id: row.id,
                quantity: row.quantity,
                ...row.item_templates
            })));
        }
    };

    // Load character, inventory, and history in one unified flow
    const loadCharacterData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // 1. Fetch character
            const { data, error } = await supabase
                .from('characters')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !data) {
                console.error('Error loading character:', error);
                showToast('Failed to load character data.', 'error');
                return;
            }

            // 2. Fetch inventory & history in parallel
            setHistoryLoading(true);
            const [_, histRes] = await Promise.all([
                loadInventoryData(data.id),
                supabase
                    .from('narrative_history')
                    .select('*')
                    .eq('character_id', data.id)
                    .order('created_at', { ascending: true })
            ]);

            // Set character state
            const char: Character = {
                id: data.id,
                user_id: data.user_id,
                name: data.name,
                class: data.class,
                level: data.level,
                xp: data.xp || 0,
                current_hp: data.current_hp,
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

            // Set history
            if (histRes.data && histRes.data.length > 0) {
                const historyItems: NarrativeItem[] = histRes.data.map(record => ({
                    id: record.id,
                    type: (record.metadata as any)?.type || 'narrative',
                    role: record.role as 'user' | 'assistant',
                    content: record.content,
                    isVerified: true,
                    timestamp: new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    imageUrl: (record.metadata as any)?.imageUrl,
                }));
                setNarrative(historyItems);
                
                // Restore last animations
                const lastAiResponse = [...histRes.data].reverse().find(r => r.role === 'assistant');
                if ((lastAiResponse?.metadata as any)?.animations) {
                    setAnimations((lastAiResponse.metadata as any).animations);
                }
            }

        } catch (err) {
            console.error('Failed to load game state:', err);
            showToast('Network error loading realm.', 'error');
            router.push('/character-creation');
        } finally {
            setHistoryLoading(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCharacterData();
    }, [router]);

    // Initial prompt generation - Only if no history exists and we've checked the DB
    useEffect(() => {
        if (character && narrative.length === 0 && !isProcessing && !loading && !historyLoading) {
            handleAction("Begin the adventure");
        }
    }, [character?.id, isProcessing, loading, historyLoading]);

    // Derive the active visual from the latest narrative item that has one
    const activeVisualItem = [...narrative].reverse().find(item => item.imageUrl || item.portraitId);
    const activeVisualSrc = activeVisualItem
        ? (activeVisualItem.imageUrl || getVisualAsset(activeVisualItem.portraitId))
        : undefined;

    const activeCaption = activeVisualItem?.portraitId ? "NPC Encounter"
        : activeVisualItem?.imageUrl ? "Environment"
            : undefined;

    const handleAction = async (action: string) => {
        setIsProcessing(true);

        // Add the player's action to the narrative feed immediately
        const userItem: NarrativeItem = {
            id: `user-${Date.now()}`,
            type: 'narrative',
            role: 'user',
            content: action,
            isVerified: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setNarrative(prev => [...prev, userItem]);

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

            const imageUrl = data.imageUrl;

            if (data.animations) {
                setAnimations(data.animations);
            }

            const newItem: NarrativeItem = {
                id: Date.now().toString(),
                type: 'narrative',
                role: 'assistant',
                content: data.response,
                result: 'AI DM Response',
                isVerified: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                imageUrl: imageUrl
            };

            setNarrative(prev => [...prev, newItem]);

            if (data.gameStateUpdates) {
                const updates = data.gameStateUpdates;
                const xpAdded = typeof updates.xpEarned === 'number' ? updates.xpEarned : 0;
                const hpChange = typeof updates.hpChange === 'number' ? updates.hpChange : 0;
                
                if (xpAdded > 0) showToast(`+${xpAdded} XP earned!`, 'success');
                if (hpChange > 0) showToast(`+${hpChange} HP recovered!`, 'success');
                if (hpChange < 0) showToast(`${hpChange} HP lost!`, 'error');
                
                if (updates.newItems && Array.isArray(updates.newItems)) {
                    updates.newItems.forEach((item: string) => showToast(`Found: ${item}`, 'success'));
                    // 🔥 Sync inventory locally
                    if (character?.id) {
                        loadInventoryData(character.id);
                    }
                }

                // Update character locally without a full re-fetch
                setCharacter(prev => {
                    if (!prev) return prev;
                    const maxHp = 10 + Math.floor(((prev.stats.constitution || 10) - 10) / 2);
                    return {
                        ...prev,
                        xp: (prev.xp || 0) + xpAdded,
                        current_hp: Math.max(0, Math.min(maxHp, (prev.current_hp || maxHp) + hpChange))
                    };
                });
            }

        } catch (error: any) {
            console.error('Action error:', error);
            showToast('Failed to connect to the realm.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRollStart = (actionText: string) => {
        setPendingAction(actionText);
        setRolling(true);
    };

    const handleRollComplete = (result: number) => {
        setRolling(false);
        if (pendingAction) {
            handleAction(`${pendingAction} [Rolled: ${result}]`);
            setPendingAction(null);
        }
    };

    const handleReset = async () => {
        if (!character) return;
        
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const response = await fetch('/api/game/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    characterId: character.id,
                    userId: user.id
                })
            });

            if (response.ok) {
                showToast('Progress reset successfully.', 'success');
                // Clear and reload
                setNarrative([]);
                await loadCharacterData();
                setShowSettings(false);
            } else {
                showToast('Failed to reset progress.', 'error');
            }
        } catch (err) {
            console.error('Reset error:', err);
            showToast('Error resetting realm.', 'error');
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
        race: character.allegiance || 'Wanderer',
        class: character.class,
        level: character.level,
        hp: {
            current: character.current_hp ?? (10 + Math.floor((character.stats.constitution - 10) / 2)),
            max: 10 + Math.floor((character.stats.constitution - 10) / 2),
            temp: 0
        },
        xp: character.xp || 0,
        ac: 10 + Math.floor((character.stats.dexterity - 10) / 2),
        speed: 30,
        portraitId: character.avatar_url || undefined,
        background: character.allegiance || 'Free Adventurer',
        stats: character.stats as unknown as { [key: string]: number },
        attributes: [],
        conditions: [],
        resources: []
    };

    return (
        <div className="h-screen w-screen bg-black relative overflow-hidden font-[family-name:var(--font-lato)]">

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, { opacity: 0.3; }
                    50% { opacity: 0.6; }
                    100% { opacity: 0.3; }
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

                /* ── Ambient Smoke ── */
                @keyframes smoke-rise {
                    0% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.4;
                    }
                    50% {
                        opacity: 0.25;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(30px) scale(2.5);
                        opacity: 0;
                    }
                }
                @keyframes smoke-rise-alt {
                    0% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0;
                    }
                    15% {
                        opacity: 0.3;
                    }
                    60% {
                        opacity: 0.15;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(-20px) scale(3);
                        opacity: 0;
                    }
                }
                @keyframes ember-float {
                    0% {
                        transform: translateY(0) translateX(0);
                        opacity: 1;
                    }
                    25% {
                        transform: translateY(-25vh) translateX(15px);
                        opacity: 0.9;
                    }
                    50% {
                        transform: translateY(-50vh) translateX(-10px);
                        opacity: 0.6;
                    }
                    75% {
                        transform: translateY(-75vh) translateX(20px);
                        opacity: 0.3;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(5px);
                        opacity: 0;
                    }
                }
                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.7; }
                }

                /* ── Character Sprite Animations ── */
                @keyframes char-walk-bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                @keyframes char-idle-sway {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-2px) rotate(0.5deg); }
                }
                @keyframes char-shadow-walk {
                    0%, 100% { transform: scaleX(1) translateX(-50%); }
                    50% { transform: scaleX(0.85) translateX(-50%); }
                }
                @keyframes snow-fall {
                    0% { transform: translateY(-10vh) translateX(0); }
                    100% { transform: translateY(110vh) translateX(20px); }
                }
                @keyframes rain-fall {
                    0% { transform: translateY(-10vh) translateX(0); }
                    100% { transform: translateY(110vh) translateX(5px); }
                }
                @keyframes lightning-flash {
                    0%, 90%, 100% { opacity: 0; }
                    92%, 98% { opacity: 0.4; }
                    95% { opacity: 0.8; }
                }
            `}</style>

            {/* ── Full-screen Visual Stage (with parallax + character) ── */}
            <div
                className="absolute inset-0 z-0"
                style={{ right: '34%' }}
            >
                <VisualStage
                    imageSrc={activeVisualSrc}
                    caption={activeCaption}
                    parallaxX={parallaxX}
                    parallaxY={parallaxY}
                />
            </div>

            {/* ── Ambient Smoke & Fire Overlay (left side) ── */}
            <div className="absolute inset-0 z-10 pointer-events-none" style={{ right: '34%' }}>
                {/* Bottom fire glow */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[30%]"
                    style={{
                        background: 'linear-gradient(to top, rgba(255,100,20,0.15), rgba(255,140,40,0.06) 40%, transparent)',
                        animation: 'glow-pulse 3s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute bottom-0 left-[10%] right-[30%] h-[20%]"
                    style={{
                        background: 'radial-gradient(ellipse at bottom, rgba(255,80,10,0.2), transparent 70%)',
                        animation: 'glow-pulse 2s ease-in-out infinite 0.5s',
                    }}
                />

                {/* Smoke wisps */}
                {[0, 1, 2, 3, 4].map(i => (
                    <div
                        key={`smoke-${i}`}
                        className="absolute rounded-full"
                        style={{
                            bottom: '-5%',
                            left: `${10 + i * 15}%`,
                            width: `${80 + i * 20}px`,
                            height: `${80 + i * 20}px`,
                            background: `radial-gradient(circle, rgba(${i % 2 === 0 ? '180,120,60' : '120,100,80'},0.25), transparent 70%)`,
                            animation: `${i % 2 === 0 ? 'smoke-rise' : 'smoke-rise-alt'} ${8 + i * 2}s ease-out infinite ${i * 1.5}s`,
                            filter: 'blur(20px)',
                        }}
                    />
                ))}

                {/* Ember particles */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div
                        key={`ember-${i}`}
                        className="absolute rounded-full"
                        style={{
                            bottom: '2%',
                            left: `${5 + i * 10}%`,
                            width: `${2 + (i % 3)}px`,
                            height: `${2 + (i % 3)}px`,
                            backgroundColor: i % 3 === 0 ? '#ff6a1a' : i % 3 === 1 ? '#ffb74d' : '#ff4500',
                            boxShadow: `0 0 ${4 + i}px ${i % 3 === 0 ? '#ff6a1a' : '#ffb74d'}`,
                            animation: `ember-float ${5 + i * 0.8}s ease-out infinite ${i * 0.7}s`,
                        }}
                    />
                ))}

                {/* Snow Effect */}
                {animations.snow && (
                    <div className="absolute inset-0 pointer-events-none z-20">
                        {[...Array(60)].map((_, i) => (
                            <div
                                key={`snow-${i}`}
                                className="absolute bg-white rounded-full opacity-60"
                                style={{
                                    top: '-5%',
                                    left: `${Math.random() * 100}%`,
                                    width: `${2 + Math.random() * 4}px`,
                                    height: `${2 + Math.random() * 4}px`,
                                    filter: 'blur(1px)',
                                    animation: `snow-fall ${3 + Math.random() * 5}s linear infinite`,
                                    animationDelay: `${Math.random() * 5}s`,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Rain Effect */}
                {animations.rain && (
                    <div className="absolute inset-0 pointer-events-none z-20">
                        {[...Array(80)].map((_, i) => (
                            <div
                                key={`rain-${i}`}
                                className="absolute bg-blue-200/40"
                                style={{
                                    top: '-5%',
                                    left: `${Math.random() * 100}%`,
                                    width: '1px',
                                    height: `${15 + Math.random() * 20}px`,
                                    transform: 'rotate(10deg)',
                                    animation: `rain-fall ${0.5 + Math.random() * 0.5}s linear infinite`,
                                    animationDelay: `${Math.random() * 1}s`,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Fog Effect */}
                {animations.fog && (
                    <div className="absolute inset-0 pointer-events-none z-20 flex items-end">
                        <div
                            className="w-full h-[60%] opacity-40"
                            style={{
                                background: 'linear-gradient(to top, #666, transparent)',
                                filter: 'blur(60px)',
                                animation: 'fog 15s ease-in-out infinite',
                            }}
                        />
                    </div>
                )}

                {/* Lightning Effect */}
                {animations.lightning && (
                    <div
                        className="absolute inset-0 bg-white pointer-events-none z-30"
                        style={{
                            animation: 'lightning-flash 8s infinite',
                        }}
                    />
                )}
            </div>

            {/* ── Floating Chat Panel (right 1/3) ── */}
            <div className="absolute top-4 right-4 bottom-4 w-[32%] z-20 flex flex-col rounded-2xl overflow-hidden bg-black/60 backdrop-blur-xl border border-[#ffb74d]/20 shadow-[0_8px_48px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,183,77,0.08)]">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#ffb74d]/10 shrink-0">
                    <span className="text-[#ffb74d]/60 font-[family-name:var(--font-cinzel)] text-sm tracking-[0.2em]">
                        Chronicles
                    </span>
                    <div className="flex gap-2">
                        {/* Character Sheet Toggle */}
                        <button
                            onClick={() => togglePanel('character')}
                            className={`group relative p-2 rounded-full transition-all duration-300 ${activePanel === 'character' ? 'bg-[#ffb74d]/20 scale-110' : 'bg-black/40 hover:bg-black/60'}`}
                            title="Character Sheet"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#ffb74d] drop-shadow-[0_0_6px_rgba(255,183,77,0.5)]">
                                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
                            </svg>
                            <div className="absolute inset-0 rounded-full ring-2 ring-[#ffb74d]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>

                {/* Narrative Feed */}
                <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
                    <NarrativeFeed items={narrative} isProcessing={isProcessing} onAction={handleAction} />
                </div>

                {/* Action Deck */}
                <div className="px-3 pb-4 pt-2 border-t border-[#ffb74d]/10 shrink-0">
                    <ActionDeck 
                        inventory={inventory} 
                        onAction={handleAction} 
                        rolling={rolling}
                        onRollStart={handleRollStart}
                    />
                </div>

                {/* Centered Dice Roller Backdrop/Overlay */}
                <DiceRoller rolling={rolling} onComplete={handleRollComplete} />

                {/* Overlay Panels — slide over the floating panel */}
                {activePanel === 'character' && (
                    <div className="absolute inset-0 z-40 rounded-2xl bg-black/95 border border-[#ffb74d]/30 shadow-2xl backdrop-blur-md overflow-y-auto">
                        <button
                            onClick={() => setActivePanel('none')}
                            className="absolute top-3 right-3 p-1 text-[#ffb74d]/60 hover:text-[#ffb74d] transition-colors z-50"
                        >✕</button>
                        <LedgerPanel
                            character={gameCharacter}
                            characterId={character.id as string}
                            characterClass={character.class}
                            allegiance={character.allegiance}
                            inventory={inventory}
                        />
                    </div>
                )}
            </div>

            {/* System Toast */}
            {toast && (
                <GameToast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Settings Modal */}
            <SettingsModal 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)} 
                onReset={handleReset}
            />
        </div>
    );
}
