-- Make ABSOLUTELY SURE you're admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('b24dbdfe-f527-4ef0-965b-3e56bcbb58d9', 'admin')
ON CONFLICT (user_id, role) 
DO UPDATE SET role = 'admin', created_at = now();

-- Verify
SELECT 
    u.email,
    ur.role,
    ur.created_at,
    '✅ YOU ARE ADMIN' as status
FROM auth.users u
JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = '21naimish21@gmail.com';
