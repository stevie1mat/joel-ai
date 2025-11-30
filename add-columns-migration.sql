-- Add new columns to existing characters table
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS allegiance TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
