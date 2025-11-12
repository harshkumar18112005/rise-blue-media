-- =====================================================
-- CHECK AND FIX TICKETS TABLE
-- Run this in Supabase SQL Editor
-- =====================================================

-- First, let's see if the table exists and what columns it has
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tickets' AND table_schema = 'public'
ORDER BY ordinal_position;

-- If you see different columns than expected (like 'title' instead of 'subject'),
-- then uncomment and run the following to DROP and recreate:

/*
-- Drop the old table
DROP TABLE IF EXISTS public.tickets CASCADE;

-- Now run the full APPLY_TICKETS_MIGRATION.sql again
*/
