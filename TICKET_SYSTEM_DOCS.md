# Ticket System Documentation

## Overview
The ticket system allows users to raise support tickets for services, and administrators to manage and respond to these tickets.

## Features

### For Users:
1. **Raise a Ticket** (`/raise-ticket`)
   - Submit support tickets with subject, description, and attachments
   - Get a unique ticket ID upon creation
   - Can be accessed from service detail pages or directly

2. **My Tickets** (`/my-tickets`)
   - View all tickets raised by the user
   - See ticket status (pending, accepted, rejected, in_progress, resolved, closed)
   - View admin responses
   - See attachments and ticket history

### For Admins:
1. **Admin Ticket Management** (`/admin/tickets`)
   - View all tickets from all users
   - Accept or reject tickets
   - Update ticket status through quick actions or dropdown
   - Respond to tickets with detailed messages
   - View ticket attachments and full details

## Database Schema

### Tickets Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- service_id: TEXT (Optional - the service this ticket relates to)
- subject: TEXT (Ticket subject/title)
- description: TEXT (Detailed description)
- attachments: JSONB (Array of attachment objects)
- status: TEXT (pending, accepted, rejected, in_progress, resolved, closed)
- admin_response: TEXT (Admin's response to the ticket)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ (Auto-updated on changes)
```

### User Roles Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- role: TEXT (admin or user)
- created_at: TIMESTAMPTZ
```

## Ticket Status Flow

1. **Pending** → Initial status when ticket is created
2. **Accepted** → Admin accepts the ticket
3. **Rejected** → Admin rejects the ticket
4. **In Progress** → Admin is working on the ticket
5. **Resolved** → Issue has been resolved
6. **Closed** → Ticket is closed (final state)

## File Storage

Ticket attachments are stored in Supabase Storage under the `ticket-attachments` bucket with the following structure:
- Path: `{user_id}/{timestamp}.{extension}`
- Public access for viewing
- Authenticated users can upload
- Users can only delete their own attachments

## Security (Row Level Security)

### Tickets Table Policies:
- Users can view only their own tickets
- Users can create tickets
- Users can update their own tickets (limited fields)
- Admins can view, update, and delete all tickets

### User Roles Table Policies:
- Users can view their own roles
- Only database admins can modify roles

## API Usage

### Create a Ticket
```typescript
import { ticketOperations } from '@/integrations/supabase/tickets';

const ticket = await ticketOperations.createTicket({
  service_id: 'service-name',
  subject: 'Issue with...',
  description: 'Detailed description...',
  attachments: [
    { name: 'screenshot.png', url: '...', size: 12345 }
  ]
});
```

### Get User Tickets
```typescript
const tickets = await ticketOperations.getUserTickets();
```

### Get All Tickets (Admin)
```typescript
const allTickets = await ticketOperations.getAllTickets();
```

### Update Ticket (Admin)
```typescript
await ticketOperations.updateTicket(ticketId, {
  status: 'in_progress',
  admin_response: 'We are working on your issue...'
});
```

### Upload Attachment
```typescript
const file = // File object from input
const attachment = await ticketOperations.uploadAttachment(file);
// Returns: { name: string, url: string, size: number }
```

## Setting Up Admin Access

To grant admin access to a user, insert a record into the `user_roles` table:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

You can get the user's UUID from the Supabase Authentication dashboard or by querying `auth.users`.

## Migrations

Run the following migrations in order:
1. `20251112000000_create_tickets_table.sql` - Creates tickets table
2. `20251112000001_create_ticket_attachments_bucket.sql` - Creates storage bucket
3. `20251112000002_create_admin_policies.sql` - Creates admin policies and user_roles table

## Testing

1. **Create a ticket**: Navigate to `/raise-ticket` and submit a ticket
2. **View user tickets**: Go to `/my-tickets` to see your tickets
3. **Admin management**: Grant yourself admin role, then visit `/admin/tickets`
4. **Test status updates**: Update ticket status and verify it reflects on user side
5. **Test responses**: Send admin responses and verify users can see them

## Troubleshooting

### Tickets not showing for admin
- Verify the user has an entry in `user_roles` table with role='admin'
- Check browser console for any errors
- Verify RLS policies are enabled

### File uploads failing
- Check if `ticket-attachments` bucket exists
- Verify storage policies are correctly applied
- Ensure user is authenticated

### Status updates not reflecting
- Check network tab for failed requests
- Verify the tickets table updated_at trigger is working
- Refresh the page to see updated status

## Future Enhancements

- [ ] Email notifications for ticket updates
- [ ] Ticket priority levels
- [ ] Ticket categories/tags
- [ ] Search and filter functionality
- [ ] Ticket assignment to specific admins
- [ ] SLA tracking
- [ ] Ticket conversation threads
- [ ] File preview for attachments
