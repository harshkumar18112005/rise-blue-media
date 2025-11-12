-- =====================================================
-- PRODUCTION SETUP - Run this in Supabase SQL Editor
-- Project: cuwcozpyuhfzaacxhdbv (rsb - Rise Blue Media)
-- =====================================================

-- =====================================================
-- STEP 1: Create user_roles table if not exists
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY "Users can view own role"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
    ON public.user_roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- =====================================================
-- STEP 2: Create tickets table if not exists
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can view own tickets or admins see all" ON public.tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can create own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can update own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can update all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can delete own tickets" ON public.tickets;

-- Create policies
CREATE POLICY "Users can view own tickets or admins see all"
    ON public.tickets FOR SELECT
    USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Users can create own tickets"
    ON public.tickets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets"
    ON public.tickets FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all tickets"
    ON public.tickets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Users can delete own tickets"
    ON public.tickets FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- STEP 3: Create ticket_messages table if not exists
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages for their tickets or admins see all" ON public.ticket_messages;
DROP POLICY IF EXISTS "Users can create messages for their tickets" ON public.ticket_messages;
DROP POLICY IF EXISTS "Admins can create messages for all tickets" ON public.ticket_messages;

-- Create policies
CREATE POLICY "Users can view messages for their tickets or admins see all"
    ON public.ticket_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tickets
            WHERE tickets.id = ticket_messages.ticket_id
            AND (
                tickets.user_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.user_roles
                    WHERE user_roles.user_id = auth.uid()
                    AND user_roles.role = 'admin'
                )
            )
        )
    );

CREATE POLICY "Users can create messages for their tickets"
    ON public.ticket_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tickets
            WHERE tickets.id = ticket_messages.ticket_id
            AND tickets.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can create messages for all tickets"
    ON public.ticket_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- =====================================================
-- STEP 4: Make 21naimish21@gmail.com an admin
-- =====================================================
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = '21naimish21@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- =====================================================
-- STEP 5: Verify setup
-- =====================================================
SELECT 
    '✅ Admin Status' as "Check",
    u.email as "Email",
    ur.role as "Role"
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE u.email = '21naimish21@gmail.com';
