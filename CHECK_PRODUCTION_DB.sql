-- =====================================================
-- CHECK PRODUCTION DATABASE STATUS
-- Run this in Supabase SQL Editor to see what exists
-- =====================================================

-- Check if user_roles table exists
SELECT 
    'user_roles table' as "Check",
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_roles'
        ) THEN '✅ EXISTS'
        ELSE '❌ DOES NOT EXIST - Run PRODUCTION_SETUP.sql'
    END as "Status";

-- Check if tickets table exists
SELECT 
    'tickets table' as "Check",
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'tickets'
        ) THEN '✅ EXISTS'
        ELSE '❌ DOES NOT EXIST - Run PRODUCTION_SETUP.sql'
    END as "Status";

-- Check if ticket_messages table exists
SELECT 
    'ticket_messages table' as "Check",
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'ticket_messages'
        ) THEN '✅ EXISTS'
        ELSE '❌ DOES NOT EXIST - Run PRODUCTION_SETUP.sql'
    END as "Status";

-- Check if you are an admin
SELECT 
    'Admin Status for 21naimish21@gmail.com' as "Check",
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN auth.users u ON u.id = ur.user_id
            WHERE u.email = '21naimish21@gmail.com'
            AND ur.role = 'admin'
        ) THEN '✅ YOU ARE AN ADMIN'
        WHEN NOT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user_roles'
        ) THEN '❌ user_roles table does not exist - Run PRODUCTION_SETUP.sql'
        ELSE '❌ NOT AN ADMIN - Run PRODUCTION_SETUP.sql'
    END as "Status";

-- List all users
SELECT 
    '=== ALL USERS ===' as info,
    email,
    created_at
FROM auth.users
ORDER BY created_at;
