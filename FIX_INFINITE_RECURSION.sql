-- =====================================================
-- FIX INFINITE RECURSION IN user_roles POLICY
-- The "Admins can view all roles" policy is checking user_roles 
-- while querying user_roles = INFINITE LOOP!
-- =====================================================

-- 1. DROP the problematic policy
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- 2. Keep only the simple policy (users can see their own role)
-- This is enough! The admin check happens in OTHER tables (tickets, etc.)
-- Don't need admin to see all roles in user_roles table

-- 3. Verify policies
SELECT 
    policyname,
    cmd
FROM pg_policies
WHERE tablename = 'user_roles';

-- 4. Test - you should now be able to query user_roles
SELECT 
    u.email,
    ur.role,
    '✅ FIXED - No more infinite recursion!' as status
FROM auth.users u
JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = '21naimish21@gmail.com';
