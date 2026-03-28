import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Bytez from 'bytez.js';

const BYTEZ_KEY = process.env.BYTEZ_API_KEY || '';

let bytezModel: any = null;
if (BYTEZ_KEY) {
    const bytez = new Bytez(BYTEZ_KEY);
    bytezModel = bytez.model('google/imagen-4.0-generate-001');
}

// Use service role key so we can update the characters table from the server
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { characterId, name, characterClass, race, allegiance } = await req.json();

        if (!characterId) {
            return NextResponse.json({ error: 'characterId is required' }, { status: 400 });
        }

        if (!bytezModel) {
            return NextResponse.json({ error: 'Image generation is not configured.' }, { status: 503 });
        }

        // Build a detailed portrait prompt
        const prompt = `Dark fantasy RPG character portrait, ${name}, a ${race || allegiance || 'mysterious'} ${characterClass}. 
Dramatic lighting, amber and shadow tones, detailed face, hooded cloak or armor fitting the class, 
cinematic painting style, highly detailed, fantasy art. Dark background with mystical atmosphere.`;

        console.log(`Generating portrait for: ${name} (${characterClass})`);

        const { error, output } = await bytezModel.run(prompt);

        if (error) {
            console.error('Bytez portrait error:', error);
            return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
        }

        let imageUrl = '';
        if (Array.isArray(output) && output.length > 0) {
            imageUrl = `data:image/png;base64,${output[0]}`;
        } else if (typeof output === 'string') {
            imageUrl = output.startsWith('data:') || output.startsWith('http')
                ? output
                : `data:image/png;base64,${output}`;
        }

        if (!imageUrl) {
            return NextResponse.json({ error: 'No image returned from generator' }, { status: 500 });
        }

        // Save the new portrait URL to the characters table
        const { error: dbError } = await supabaseAdmin
            .from('characters')
            .update({ avatar_url: imageUrl })
            .eq('id', characterId);

        if (dbError) {
            console.error('Failed to save portrait:', dbError);
            // Still return the image — don't block the user
        }

        return NextResponse.json({ imageUrl });

    } catch (err: any) {
        console.error('Portrait generation error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
