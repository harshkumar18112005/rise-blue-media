-- =====================================================
-- COMPLETE TICKET SYSTEM WITH DISCUSSION FEATURE
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: DROP OLD TABLES (if they exist with wrong schema)
-- =====================================================

DROP TABLE IF EXISTS public.ticket_messages CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- =====================================================
-- STEP 2: CREATE USER ROLES TABLE
-- =====================================================

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

GRANT SELECT ON public.user_roles TO authenticated;

-- =====================================================
-- STEP 3: CREATE TICKETS TABLE (NEW SCHEMA)
-- =====================================================

CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id TEXT,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at DESC);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view own tickets"
    ON public.tickets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
    ON public.tickets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all tickets"
    ON public.tickets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all tickets"
    ON public.tickets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete tickets"
    ON public.tickets FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

GRANT SELECT, INSERT, UPDATE ON public.tickets TO authenticated;

-- =====================================================
-- STEP 4: CREATE TICKET_MESSAGES TABLE (DISCUSSION FEATURE)
-- =====================================================

CREATE TABLE public.ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_created_at ON public.ticket_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages for their own tickets
CREATE POLICY "Users can view messages on own tickets"
    ON public.ticket_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tickets
            WHERE tickets.id = ticket_messages.ticket_id
            AND tickets.user_id = auth.uid()
        )
    );

-- Users can insert messages on their own tickets
CREATE POLICY "Users can create messages on own tickets"
    ON public.ticket_messages FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.tickets
            WHERE tickets.id = ticket_messages.ticket_id
            AND tickets.user_id = auth.uid()
        )
    );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
    ON public.ticket_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Admins can insert messages on any ticket
CREATE POLICY "Admins can create messages on any ticket"
    ON public.ticket_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Admins can update and delete messages
CREATE POLICY "Admins can update messages"
    ON public.ticket_messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete messages"
    ON public.ticket_messages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ticket_messages TO authenticated;

-- =====================================================
-- STEP 5: CREATE STORAGE BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('ticket-attachments', 'ticket-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view ticket attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload ticket attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own attachments" ON storage.objects;

-- Storage policies
CREATE POLICY "Anyone can view ticket attachments"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'ticket-attachments');

CREATE POLICY "Authenticated users can upload ticket attachments"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'ticket-attachments' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own attachments"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'ticket-attachments' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own attachments"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'ticket-attachments' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check tickets table
SELECT 'TICKETS TABLE:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tickets' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check ticket_messages table
SELECT 'TICKET_MESSAGES TABLE:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ticket_messages' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check user_roles table
SELECT 'USER_ROLES TABLE:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_roles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ TICKET SYSTEM WITH DISCUSSION FEATURE CREATED SUCCESSFULLY!';
    RAISE NOTICE '📋 Features:';
    RAISE NOTICE '1. Tickets table - Main ticket storage';
    RAISE NOTICE '2. Ticket_messages table - Discussion/conversation feature';
    RAISE NOTICE '3. User_roles table - Admin management';
    RAISE NOTICE '4. Storage bucket - File attachments';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Next: Create an admin user and test the system!';
END $$;
