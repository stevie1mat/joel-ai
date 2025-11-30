
// This library acts as the source of truth for the "Visual Canon".
// It maps specific IDs (from game data) to pre-generated assets or specific seeds.
// This ensures no random generation occurs and maintains the "Luminous Mycelial Amber" aesthetic.

export const VISUAL_ASSETS: Record<string, string> = {
    // NPCs
    "npc_kaelen": "https://placehold.co/400x600/1a1a1a/ffb74d?text=Kaelen+Shadowwalker",

    // Items
    "item_potion_healing": "https://placehold.co/200x200/1a1a1a/ffb74d?text=Healing+Potion",
    "item_dagger_venom": "https://placehold.co/200x200/1a1a1a/ffb74d?text=Dagger+of+Venom",

    // Narrative Events
    "event_spores": "https://placehold.co/400x300/1a1a1a/ffb74d?text=Glowing+Spores",
};

export function getVisualAsset(id: string | undefined): string | undefined {
    if (!id) return undefined;
    return VISUAL_ASSETS[id];
}
