-- Create characters table for Aether Chronicles
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    
    -- Ability Scores
    strength INTEGER NOT NULL,
    dexterity INTEGER NOT NULL,
    constitution INTEGER NOT NULL,
    intelligence INTEGER NOT NULL,
    wisdom INTEGER NOT NULL,
    charisma INTEGER NOT NULL,
    
    -- Character Customization
    allegiance TEXT,
    avatar_url TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_level CHECK (level >= 1 AND level <= 20),
    CONSTRAINT valid_stats CHECK (
        strength >= 1 AND strength <= 30 AND
        dexterity >= 1 AND dexterity <= 30 AND
        constitution >= 1 AND constitution <= 30 AND
        intelligence >= 1 AND intelligence <= 30 AND
        wisdom >= 1 AND wisdom <= 30 AND
        charisma >= 1 AND charisma <= 30
    )
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON public.characters(user_id);

-- Enable Row Level Security
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only read their own characters
CREATE POLICY "Users can view own characters"
    ON public.characters
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can only insert their own characters
CREATE POLICY "Users can create own characters"
    ON public.characters
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own characters
CREATE POLICY "Users can update own characters"
    ON public.characters
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can only delete their own characters
CREATE POLICY "Users can delete own characters"
    ON public.characters
    FOR DELETE
    USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER update_characters_updated_at
    BEFORE UPDATE ON public.characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
