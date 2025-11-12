-- =====================================================
-- SETUP ADMIN USER
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Check all users
SELECT 'ALL USERS:' as info;
SELECT id, email, created_at FROM auth.users;

-- Step 2: Check existing admin roles
SELECT 'EXISTING ADMIN ROLES:' as info;
SELECT ur.id, ur.user_id, u.email, ur.role 
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id;

-- Step 3: Make YOUR user an admin (replace YOUR_USER_ID with your actual user ID from step 1)
-- Uncomment and run after getting your user ID:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('YOUR_USER_ID_HERE', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- Step 4: Verify the admin was created
-- SELECT 'VERIFICATION - YOUR ADMIN STATUS:' as info;
-- SELECT ur.user_id, u.email, ur.role, ur.created_at
-- FROM public.user_roles ur
-- JOIN auth.users u ON u.id = ur.user_id
-- WHERE ur.user_id = 'YOUR_USER_ID_HERE';
