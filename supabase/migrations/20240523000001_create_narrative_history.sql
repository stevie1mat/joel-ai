-- Create narrative_history table
CREATE TABLE IF NOT EXISTS public.narrative_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster retrieval of history by user/character
CREATE INDEX IF NOT EXISTS idx_narrative_history_user_char ON public.narrative_history(user_id, character_id);

-- RLS Policies
ALTER TABLE public.narrative_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own narrative history"
    ON public.narrative_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own narrative history"
    ON public.narrative_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
