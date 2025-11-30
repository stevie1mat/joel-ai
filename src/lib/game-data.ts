
export interface Attribute {
    name: string;
    value: number;
    modifier: number;
}

export interface Condition {
    name: string;
    description: string;
    duration: string;
}

export interface Resource {
    name: string;
    current: number;
    max: number;
}

export interface CharacterState {
    name: string;
    race: string;
    class: string;
    level: number;
    portraitId?: string; // Link to Visual Canon
    hp: { current: number; max: number; temp: number };
    ac: number;
    speed: number;
    attributes: Attribute[];
    conditions: Condition[];
    resources: Resource[];
}

export interface NarrativeItem {
    id: string;
    type: 'narrative' | 'combat' | 'system';
    content: string;
    result?: string; // e.g., "Roll: 19 (Success)"
    imageUrl?: string; // Direct URL override
    portraitId?: string; // Link to Visual Canon (NPCs)
    imageId?: string; // Link to Visual Canon (Items/Events)
    isVerified: boolean;
    timestamp: string;
    choices?: { id: string; title: string; description: string; }[];
}

export interface InventoryItem {
    id: string;
    name: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'very rare' | 'legendary';
    type: string;
    cost: string;
    description: string;
    imageId?: string; // Link to Visual Canon
}

export const mockCharacter: CharacterState = {
    name: "Kaelen Shadowwalker",
    race: "Drow",
    class: "Rogue",
    level: 5,
    portraitId: "npc_kaelen",
    hp: { current: 32, max: 45, temp: 0 },
    ac: 16,
    speed: 30,
    attributes: [
        { name: "STR", value: 10, modifier: 0 },
        { name: "DEX", value: 18, modifier: +4 },
        { name: "CON", value: 14, modifier: +2 },
        { name: "INT", value: 12, modifier: +1 },
        { name: "WIS", value: 13, modifier: +1 },
        { name: "CHA", value: 15, modifier: +2 },
    ],
    conditions: [
        { name: "Stealthed", description: "You are hidden from view.", duration: "Until attack" }
    ],
    resources: [
        { name: "Sneak Attack", current: 1, max: 1 },
        { name: "Hit Dice", current: 3, max: 5 }
    ]
};

export const mockNarrative: NarrativeItem[] = [
    {
        id: "1",
        type: "system",
        content: "You enter the damp cavern. The air is thick with the scent of mildew.",
        result: "Perception Check: 14 (Success)",
        isVerified: true,
        timestamp: "10:00 AM"
    },
    {
        id: "2",
        type: "narrative",
        content: "A faint chittering sound echoes from the darkness ahead. You see glowing fungal spores drifting in the air.",
        imageId: "event_spores",
        isVerified: false,
        timestamp: "10:01 AM",
        choices: [
            { id: '1', title: 'APPROACH THE TRADERS', description: 'Engage with the nomadic traders and see if they have valuable information about The Archivist or the route to Bend.' },
            { id: '2', title: 'SCAVENGE THE RUINS NEARBY', description: 'Search the nearby ruins for useful supplies or artifacts that might aid your quest.' },
            { id: '3', title: 'SET OUT ON THE ROAD TO BEND', description: 'Head towards Bend directly, trusting your instincts to navigate the wasteland.' },
            { id: '4', title: 'FREE CHOICE', description: 'Dictate your own course of action based on your thoughts or desires.' },
        ]
    }
];

export const mockInventory: InventoryItem[] = [
    { id: "1", name: "Potion of Healing", rarity: "common", type: "Potion", cost: "50gp", description: "Restores 2d4+2 HP", imageId: "item_potion_healing" },
    { id: "2", name: "Dagger of Venom", rarity: "rare", type: "Weapon", cost: "2000gp", description: "+1 Dagger, deals poison damage", imageId: "item_dagger_venom" },
];
