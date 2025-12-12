
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface InventoryItem {
    id: string; // inventory instance id
    quantity: number;
    is_equipped: boolean;
    template: {
        name: string;
        description: string;
        type: string;
        rarity: string;
        cost: string;
        image_id?: string;
    };
}

interface InventoryPanelProps {
    characterId: string;
}

export default function InventoryPanel({ characterId }: InventoryPanelProps) {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            const { data, error } = await supabase
                .from('character_inventory')
                .select(`
                    id, quantity, is_equipped,
                    template:item_templates (
                        name, description, type, rarity, cost, image_id
                    )
                `)
                .eq('character_id', characterId);

            if (data) {
                // @ts-ignore - Supabase types join inference can be tricky
                setItems(data);
            }
            setLoading(false);
        };

        fetchInventory();
    }, [characterId]);

    if (loading) {
        return <div className="p-4 text-center text-zinc-500 animate-pulse">Loading supplies...</div>;
    }

    if (items.length === 0) {
        return (
            <div className="p-8 text-center bg-black/90 border border-[#ef4444]/30 rounded-lg shadow-2xl backdrop-blur-md">
                <h3 className="text-[#ef4444] font-bold mb-4 font-[family-name:var(--font-cinzel)]">INVENTORY</h3>
                <p className="text-zinc-500 text-sm">Your satchel is empty.</p>
            </div>
        );
    }

    return (
        <div className="bg-black/90 border border-[#ef4444]/30 rounded-lg shadow-2xl backdrop-blur-md overflow-hidden flex flex-col max-h-[500px]">
            <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="text-[#ef4444] font-bold font-[family-name:var(--font-cinzel)] tracking-widest">INVENTORY</h3>
            </div>

            <div className="p-2 overflow-y-auto space-y-2">
                {items.map((item) => (
                    <div key={item.id} className="bg-zinc-900/50 p-3 rounded border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer relative overflow-hidden">
                        <div className="flex gap-3">
                            <div className={`w-12 h-12 rounded flex items-center justify-center text-xs font-bold border ${getRarityColor(item.template.rarity)} bg-black/50`}>
                                {/* Placeholder for Item Icon */}
                                {item.template.image_id ? 'IMG' : '???'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-bold text-zinc-200 truncate pr-2">{item.template.name}</h4>
                                    {item.quantity > 1 && (
                                        <span className="text-[10px] bg-zinc-700 text-white px-1.5 rounded-full">x{item.quantity}</span>
                                    )}
                                </div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                                    {item.template.type} • {item.template.rarity}
                                </div>
                                <p className="text-xs text-zinc-400 line-clamp-2">{item.template.description}</p>
                            </div>
                        </div>

                        {/* Equip status */}
                        {item.is_equipped && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]" title="Equipped" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function getRarityColor(rarity: string) {
    switch (rarity.toLowerCase()) {
        case 'common': return 'border-zinc-600 text-zinc-400';
        case 'uncommon': return 'border-green-600 text-green-400';
        case 'rare': return 'border-blue-500 text-blue-400';
        case 'very rare': return 'border-purple-500 text-purple-400';
        case 'legendary': return 'border-orange-500 text-orange-400';
        default: return 'border-zinc-600';
    }
}
