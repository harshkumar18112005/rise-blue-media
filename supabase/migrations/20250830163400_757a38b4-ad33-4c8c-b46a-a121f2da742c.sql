
-- Add documentation column to services table
ALTER TABLE public.services 
ADD COLUMN documentation TEXT;

-- Add some sample documentation for existing services (optional)
UPDATE public.services 
SET documentation = 'Detailed documentation for ' || title || '. This service provides comprehensive solutions with step-by-step guidance and professional support.'
WHERE documentation IS NULL;
