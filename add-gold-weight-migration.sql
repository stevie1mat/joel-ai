-- Add gold to characters and weight to item_templates
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS gold INTEGER DEFAULT 0;

ALTER TABLE public.item_templates 
ADD COLUMN IF NOT EXISTS weight NUMERIC(6,2) DEFAULT 1.0;
