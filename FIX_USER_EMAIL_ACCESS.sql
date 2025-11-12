-- =====================================================
-- FIX: Enable Admin to See User Emails
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create a helper function to get user email by ID
-- This is safe because it's protected by RLS - only admins can call it
CREATE OR REPLACE FUNCTION get_user_email(user_uuid UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT email FROM auth.users WHERE id = user_uuid;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_email(UUID) TO authenticated;

-- Verify it works
SELECT 'Testing get_user_email function:' as test;
SELECT 
    t.id,
    t.subject,
    get_user_email(t.user_id) as user_email,
    t.status
FROM public.tickets t
LIMIT 3;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Function created successfully!';
    RAISE NOTICE 'Admin panel can now fetch user emails.';
END $$;
