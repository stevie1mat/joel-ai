import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Mistral } from '@mistralai/mistralai';
import Bytez from 'bytez.js';

// Configuration
const BYTEZ_KEY = process.env.BYTEZ_API_KEY || "";

// Initialize Clients
const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY || '',
});

let bytezModel: any = null;
if (BYTEZ_KEY) {
    const bytez = new Bytez(BYTEZ_KEY);
    bytezModel = bytez.model("stabilityai/stable-diffusion-xl-base-1.0");
}

const SYSTEM_PROMPT = `
You are the Dungeon Master for a text-based RPG called Aether Chronicles, set in a dark fantasy world with amber-lit mystical themes.
Your role is to narrate the story, describe the environment, and determine the outcomes of the player's actions.
Be descriptive, immersive, and fair. If the player attempts an action that requires a skill check, look for a "[Rolled: X]" tag in their input.
If present, USE THAT VALUE to determine the outcome.

CRITICAL RULES:
1. You MUST respond with valid JSON only — no markdown, no code fences, no extra text.
2. You MUST always include ALL fields listed below in your response, including gameStateUpdates.
3. For gameStateUpdates: EVERY meaningful player action should earn XP (10-100 depending on difficulty).
   - Exploring a new area: 10-25 XP
   - Completing a task or puzzle: 25-75 XP
   - Winning combat: 50-100 XP
   - Clever roleplay or creative solutions: 15-50 XP
   - Even simple actions like talking to an NPC should earn at least 5-10 XP.
4. Track HP changes: combat damage (-1 to -20), traps (-5 to -15), healing (+5 to +20).
5. Award items when narratively appropriate (finding loot, buying from merchants, quest rewards).

Format your response as JSON:
{
  "narrative": "Your narrative response here...",
  "imagePrompt": "Brief visual description for AI image generation (dark fantasy style, atmospheric)",
  "animations": {
    "flickering_light": boolean, "windy_foliage": boolean, "rain": boolean, "snow": boolean,
    "fog": boolean, "embers": boolean, "lightning": boolean
  },
  "gameStateUpdates": {
    "hpChange": number,      // e.g., -5 for damage, +10 for healing. Use 0 ONLY if truly no change.
    "xpEarned": number,      // ALWAYS award XP for actions. Minimum 5 for any action.
    "newItems": string[],    // Array of item names to add (e.g. 'Healing Potion', 'Longsword', 'Leather Armor', 'Torch')
    "removedItems": string[] // Array of item names to remove (e.g. when consumed)
  }
}
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, characterId, userId } = body;

        if (!process.env.MISTRAL_API_KEY) {
            console.error("MISTRAL_API_KEY is missing");
            return NextResponse.json({ error: 'Server misconfiguration: Missing API Key' }, { status: 500 });
        }

        if (!action) {
            return NextResponse.json({ error: 'Action is required' }, { status: 400 });
        }

        if (!characterId || !userId) {
            return NextResponse.json({ error: 'Character ID and User ID are required' }, { status: 400 });
        }

        // 1. Save User Action to History
        const { error: userMsgError } = await supabase
            .from('narrative_history')
            .insert({
                user_id: userId,
                character_id: characterId,
                role: 'user',
                content: action
            });

        if (userMsgError) {
            console.error('Failed to save user message:', userMsgError);
        }

        // 2. Fetch Recent History
        const { data: historyData } = await supabase
            .from('narrative_history')
            .select('role, content')
            .eq('character_id', characterId)
            .order('created_at', { ascending: false })
            .limit(10);

        const history = historyData ? [...historyData].reverse() : [];

        // 3. Call Mistral
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.map((msg: any) => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content
            })),
            { role: 'user', content: `Player Action: ${action}\n\nRespond as the Dungeon Master in JSON format.` }
        ];

        let responseText = "";
        try {
            // Mistral v1+ Node SDK
            const chatResponse = await mistral.chat.complete({
                model: 'mistral-small-latest',
                messages: messages as any,
                responseFormat: { type: 'json_object' }
            });

            // Handle different possible response structures from SDK
            if (chatResponse.choices && chatResponse.choices.length > 0) {
                responseText = chatResponse.choices[0].message.content as string;
            } else {
                throw new Error("Invalid response from Mistral");
            }

        } catch (mistralError) {
            console.error("Mistral API Error:", mistralError);
            throw new Error("Failed to communicate with AI Narrator");
        }

        // 4. Parse Response & Generate Image
        let parsedResponse: any = {};
        let narrative = responseText;
        let imagePrompt = "";
        let animations = {
            flickering_light: false, windy_foliage: false, rain: false, snow: false,
            fog: false, embers: false, lightning: false
        };

        try {
            // Attempt to extract JSON from markdown or raw text by finding the first { and last }
            const startIndex = responseText.indexOf('{');
            const endIndex = responseText.lastIndexOf('}');

            if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                const jsonStr = responseText.substring(startIndex, endIndex + 1);

                parsedResponse = JSON.parse(jsonStr);
                narrative = parsedResponse.narrative || responseText;
                imagePrompt = parsedResponse.imagePrompt || "";
                animations = { ...animations, ...parsedResponse.animations };
            } else {
                console.warn("No JSON braces found in response");
                narrative = responseText;
            }
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            narrative = responseText; // Ensure narrative degrades gracefully on error
        }

        // --- Handle Game State Updates ---
        const gameStateUpdates = parsedResponse.gameStateUpdates || {};
        const hpChange = gameStateUpdates.hpChange ?? 0;
        const xpEarned = gameStateUpdates.xpEarned ?? 0;
        const newItems = gameStateUpdates.newItems;
        const removedItems = gameStateUpdates.removedItems;

        console.log(`Game state updates from AI: HP=${hpChange}, XP=${xpEarned}, items=${JSON.stringify(newItems || [])}`);

        if (hpChange !== 0 || xpEarned !== 0) {
            const { data: charData, error: fetchErr } = await supabase
                .from('characters')
                .select('current_hp, xp, constitution')
                .eq('id', characterId)
                .single();

            if (fetchErr) {
                console.error('Failed to fetch character for update:', fetchErr);
            } else if (charData) {
                const maxHp = 10 + Math.floor(((charData.constitution || 10) - 10) / 2);
                const currentHp = charData.current_hp ?? maxHp;
                const newHp = Math.max(0, Math.min(maxHp, currentHp + hpChange));
                const newXp = (charData.xp || 0) + xpEarned;

                console.log(`Updating character: HP ${currentHp} → ${newHp}, XP ${charData.xp || 0} → ${newXp}`);

                const { error: updateErr } = await supabase
                    .from('characters')
                    .update({ current_hp: newHp, xp: newXp })
                    .eq('id', characterId);

                if (updateErr) {
                    console.error('Failed to update character stats:', updateErr);
                } else {
                    console.log('Character stats updated successfully');
                }
            }
        }

        if (newItems && Array.isArray(newItems)) {
            for (const itemName of newItems) {
                const { data: template } = await supabase
                    .from('item_templates')
                    .select('id')
                    .ilike('name', `%${itemName}%`)
                    .limit(1)
                    .single();

                if (template) {
                    await supabase
                        .from('character_inventory')
                        .insert({ character_id: characterId, item_template_id: template.id });
                    console.log(`Added item: ${itemName}`);
                }
            }
        }

        let imageUrl = "";
        if (imagePrompt) {
            console.log(`Generating image for: ${imagePrompt}`);
            if (!bytezModel) {
                console.log("No Bytez API key found, skipping image generation.");
            } else {
                try {
                    // Bytez Documented Syntax
                    const { error, output } = await bytezModel.run(imagePrompt);

                    if (error) {
                        console.error("Bytez API Error returned:", error);
                    } else if (output) {
                        // Some Bytez models return an array of images, others just a base64 string
                        if (Array.isArray(output) && output.length > 0) {
                            imageUrl = `data:image/png;base64,${output[0]}`;
                        } else if (typeof output === 'string') {
                            // If it's already a Data URI or URL
                            imageUrl = output.startsWith('data:') || output.startsWith('http')
                                ? output
                                : `data:image/png;base64,${output}`;
                        }
                    }
                    console.log("Image generation result:", imageUrl ? "Success" : "Failed");
                } catch (imgError) {
                    console.error("Image Generation Exception:", imgError);
                }
            }
        }
        const { error: aiMsgError } = await supabase
            .from('narrative_history')
            .insert({
                user_id: userId,
                character_id: characterId,
                role: 'assistant',
                content: narrative, // Store just the narrative text
                metadata: {
                    imageUrl: imageUrl,
                    animations: animations,
                    type: 'narrative'
                }
            });

        if (aiMsgError) {
            console.error('Failed to save AI message:', aiMsgError);
        }

        return NextResponse.json({
            response: narrative,
            imageUrl: imageUrl,
            animations: animations
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
