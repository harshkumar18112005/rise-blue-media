-- Quick test queries for troubleshooting

-- 1. Get your user ID (you'll need this)
SELECT id, email FROM auth.users;

-- 2. Make yourself an admin (replace YOUR_USER_ID)
-- INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_ID', 'admin');

-- 3. Check if you're an admin now
SELECT * FROM public.user_roles;

-- 4. Check all tickets
SELECT * FROM public.tickets;

-- 5. Test if admin can see tickets (replace YOUR_USER_ID)
-- SELECT EXISTS (
--   SELECT 1 FROM public.user_roles
--   WHERE user_id = 'YOUR_USER_ID' AND role = 'admin'
-- ) as is_admin;
