import { NextRequest, NextResponse } from 'next/server';
import Bytez from 'bytez.js';

const BYTEZ_KEY = process.env.BYTEZ_API_KEY || '';

let bytezModel: any = null;
if (BYTEZ_KEY) {
    const bytez = new Bytez(BYTEZ_KEY);
    bytezModel = bytez.model('google/imagen-4.0-generate-001');
}

export async function POST(req: NextRequest) {
    try {
        const { name, characterClass, race, allegiance } = await req.json();

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

        return NextResponse.json({ imageUrl });

    } catch (err: any) {
        console.error('Portrait generation error:', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
