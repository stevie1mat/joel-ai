"use client";

import { useState } from "react";
import { Character, CharacterStats, POINT_BUY_TOTAL, STAT_MIN, STAT_MAX } from "@/lib/character-types";
import NameStep from "./NameStep";
import StatsStep from "./StatsStep";
import ClassSelection from "./ClassSelection";
import AllegianceStep from "./AllegianceStep";
import AvatarStep from "./AvatarStep";
import CharacterSummary from "./CharacterSummary";

interface CharacterWizardProps {
    onComplete: (character: Character) => void;
}

export default function CharacterWizard({ onComplete }: CharacterWizardProps) {
    const [step, setStep] = useState(1);
    const [character, setCharacter] = useState<Partial<Character>>({
        name: "",
        class: "",
        stats: {
            strength: 8,
            dexterity: 8,
            constitution: 8,
            intelligence: 8,
            wisdom: 8,
            charisma: 8
        },
        level: 1,
        allegiance: "",
        avatar_url: ""
    });

    const handleNameComplete = (name: string) => {
        setCharacter({ ...character, name });
        setStep(2);
    };

    const handleStatsComplete = (stats: CharacterStats) => {
        setCharacter({ ...character, stats });
        setStep(3);
    };

    const handleClassComplete = (className: string) => {
        setCharacter({ ...character, class: className });
        setStep(4);
    };

    const handleAllegianceComplete = (allegiance: string) => {
        setCharacter({ ...character, allegiance });
        setStep(5);
    };

    const handleAvatarComplete = (avatarUrl: string) => {
        setCharacter({ ...character, avatar_url: avatarUrl });
        setStep(6);
    };

    const handleConfirm = () => {
        onComplete(character as Character);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            {/* Progress Bar */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 bg-gradient-to-b from-black via-black/95 to-transparent pb-6 pt-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                        <div key={s} className="flex items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-all text-xs ${s === step ? 'bg-[#ffb74d] border-[#ffb74d] text-black' :
                                s < step ? 'bg-[#ffb74d]/30 border-[#ffb74d] text-[#ffb74d]' :
                                    'bg-black border-gray-600 text-gray-600'
                                }`}>
                                {s}
                            </div>
                            {s < 6 && (
                                <div className={`flex-1 h-1 mx-1 transition-all ${s < step ? 'bg-[#ffb74d]' : 'bg-gray-600'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-[family-name:var(--font-cinzel)]">
                    <span>NAME</span>
                    <span>STATS</span>
                    <span>CLASS</span>
                    <span>FACTION</span>
                    <span>AVATAR</span>
                    <span>DONE</span>
                </div>
            </div>

            {/* Step Content */}
            <div className="w-full max-w-4xl mt-24">
                {step === 1 && (
                    <NameStep
                        initialName={character.name || ""}
                        onComplete={handleNameComplete}
                    />
                )}
                {step === 2 && (
                    <StatsStep
                        initialStats={character.stats!}
                        onComplete={handleStatsComplete}
                        onBack={handleBack}
                    />
                )}
                {step === 3 && (
                    <ClassSelection
                        onComplete={handleClassComplete}
                        onBack={handleBack}
                        stats={character.stats}
                    />
                )}
                {step === 4 && (
                    <AllegianceStep
                        onComplete={handleAllegianceComplete}
                        onBack={handleBack}
                    />
                )}
                {step === 5 && (
                    <AvatarStep
                        character={character}
                        onComplete={handleAvatarComplete}
                        onBack={handleBack}
                    />
                )}
                {step === 6 && (
                    <CharacterSummary
                        character={character as Character}
                        onConfirm={handleConfirm}
                        onBack={handleBack}
                    />
                )}
            </div>
        </div>
    );
}
