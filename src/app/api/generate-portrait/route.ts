import { NextRequest, NextResponse } from 'next/server';
import { generateImageUrl, isImageGenerationConfigured } from '@/lib/image-generation';

export async function POST(req: NextRequest) {
    try {
        const { name, characterClass, race, allegiance } = await req.json();

        if (!isImageGenerationConfigured()) {
            return NextResponse.json({ error: 'Image generation is not configured.' }, { status: 503 });
        }

        // Build a detailed portrait prompt
        const prompt = `Dark fantasy RPG character portrait, ${name}, a ${race || allegiance || 'mysterious'} ${characterClass}. 
Dramatic lighting, amber and shadow tones, detailed face, hooded cloak or armor fitting the class, 
cinematic painting style, highly detailed, fantasy art. Dark background with mystical atmosphere.`;

        console.log(`Generating portrait for: ${name} (${characterClass})`);

        const imageUrl = await generateImageUrl(prompt, {
            folder: process.env.CLOUDINARY_PORTRAITS_FOLDER || 'aether-chronicles/portraits',
        });

        if (!imageUrl) {
            return NextResponse.json({ error: 'No image returned from generator' }, { status: 500 });
        }

        return NextResponse.json({ imageUrl });

    } catch (err: unknown) {
        console.error('Portrait generation error:', err);
        const message = err instanceof Error ? err.message : 'Internal Server Error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
