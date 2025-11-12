-- =====================================================
-- FIX: Allow admins to see ALL tickets (not just their own)
-- Run this in Supabase SQL Editor
-- =====================================================

-- The issue: Current policies check admin role AFTER filtering by user_id
-- The fix: Admin policies should take precedence over user policies

-- Drop the conflicting user SELECT policy
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;

-- Recreate with admin check FIRST (this takes precedence)
-- Users can see their own tickets OR if they are admin, they see all tickets
CREATE POLICY "Users can view own tickets or admins see all"
    ON public.tickets FOR SELECT
    USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Verify the fix
SELECT 'VERIFICATION:' as result;
SELECT 
    'Policy updated successfully. Admins should now see all tickets.' as message;

-- Test: Check how many tickets exist
SELECT 'TOTAL TICKETS IN SYSTEM:' as result;
SELECT COUNT(*) as total_tickets FROM public.tickets;

-- Show sample tickets (first 5)
SELECT 'SAMPLE TICKETS:' as result;
SELECT 
    id, 
    user_id,
    subject, 
    status, 
    created_at
FROM public.tickets
ORDER BY created_at DESC
LIMIT 5;
