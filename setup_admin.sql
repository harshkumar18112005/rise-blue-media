-- Quick Admin Setup Script
-- Run this in Supabase SQL Editor after you've created a user account

-- Step 1: First, view all users to get their UUID
SELECT 
    id as user_uuid,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- Step 2: Copy the UUID of the user you want to make admin, then run:
-- Replace 'YOUR_USER_UUID_HERE' with the actual UUID from Step 1

INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify the admin was added:
SELECT 
    u.email,
    u.id as user_id,
    ur.role,
    ur.created_at as role_assigned_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';

-- If you see your email listed, you're all set! 🎉
