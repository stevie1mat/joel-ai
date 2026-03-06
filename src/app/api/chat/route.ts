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
    bytezModel = bytez.model("google/imagen-4.0-generate-001");
}

const SYSTEM_PROMPT = `
You are the Dungeon Master for a text-based RPG called Aether Chronicles, set in a dark fantasy world with amber-lit mystical themes.
Your role is to narrate the story, describe the environment, and determine the outcomes of the player's actions.
Be descriptive, immersive, and fair. If the player attempts an action that requires a skill check, look for a "[Rolled: X]" tag in their input.
If present, USE THAT VALUE to determine the outcome (e.g., high roll = success, low roll = failure).
If no roll is provided, you may simulate one if needed.
Keep your responses concise but evocative.

IMPORTANT: Along with your narrative response, you MUST also provide a brief image description for scene visualization AND environmental animation flags.
Format your response as JSON with three fields:
{
  "narrative": "Your narrative response here...",
  "imagePrompt": "Brief visual description for AI image generation (e.g., 'dark fantasy tavern with amber lighting, mysterious hooded figures')",
  "animations": {
    "flickering_light": true/false, // Torches, fires, unstable light
    "windy_foliage": true/false, // Wind, moving trees, dust
    "rain": true/false, // Rain, storms, wet environments
    "snow": true/false, // Snow, cold environments
    "fog": true/false, // Mist, fog, steam, spooky atmosphere
    "embers": true/false, // Fire particles, ash, destruction
    "lightning": true/false // Thunderstorms, magical flashes
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
                model: 'mistral-tiny',
                messages: messages as any,
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
