-- =====================================================
-- DEBUG: Check Admin Access and RLS Policies
-- Run this in Supabase SQL Editor
-- =====================================================

-- Check current RLS policies on tickets table
SELECT '========================================' as separator;
SELECT '📋 CURRENT RLS POLICIES:' as info;
SELECT '========================================' as separator;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as "USING clause",
    with_check as "WITH CHECK clause"
FROM pg_policies
WHERE tablename = 'tickets'
ORDER BY policyname;

-- Check who is admin
SELECT '========================================' as separator;
SELECT '👥 ADMIN USERS:' as info;
SELECT '========================================' as separator;

SELECT 
    u.id,
    u.email,
    ur.role,
    ur.created_at as admin_since
FROM auth.users u
INNER JOIN public.user_roles ur ON ur.user_id = u.id
WHERE ur.role = 'admin';

-- Check all tickets
SELECT '========================================' as separator;
SELECT '🎫 ALL TICKETS:' as info;
SELECT '========================================' as separator;

SELECT 
    id,
    user_id,
    subject,
    status,
    created_at
FROM public.tickets
ORDER BY created_at DESC;

-- Test if admin can see all tickets (manual simulation)
SELECT '========================================' as separator;
SELECT '🔍 ADMIN ACCESS TEST:' as info;
SELECT '========================================' as separator;

-- This simulates what getAllTickets() should return for an admin
SELECT 
    COUNT(*) as total_tickets,
    COUNT(DISTINCT user_id) as unique_users
FROM public.tickets;

-- Check for any RLS errors
SELECT '========================================' as separator;
SELECT '⚠️ POTENTIAL ISSUES:' as info;
SELECT '========================================' as separator;

-- Check if RLS is enabled
SELECT 
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'tickets';

-- Final advice
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '📋 DIAGNOSIS COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Check the results above:';
    RAISE NOTICE '1. RLS Policies - Should show "Users can view own tickets or admins see all"';
    RAISE NOTICE '2. Admin Users - Should show your email (21naimish21@gmail.com)';
    RAISE NOTICE '3. All Tickets - Should show all tickets in the system';
    RAISE NOTICE '4. Admin Access Test - Should show total count';
    RAISE NOTICE '';
    RAISE NOTICE 'If any of these are wrong, re-run FIX_EVERYTHING_NOW.sql';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
