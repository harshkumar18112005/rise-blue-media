-- Create user_roles table FIRST (before policies reference it)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT ON public.user_roles TO authenticated;

-- Admin policies for tickets table
-- These policies allow admins to bypass the restrictive user policies

-- Admin policy: Admins can view all tickets
CREATE POLICY "Admins can view all tickets"
    ON public.tickets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Admin policy: Admins can update all tickets (including status and admin_response)
CREATE POLICY "Admins can update all tickets"
    ON public.tickets
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Admin policy: Admins can delete tickets
CREATE POLICY "Admins can delete tickets"
    ON public.tickets
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Note: With RLS enabled and these policies in place:
-- 1. Regular users can only SELECT their own tickets
-- 2. Regular users can only INSERT tickets with their own user_id
-- 3. Regular users can UPDATE only their own tickets, and cannot change status/admin_response
-- 4. Admins (users in user_roles with role='admin') can SELECT, UPDATE, and DELETE all tickets
-- 5. The getAllTickets(), updateTicket(), and deleteTicket() functions in the app
--    will automatically be restricted by these RLS policies at the database level
