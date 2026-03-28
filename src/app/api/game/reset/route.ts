
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { characterId, userId } = await req.json();

        if (!characterId || !userId) {
            return NextResponse.json({ error: 'Character ID and User ID are required' }, { status: 400 });
        }

        // 1. Delete all narrative history for this character
        const { error: histError } = await supabase
            .from('narrative_history')
            .delete()
            .eq('character_id', characterId);

        if (histError) throw histError;

        // 2. Delete all character inventory
        const { error: invError } = await supabase
            .from('character_inventory')
            .delete()
            .eq('character_id', characterId);

        if (invError) throw invError;

        // 3. Reset character HP and XP
        // First get character to find starting stats or defaults
        const { data: char } = await supabase
            .from('characters')
            .select('constitution')
            .eq('id', characterId)
            .single();

        const maxHp = 10 + Math.floor(((char?.constitution || 10) - 10) / 2);

        const { error: charError } = await supabase
            .from('characters')
            .update({
                current_hp: maxHp,
                xp: 0,
                level: 1
            })
            .eq('id', characterId);

        if (charError) throw charError;

        return NextResponse.json({ success: true, message: 'Character progress has been reset.' });

    } catch (error: any) {
        console.error('Reset Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to reset character' }, { status: 500 });
    }
}
