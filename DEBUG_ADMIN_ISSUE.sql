-- =====================================================
-- DEBUG AND FIX ADMIN ACCESS ISSUE
-- Run each section step by step in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- SECTION 1: CHECK CURRENT USER
-- =====================================================
SELECT 'YOUR USER INFORMATION:' as info;
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- =====================================================
-- SECTION 2: CHECK EXISTING ADMIN ROLES
-- =====================================================
SELECT 'EXISTING ADMIN ROLES:' as info;
SELECT 
    ur.id,
    ur.user_id,
    u.email,
    ur.role,
    ur.created_at
FROM public.user_roles ur
LEFT JOIN auth.users u ON u.id = ur.user_id
ORDER BY ur.created_at DESC;

-- =====================================================
-- SECTION 3: CHECK ALL TICKETS
-- =====================================================
SELECT 'ALL TICKETS IN DATABASE:' as info;
SELECT 
    id,
    user_id,
    subject,
    status,
    created_at
FROM public.tickets
ORDER BY created_at DESC;

-- =====================================================
-- SECTION 4: MAKE YOURSELF AN ADMIN
-- Copy your user_id from SECTION 1 above and replace it below
-- Then uncomment and run this:
-- =====================================================

-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('YOUR_USER_ID_FROM_SECTION_1', 'admin')
-- ON CONFLICT (user_id, role) DO UPDATE
-- SET created_at = NOW();

-- =====================================================
-- SECTION 5: VERIFY ADMIN WAS CREATED
-- Replace with your user_id again
-- =====================================================

-- SELECT 'VERIFICATION - YOUR ADMIN STATUS:' as info;
-- SELECT 
--     ur.user_id,
--     u.email,
--     ur.role,
--     ur.created_at
-- FROM public.user_roles ur
-- JOIN auth.users u ON u.id = ur.user_id
-- WHERE ur.user_id = 'YOUR_USER_ID_FROM_SECTION_1';

-- =====================================================
-- SECTION 6: TEST RLS POLICIES
-- This tests if the admin policy is working
-- Replace with your user_id
-- =====================================================

-- SET request.jwt.claims TO '{"sub": "YOUR_USER_ID_FROM_SECTION_1"}';
-- SELECT 'TESTING ADMIN ACCESS - Should see all tickets:' as info;
-- SELECT COUNT(*) as total_tickets FROM public.tickets;

-- =====================================================
-- TROUBLESHOOTING: If still not working, reset RLS policies
-- =====================================================

-- -- Drop all existing policies
-- DROP POLICY IF EXISTS "Admins can view all tickets" ON public.tickets;
-- DROP POLICY IF EXISTS "Admins can update all tickets" ON public.tickets;
-- DROP POLICY IF EXISTS "Admins can delete tickets" ON public.tickets;

-- -- Recreate admin policies
-- CREATE POLICY "Admins can view all tickets"
--     ON public.tickets FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.user_roles
--             WHERE user_roles.user_id = auth.uid()
--             AND user_roles.role = 'admin'
--         )
--     );

-- CREATE POLICY "Admins can update all tickets"
--     ON public.tickets FOR UPDATE
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.user_roles
--             WHERE user_roles.user_id = auth.uid()
--             AND user_roles.role = 'admin'
--         )
--     );

-- CREATE POLICY "Admins can delete tickets"
--     ON public.tickets FOR DELETE
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.user_roles
--             WHERE user_roles.user_id = auth.uid()
--             AND user_roles.role = 'admin'
--         )
--     );

-- =====================================================
-- INSTRUCTIONS:
-- =====================================================
-- 1. Run SECTION 1 to get your user_id
-- 2. Run SECTION 2 to see if you're already an admin
-- 3. Run SECTION 3 to see if tickets exist
-- 4. Copy your user_id and paste it into SECTION 4
-- 5. Uncomment and run SECTION 4 to make yourself admin
-- 6. Uncomment and run SECTION 5 to verify
-- 7. Refresh your browser and try /admin/tickets again
-- 8. If still not working, uncomment and run SECTION 6 (troubleshooting)
