-- Create item_templates table (Global items)
CREATE TABLE IF NOT EXISTS public.item_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- Weapon, Armor, Potion, etc.
    rarity TEXT DEFAULT 'common',
    cost TEXT, -- e.g., "50gp"
    image_id TEXT, -- Link to visual canon
    stats JSONB DEFAULT '{}'::jsonb, -- e.g., { "damage": "1d8", "ac": 2 }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enabled RLS for read-only access to templates
ALTER TABLE public.item_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view item templates" ON public.item_templates FOR SELECT USING (true);


-- Create character_inventory table
CREATE TABLE IF NOT EXISTS public.character_inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    item_template_id UUID NOT NULL REFERENCES public.item_templates(id),
    instance_id UUID DEFAULT gen_random_uuid(), -- Unique ID for this specific item instance (if needed for unique properties)
    quantity INTEGER DEFAULT 1,
    is_equipped BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT quantity_positive CHECK (quantity > 0)
);

-- Index for faster retrieval
CREATE INDEX IF NOT EXISTS idx_char_inventory_char_id ON public.character_inventory(character_id);

-- RLS for inventory
ALTER TABLE public.character_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inventory"
    ON public.character_inventory
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.characters 
            WHERE public.characters.id = character_inventory.character_id 
            AND public.characters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own inventory"
    ON public.character_inventory
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.characters 
            WHERE public.characters.id = character_inventory.character_id 
            AND public.characters.user_id = auth.uid()
        )
    );

-- Seed some initial items
INSERT INTO public.item_templates (name, type, rarity, cost, description, image_id) VALUES
('Potion of Healing', 'Potion', 'common', '50gp', 'Restores 2d4+2 Hit Points.', 'item_potion_healing'),
('Longsword', 'Weapon', 'common', '15gp', 'Versatile (1d8/1d10) slashing damage.', 'item_sword_basic'),
('Leather Armor', 'Armor', 'common', '10gp', '11 + Dex Modifier AC.', 'item_armor_leather'),
('Torch', 'Gear', 'common', '1cp', 'Burns for 1 hour. Provides bright light in a 20-foot radius.', 'item_torch');
