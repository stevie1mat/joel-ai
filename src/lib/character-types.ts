export interface CharacterStats {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

export interface Character {
    id?: string;
    user_id?: string;
    name: string;
    class: string;
    stats: CharacterStats;
    level: number;
    allegiance?: string;
    avatar_url?: string;
}

export const CLASSES = [
    {
        id: 'warrior',
        name: 'Warrior',
        description: 'A master of martial combat, skilled with weapons and armor.',
        primaryStats: ['STR', 'CON'],
        icon: '⚔️',
        role: 'DPS',
        abilities: [
            'Second Wind - Recover health in battle',
            'Action Surge - Take an extra action',
            'Fighting Style - Master a combat technique'
        ],
        recommendedBuild: { primary: 'strength', secondary: 'constitution' }
    },
    {
        id: 'rogue',
        name: 'Rogue',
        description: 'A scoundrel who uses stealth and trickery to overcome obstacles.',
        primaryStats: ['DEX', 'CHA'],
        icon: '🗡️',
        role: 'DPS',
        abilities: [
            'Sneak Attack - Deal devastating surprise damage',
            'Cunning Action - Bonus action versatility',
            'Expertise - Double proficiency in key skills'
        ],
        recommendedBuild: { primary: 'dexterity', secondary: 'charisma' }
    },
    {
        id: 'mage',
        name: 'Mage',
        description: 'A spellcaster who manipulates arcane forces to devastating effect.',
        primaryStats: ['INT', 'WIS'],
        icon: '🔮',
        role: 'DPS',
        abilities: [
            'Arcane Recovery - Regain spell slots',
            'Spellcasting - Vast magical repertoire',
            'Arcane Tradition - Specialize your magic'
        ],
        recommendedBuild: { primary: 'intelligence', secondary: 'constitution' }
    },
    {
        id: 'cleric',
        name: 'Cleric',
        description: 'A divine agent who wields healing and protective magic.',
        primaryStats: ['WIS', 'CON'],
        icon: '✨',
        role: 'Healer',
        abilities: [
            'Divine Healing - Restore allies\' health',
            'Channel Divinity - Invoke divine power',
            'Divine Domain - Sacred specialization'
        ],
        recommendedBuild: { primary: 'wisdom', secondary: 'constitution' }
    },
    {
        id: 'ranger',
        name: 'Ranger',
        description: 'A wilderness warrior who excels at hunting and survival.',
        primaryStats: ['DEX', 'WIS'],
        icon: '🏹',
        role: 'DPS',
        abilities: [
            'Favored Enemy - Hunt specific foes',
            'Natural Explorer - Master the wilds',
            'Hunter\'s Mark - Track and damage prey'
        ],
        recommendedBuild: { primary: 'dexterity', secondary: 'wisdom' }
    },
    {
        id: 'paladin',
        name: 'Paladin',
        description: 'A holy warrior bound by sacred oaths to fight evil.',
        primaryStats: ['STR', 'CHA'],
        icon: '🛡️',
        role: 'Tank',
        abilities: [
            'Lay on Hands - Heal through touch',
            'Divine Smite - Radiant weapon strikes',
            'Sacred Oath - Channel divine power'
        ],
        recommendedBuild: { primary: 'strength', secondary: 'charisma' }
    }
];

export const STAT_NAMES = {
    strength: 'Strength',
    dexterity: 'Dexterity',
    constitution: 'Constitution',
    intelligence: 'Intelligence',
    wisdom: 'Wisdom',
    charisma: 'Charisma'
};

export const STAT_DESCRIPTIONS = {
    strength: 'Physical power and athletic prowess',
    dexterity: 'Agility, reflexes, and balance',
    constitution: 'Health, stamina, and vital force',
    intelligence: 'Reasoning, memory, and analytical skill',
    wisdom: 'Awareness, intuition, and insight',
    charisma: 'Force of personality and leadership'
};

export const POINT_BUY_TOTAL = 27;
export const STAT_MIN = 8;
export const STAT_MAX = 15;

// Helper function to calculate D&D 5e stat modifier
export function calculateModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

// Get formatted modifier string (e.g., "+2", "-1", "+0")
export function getStatModifierString(score: number): string {
    const modifier = calculateModifier(score);
    if (modifier >= 0) {
        return `+${modifier}`;
    }
    return `${modifier}`;
}

// Stat presets for quick allocation
export const STAT_PRESETS: Record<string, { name: string; description: string; stats: CharacterStats }> = {
    balanced: {
        name: 'Balanced',
        description: 'Well-rounded adventurer',
        stats: {
            strength: 12,
            dexterity: 12,
            constitution: 12,
            intelligence: 11,
            wisdom: 11,
            charisma: 10
        }
    },
    martial: {
        name: 'Martial',
        description: 'Physical combatant',
        stats: {
            strength: 15,
            dexterity: 13,
            constitution: 14,
            intelligence: 8,
            wisdom: 10,
            charisma: 8
        }
    },
    caster: {
        name: 'Spellcaster',
        description: 'Magic wielder',
        stats: {
            strength: 8,
            dexterity: 12,
            constitution: 13,
            intelligence: 15,
            wisdom: 14,
            charisma: 8
        }
    },
    tank: {
        name: 'Tank',
        description: 'Durable defender',
        stats: {
            strength: 14,
            dexterity: 10,
            constitution: 15,
            intelligence: 8,
            wisdom: 12,
            charisma: 9
        }
    },
    specialist: {
        name: 'Specialist',
        description: 'Focused expert',
        stats: {
            strength: 8,
            dexterity: 15,
            constitution: 12,
            intelligence: 10,
            wisdom: 14,
            charisma: 9
        }
    }
};

// Faction definitions
export const FACTIONS = [
    {
        id: 'order_of_flame',
        name: 'Order of the Eternal Flame',
        icon: '🔥',
        description: 'Warriors who harness the power of ancient fire magic',
        lore: 'Sworn to protect the realm from darkness using the sacred flames passed down through generations.',
        benefit: '+2 to fire damage, resistance to cold'
    },
    {
        id: 'shadow_covenant',
        name: 'Shadow Covenant',
        icon: '🌙',
        description: 'Masters of stealth and forbidden knowledge',
        lore: 'Operate from the shadows, gathering secrets and wielding power through information and subterfuge.',
        benefit: '+2 to stealth checks, darkvision'
    },
    {
        id: 'verdant_circle',
        name: 'Verdant Circle',
        icon: '🌿',
        description: 'Druids and rangers who commune with nature',
        lore: 'Guardians of the wild places, maintaining the delicate balance between civilization and the natural world.',
        benefit: '+2 to nature checks, speak with animals'
    },
    {
        id: 'arcane_conclave',
        name: 'Arcane Conclave',
        icon: '⚡',
        description: 'Scholars dedicated to magical research',
        lore: 'Seekers of mystical knowledge and arcane mastery, pushing the boundaries of magical understanding.',
        benefit: '+1 spell slot, +2 to arcana checks'
    },
    {
        id: 'iron_legion',
        name: 'Iron Legion',
        icon: '⚔️',
        description: 'Elite military force maintaining order',
        lore: 'Disciplined soldiers sworn to protect the weak, uphold justice, and serve as the realm\'s shield.',
        benefit: '+1 AC, advantage on intimidation'
    },
    {
        id: 'free_wanderers',
        name: 'Free Wanderers',
        icon: '🎭',
        description: 'Independent adventurers beholden to no one',
        lore: 'Value freedom above all else, refusing to be bound by the strictures of organized factions.',
        benefit: '+2 to persuasion, +10 ft movement speed'
    }
];

