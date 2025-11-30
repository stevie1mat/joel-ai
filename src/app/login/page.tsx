"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LoginScreen from "@/components/LoginScreen";

export default function LoginPage() {
    const router = useRouter();

    const handleLoginSuccess = async () => {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/");
                return;
            }

            // Check if user has a character
            const { data: character } = await supabase
                .from('characters')
                .select('id')
                .eq('user_id', user.id)
                .single();

            // Redirect based on character existence
            if (character) {
                router.push("/game");
            } else {
                router.push("/character-creation");
            }
        } catch (error) {
            // If error checking character, assume they need to create one
            router.push("/character-creation");
        }
    };

    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}
