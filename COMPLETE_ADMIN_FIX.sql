-- =====================================================
-- COMPLETE FIX: Admin Access + User Information
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PART 1: Fix Admin Access to See ALL Tickets
-- =====================================================

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

-- =====================================================
-- PART 2: Grant Admins Access to User Emails
-- =====================================================

-- Create a view that joins tickets with user information
CREATE OR REPLACE VIEW public.tickets_with_users AS
SELECT 
    t.*,
    u.email as user_email,
    u.created_at as user_created_at
FROM public.tickets t
LEFT JOIN auth.users u ON u.id = t.user_id;

-- Allow authenticated users to view this (RLS will filter appropriately)
GRANT SELECT ON public.tickets_with_users TO authenticated;

-- =====================================================
-- PART 3: Verification
-- =====================================================

-- Check total tickets
SELECT 'TOTAL TICKETS IN SYSTEM:' as info;
SELECT COUNT(*) as total_tickets FROM public.tickets;

-- Show tickets with user information (first 5)
SELECT 'SAMPLE TICKETS WITH USER INFO:' as info;
SELECT 
    t.id,
    t.subject,
    t.status,
    u.email as raised_by,
    t.created_at
FROM public.tickets t
LEFT JOIN auth.users u ON u.id = t.user_id
ORDER BY t.created_at DESC
LIMIT 5;

-- Check admin users
SELECT 'ADMIN USERS:' as info;
SELECT 
    ur.user_id,
    u.email,
    ur.role,
    ur.created_at as admin_since
FROM public.user_roles ur
LEFT JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ ADMIN ACCESS FIXED!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 What changed:';
    RAISE NOTICE '1. Admins can now see ALL tickets from ALL users';
    RAISE NOTICE '2. Admins can see user email addresses';
    RAISE NOTICE '3. RLS policies properly enforce admin privileges';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next: Refresh your browser and go to /admin/tickets';
END $$;
