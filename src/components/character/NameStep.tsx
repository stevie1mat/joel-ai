"use client";

import { useState } from "react";

interface NameStepProps {
    initialName: string;
    onComplete: (name: string) => void;
}

export default function NameStep({ initialName, onComplete }: NameStepProps) {
    const [name, setName] = useState(initialName);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (name.trim().length < 2) {
            setError("Name must be at least 2 characters");
            return;
        }

        if (name.trim().length > 30) {
            setError("Name must be no more than 30 characters");
            return;
        }

        onComplete(name.trim());
    };

    return (
        <div className="text-center animate-[fadeIn_0.5s_ease-out]">
            <h1 className="text-5xl md:text-6xl font-bold text-[#ffb74d] mb-4 font-[family-name:var(--font-cinzel)]">
                NAME YOUR HERO
            </h1>
            <p className="text-gray-400 text-lg mb-12 italic font-[family-name:var(--font-lato)]">
                "Every legend begins with a name..."
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-6">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError("");
                        }}
                        placeholder="Enter character name"
                        autoFocus
                        className="w-full px-6 py-4 bg-black/50 border-2 border-[#ffb74d]/30 rounded-sm text-white text-center text-2xl focus:outline-none focus:border-[#ffb74d] transition-colors font-[family-name:var(--font-cinzel)] placeholder:text-gray-600"
                    />
                    {error && (
                        <p className="mt-2 text-red-400 text-sm">{error}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#DC143C] hover:bg-[#B22222] text-white font-bold py-4 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 shadow-[0_0_15px_rgba(220,20,60,0.5)] hover:shadow-[0_0_25px_rgba(220,20,60,0.8)] font-[family-name:var(--font-cinzel)]"
                >
                    [ CONTINUE ]
                </button>
            </form>
        </div>
    );
}
