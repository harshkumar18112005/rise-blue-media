-- =====================================================
-- DEBUG: Check what's actually in production
-- =====================================================

-- 1. Check services table and data
SELECT 'Services Table' as check_name, COUNT(*) as count FROM public.services;
SELECT * FROM public.services LIMIT 5;

-- 2. Check user_roles table
SELECT 'User Roles Table' as check_name, COUNT(*) as count FROM public.user_roles;
SELECT 
    u.email,
    ur.role,
    ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id;

-- 3. Specifically check YOUR admin status
SELECT 
    u.id as user_id,
    u.email,
    ur.role,
    CASE WHEN ur.role = 'admin' THEN '✅ YOU ARE ADMIN' ELSE '❌ NOT ADMIN' END as status
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = '21naimish21@gmail.com';

-- 4. Check tickets table
SELECT 'Tickets Table' as check_name, COUNT(*) as count FROM public.tickets;

-- 5. Check RLS policies on services
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'services';

-- 6. Check RLS policies on user_roles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'user_roles';
