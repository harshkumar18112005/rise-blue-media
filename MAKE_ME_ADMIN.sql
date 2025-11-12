-- =====================================================
-- IMMEDIATE FIX: Make yourself an admin
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: See all users and copy YOUR user ID
SELECT 'Step 1 - Find your user ID:' as step;
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Step 2: Replace 'YOUR_USER_ID_HERE' with your actual ID from above
-- Then uncomment the line below and run it:
-- INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_ID_HERE', 'admin') ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify you're now an admin
SELECT 'Step 3 - Verify admin status:' as step;
SELECT ur.user_id, u.email, ur.role 
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id;

-- =====================================================
-- INSTRUCTIONS:
-- 1. Run the entire script
-- 2. Look at the results of Step 1
-- 3. Copy your user UUID (looks like: 12345678-1234-1234-1234-123456789012)
-- 4. Go back to line 13 above
-- 5. Replace 'YOUR_USER_ID_HERE' with your actual UUID
-- 6. Remove the -- from the start of that line
-- 7. Run the script again
-- 8. You should see yourself as admin in Step 3 results
-- 9. Go back to your browser and refresh http://localhost:8081/admin/tickets
-- =====================================================
