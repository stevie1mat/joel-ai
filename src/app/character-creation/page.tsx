"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CharacterWizard from "@/components/character/CharacterWizard";
import { Character } from "@/lib/character-types";

export default function CharacterCreation() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleComplete = async (character: Character) => {
        setSaving(true);
        setError(null);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("Not authenticated");
            }

            // Save character to Supabase
            const { error: insertError } = await supabase
                .from('characters')
                .insert({
                    user_id: user.id,
                    name: character.name,
                    class: character.class,
                    strength: character.stats.strength,
                    dexterity: character.stats.dexterity,
                    constitution: character.stats.constitution,
                    intelligence: character.stats.intelligence,
                    wisdom: character.stats.wisdom,
                    charisma: character.stats.charisma,
                    level: character.level,
                    allegiance: character.allegiance,
                    avatar_url: character.avatar_url
                });

            if (insertError) throw insertError;

            // Redirect to game
            router.push("/game");
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    };

    if (saving) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <div className="text-4xl mb-4 animate-pulse">⚔️</div>
                <h2 className="text-2xl font-bold text-[#ffb74d] font-[family-name:var(--font-cinzel)]">
                    FORGING YOUR LEGEND...
                </h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4 font-[family-name:var(--font-cinzel)]">
                        ERROR
                    </h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="bg-[#DC143C] hover:bg-[#B22222] text-white font-bold py-3 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 font-[family-name:var(--font-cinzel)]"
                    >
                        [ TRY AGAIN ]
                    </button>
                </div>
            </div>
        );
    }

    return <CharacterWizard onComplete={handleComplete} />;
}
