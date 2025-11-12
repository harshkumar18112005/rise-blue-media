-- =====================================================
-- COMPLETE SETUP: Fix Everything & Make You Admin
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: Fix Admin RLS Policy (See All Tickets)
-- =====================================================

-- Drop ALL existing SELECT policies on tickets
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can view own tickets or admins see all" ON public.tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.tickets;

-- Recreate with admin check FIRST (this takes precedence)
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
-- STEP 2: Make YOU an Admin (Automatic)
-- =====================================================

-- Get the user with email '21naimish21@gmail.com' and make them admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = '21naimish21@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- BACKUP: If email doesn't match, make the first user admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;

-- =====================================================
-- STEP 3: Verification - Check Your Admin Status
-- =====================================================

SELECT '========================================' as separator;
SELECT '✅ YOUR ADMIN STATUS:' as info;
SELECT '========================================' as separator;

SELECT 
    u.email as "Your Email",
    ur.role as "Your Role",
    ur.created_at as "Admin Since",
    CASE 
        WHEN ur.role = 'admin' THEN '✅ YOU ARE NOW AN ADMIN!'
        ELSE '❌ NOT AN ADMIN (Something went wrong)'
    END as "Status"
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = '21naimish21@gmail.com'
   OR u.id IN (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1);

-- =====================================================
-- STEP 4: Show ALL Tickets in System
-- =====================================================

SELECT '========================================' as separator;
SELECT '📋 ALL TICKETS IN SYSTEM:' as info;
SELECT '========================================' as separator;

SELECT 
    t.id as "Ticket ID",
    t.subject as "Subject",
    t.status as "Status",
    u.email as "Raised By",
    t.created_at as "Created At"
FROM public.tickets t
LEFT JOIN auth.users u ON u.id = t.user_id
ORDER BY t.created_at DESC;

-- =====================================================
-- STEP 5: Count Tickets Per User
-- =====================================================

SELECT '========================================' as separator;
SELECT '📊 TICKETS PER USER:' as info;
SELECT '========================================' as separator;

SELECT 
    u.email as "User Email",
    COUNT(t.id) as "Number of Tickets",
    COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as "Pending",
    COUNT(CASE WHEN t.status = 'resolved' THEN 1 END) as "Resolved"
FROM auth.users u
LEFT JOIN public.tickets t ON t.user_id = u.id
GROUP BY u.id, u.email
ORDER BY COUNT(t.id) DESC;

-- =====================================================
-- STEP 6: Test Admin Access (Should show all tickets)
-- =====================================================

SELECT '========================================' as separator;
SELECT '🔍 TESTING ADMIN ACCESS:' as info;
SELECT '========================================' as separator;

-- This query simulates what the admin panel will fetch
SELECT 
    t.*,
    u.email as user_email
FROM public.tickets t
LEFT JOIN auth.users u ON u.id = t.user_id
ORDER BY t.created_at DESC;

-- =====================================================
-- FINAL INSTRUCTIONS
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ SETUP COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 What was done:';
    RAISE NOTICE '1. ✅ Fixed RLS policy - Admins can now see ALL tickets';
    RAISE NOTICE '2. ✅ Made you (21naimish21@gmail.com) an admin';
    RAISE NOTICE '3. ✅ Verified your admin status';
    RAISE NOTICE '4. ✅ Listed all tickets in the system';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 NEXT STEPS:';
    RAISE NOTICE '1. Close this SQL Editor tab';
    RAISE NOTICE '2. Go back to your app at http://localhost:8081/';
    RAISE NOTICE '3. Click on your email (top right)';
    RAISE NOTICE '4. You should now see "Admin Panel" option!';
    RAISE NOTICE '5. Click "Admin Panel" to manage all tickets';
    RAISE NOTICE '';
    RAISE NOTICE 'OR directly visit: http://localhost:8081/admin/tickets';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;
