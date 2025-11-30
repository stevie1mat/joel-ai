"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import VideoBackground from "./VideoBackground";

interface LoginScreenProps {
    onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setError("Check your email for the confirmation link!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onLoginSuccess();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <VideoBackground
                videoSrc="/hero-videoa.mp4"
                startTime={1}
                isPlaying={true}
            />

            <div className="relative z-20 w-full max-w-md px-6">
                <div className="bg-black/80 backdrop-blur-sm border-2 border-[#ffb74d]/30 rounded-sm p-8 shadow-[0_0_30px_rgba(255,183,77,0.3)]">
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-[#ffb74d] text-center mb-2 font-[family-name:var(--font-cinzel)] tracking-wider">
                        {isSignUp ? "JOIN THE CHRONICLES" : "ENTER THE CHRONICLES"}
                    </h1>
                    <p className="text-gray-400 text-center mb-6 text-sm italic font-[family-name:var(--font-lato)]">
                        "Your adventure awaits, traveler"
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2 font-[family-name:var(--font-cinzel)]">
                                EMAIL
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-black/50 border border-[#ffb74d]/30 rounded-sm text-white focus:outline-none focus:border-[#ffb74d] transition-colors"
                                placeholder="your.email@realm.com"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2 font-[family-name:var(--font-cinzel)]">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-black/50 border border-[#ffb74d]/30 rounded-sm text-white focus:outline-none focus:border-[#ffb74d] transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#DC143C] hover:bg-[#B22222] text-white font-bold py-3 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 shadow-[0_0_15px_rgba(220,20,60,0.5)] hover:shadow-[0_0_25px_rgba(220,20,60,0.8)] disabled:opacity-50 disabled:cursor-not-allowed font-[family-name:var(--font-cinzel)]"
                        >
                            {loading ? "LOADING..." : isSignUp ? "[ CREATE ACCOUNT ]" : "[ ENTER ]"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-black/80 text-gray-400">OR</span>
                        </div>
                    </div>

                    {/* Google Auth */}
                    <button
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 px-8 rounded-sm text-sm tracking-widest transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-[family-name:var(--font-play)] flex items-center justify-center gap-2"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        [ CONTINUE WITH GOOGLE ]
                    </button>

                    {/* Toggle Sign Up/Login */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        {isSignUp ? "Already have an account?" : "New to the Chronicles?"}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-2 text-[#ffb74d] hover:text-[#ffb74d]/80 font-bold transition-colors"
                        >
                            {isSignUp ? "Sign In" : "Create Account"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
