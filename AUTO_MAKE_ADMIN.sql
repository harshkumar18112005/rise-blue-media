-- =====================================================
-- AUTO-ADMIN: Make the first user an admin automatically
-- Run this in Supabase SQL Editor
-- =====================================================

-- This will make the oldest user (probably you) an admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify it worked
SELECT 'YOUR ADMIN STATUS:' as result;
SELECT u.email, ur.role, ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';

-- Also show all tickets to confirm they exist
SELECT 'ALL TICKETS:' as result;
SELECT id, subject, status, created_at
FROM public.tickets
ORDER BY created_at DESC;
