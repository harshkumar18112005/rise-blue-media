# Setup Instructions for Ticket System

## Prerequisites
- Supabase project already configured
- Supabase CLI installed
- Logged into Supabase CLI

## Step 1: Apply Database Migrations

### Option A: Using Supabase CLI (Recommended)

1. **Link your project** (if not already linked):
   ```powershell
   supabase link --project-ref YOUR_PROJECT_REF
   ```

2. **Push migrations to remote**:
   ```powershell
   supabase db push
   ```

### Option B: Manual Migration via Supabase Dashboard

If you prefer to run migrations manually:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in this order:
   - `supabase/migrations/20251112000000_create_tickets_table.sql`
   - `supabase/migrations/20251112000001_create_ticket_attachments_bucket.sql`
   - `supabase/migrations/20251112000002_create_admin_policies.sql`

## Step 2: Create Storage Bucket (if not auto-created)

1. Go to **Storage** in Supabase Dashboard
2. If `ticket-attachments` bucket doesn't exist, create it:
   - Name: `ticket-attachments`
   - Public: Yes
3. Set up storage policies (should be auto-created by migration, but verify):
   - SELECT: Public
   - INSERT: Authenticated users
   - UPDATE/DELETE: Only file owners

## Step 3: Set Up Admin User

To grant admin privileges to a user:

1. Get the user's UUID from **Authentication** → **Users** in Supabase Dashboard
2. Go to **SQL Editor** and run:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_UUID_HERE', 'admin');
   ```

## Step 4: Test the System

### For Users:
1. Navigate to any service detail page
2. Click "Raise a Ticket" button
3. Fill out the form with:
   - Subject
   - Description
   - Attachments (optional)
4. Submit and note the generated Ticket ID
5. Go to "My Tickets" page to view your tickets

### For Admins:
1. Ensure you have admin role (see Step 3)
2. Navigate to `/admin/tickets`
3. You should see all tickets from all users
4. Test ticket management:
   - Accept/Reject tickets
   - Change ticket status
   - Add admin responses
5. Verify status changes reflect on user's "My Tickets" page

## Step 5: Verify Security (RLS Policies)

Test that RLS is working correctly:

1. **As a regular user**, try to:
   - View only your own tickets ✅
   - Create tickets ✅
   - Cannot see other users' tickets ❌
   - Cannot change ticket status ❌

2. **As an admin**, try to:
   - View all tickets ✅
   - Update any ticket ✅
   - Change ticket status ✅
   - Add admin responses ✅

## Troubleshooting

### Migrations fail to apply
- Check if tables already exist
- Ensure you're connected to the correct project
- Review error messages in Supabase logs

### Users can't upload attachments
- Verify `ticket-attachments` storage bucket exists
- Check storage policies are correctly applied
- Ensure user is authenticated

### Admin can't access `/admin/tickets`
- Verify user has an entry in `user_roles` table with `role = 'admin'`
- Check browser console for errors
- Clear browser cache and reload

### Status updates not reflecting
- Refresh the page
- Check network tab for failed API calls
- Verify RLS policies are enabled on `tickets` table

## Database Schema Reference

### tickets table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key → auth.users)
- `service_id`: TEXT (nullable)
- `subject`: TEXT
- `description`: TEXT
- `attachments`: JSONB (array of objects)
- `status`: TEXT (pending, accepted, rejected, in_progress, resolved, closed)
- `admin_response`: TEXT (nullable)
- `created_at`: TIMESTAMPTZ
- `updated_at`: TIMESTAMPTZ

### user_roles table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key → auth.users)
- `role`: TEXT (admin, user)
- `created_at`: TIMESTAMPTZ

## Next Steps

- [ ] Apply migrations
- [ ] Create storage bucket
- [ ] Set up at least one admin user
- [ ] Test ticket creation as a user
- [ ] Test ticket management as an admin
- [ ] Verify RLS policies are working
- [ ] Review and customize status workflow if needed
- [ ] Set up email notifications (future enhancement)

For detailed API documentation, see `TICKET_SYSTEM_DOCS.md`.
