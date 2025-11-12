# Testing Guide for Ticket System

## Prerequisites Checklist
- [ ] Migrations applied to Supabase
- [ ] Storage bucket created
- [ ] At least one admin user configured
- [ ] Development server running

## Step-by-Step Testing

### 1. Apply Migrations First

```powershell
# Make sure you're in the project directory
cd S:\Workplace\rise-blue-media

# Check migration status
supabase migration list

# Apply migrations to remote
supabase db push
```

### 2. Start Development Server

```powershell
# If using bun (based on your bun.lockb file)
bun run dev

# OR if using npm
npm run dev
```

### 3. Set Up Admin User

#### Option A: Via SQL Editor in Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Run this query (replace with your actual user UUID):

```sql
-- First, get your user UUID
SELECT id, email FROM auth.users;

-- Then insert admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

#### Option B: Via Supabase CLI
```powershell
supabase db execute --sql "INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_UUID_HERE', 'admin') ON CONFLICT (user_id, role) DO NOTHING;"
```

---

## Testing Scenarios

### Test 1: User Creates a Ticket ✅

**Steps:**
1. Navigate to `http://localhost:5173` (or your dev server URL)
2. **Log in** as a regular user (not admin yet)
3. Go to **Services** page
4. Click on any service card
5. Click **"View More"** or navigate to service detail page
6. Scroll down below the service description
7. Click **"Raise a Ticket"** button (should be next to "Explore More Services")
8. Fill out the form:
   - **Subject**: "Test Ticket - Payment Issue"
   - **Description**: "I'm having trouble processing my payment for Instagram Growth service"
   - **Attachments**: Upload a screenshot or any file
9. Click **"Submit Ticket"**

**Expected Results:**
- ✅ Success message appears
- ✅ Generated Ticket ID is displayed (UUID format)
- ✅ Copy button works to copy ticket ID
- ✅ Link to "View all your tickets" appears

---

### Test 2: User Views Their Tickets ✅

**Steps:**
1. Click **"View all your tickets"** link (or navigate to `/my-tickets`)
2. Verify the ticket you just created appears

**Expected Results:**
- ✅ Ticket is listed with correct subject
- ✅ Status badge shows "Pending" (yellow)
- ✅ Click "View Details" accordion to expand
- ✅ Description is visible
- ✅ Attachments are shown and clickable
- ✅ Created and Updated timestamps are displayed
- ✅ "Raise New Ticket" button is visible

**Test Edge Cases:**
- Try to access another user's ticket by URL manipulation (should fail)
- Verify pagination/sorting works if you have multiple tickets

---

### Test 3: Admin Views All Tickets 🔐

**Steps:**
1. **Log out** from regular user account
2. **Log in** with the admin user account (the one you added to user_roles)
3. Navigate to `/admin/tickets`

**Expected Results:**
- ✅ All tickets from all users are visible
- ✅ Each ticket shows:
  - Subject and description
  - Service name (if applicable)
  - Ticket ID (first 8 characters)
  - Current status badge
  - Created timestamp
  - User ID who created it

**If Access Denied:**
- Verify admin role was added correctly:
  ```sql
  SELECT * FROM public.user_roles WHERE role = 'admin';
  ```
- Check browser console for errors
- Verify you're logged in with the correct user

---

### Test 4: Admin Accepts/Rejects Ticket ✅

**Steps:**
1. On `/admin/tickets` page
2. Find the test ticket you created
3. Click **"Accept"** button

**Expected Results:**
- ✅ Success message: "Ticket status updated successfully"
- ✅ Status badge changes to "Accepted" (blue)

**Then Test Reject:**
1. Click **"Reject"** button
2. Status badge should change to "Rejected" (red)

---

### Test 5: Admin Changes Status via Dropdown ✅

**Steps:**
1. Click the status dropdown on any ticket
2. Select **"In Progress"**

**Expected Results:**
- ✅ Status updates immediately
- ✅ Badge changes to purple with "IN PROGRESS" label
- ✅ Success notification appears

**Test All Statuses:**
- Pending (yellow)
- Accepted (blue)
- Rejected (red)
- In Progress (purple)
- Resolved (green)
- Closed (gray)

---

### Test 6: Admin Sends Response 💬

**Steps:**
1. In the admin panel, find your test ticket
2. Scroll to the "Admin Response" textarea
3. Type: "Thank you for reporting this issue. We're investigating and will update you within 24 hours."
4. Click **"Send Response"**

**Expected Results:**
- ✅ Success message: "Response sent successfully"
- ✅ Textarea clears
- ✅ Response appears in the "Previous Response" alert box above
- ✅ Page refreshes with updated data

---

### Test 7: User Sees Admin Response 👤

**Steps:**
1. **Log out** from admin account
2. **Log in** as the regular user who created the ticket
3. Navigate to `/my-tickets`
4. Click "View Details" on the ticket

**Expected Results:**
- ✅ "Admin Response" section is visible
- ✅ The response message is displayed
- ✅ Status reflects the changes admin made

---

### Test 8: File Upload & Download 📎

**Steps:**
1. Create a new ticket with multiple attachments:
   - A screenshot (PNG/JPG)
   - A document (PDF)
   - A text file (TXT)
2. Submit the ticket
3. Go to My Tickets and view details
4. Click each attachment link

**Expected Results:**
- ✅ All files are listed with correct names
- ✅ File sizes are displayed
- ✅ Clicking opens/downloads the file
- ✅ Files are accessible from admin panel too

---

### Test 9: Security Testing 🔒

**Test A: Non-Admin Cannot Access Admin Panel**
1. Log in as regular user
2. Try to navigate to `/admin/tickets`

**Expected:** Redirected or "Access Denied" message

**Test B: User Cannot See Other Users' Tickets**
1. Create tickets with two different user accounts
2. Log in as User A
3. Try to view User B's tickets

**Expected:** Only see your own tickets

**Test C: User Cannot Change Ticket Status**
1. Open browser console (F12)
2. Try to call the API directly:
```javascript
// This should fail due to RLS
const { data, error } = await supabase
  .from('tickets')
  .update({ status: 'resolved' })
  .eq('id', 'some-ticket-id');
console.log(error); // Should show permission error
```

**Expected:** Permission denied error

---

### Test 10: Edge Cases & Error Handling ⚠️

**Test Empty Form:**
1. Go to `/raise-ticket`
2. Try to submit without filling any fields
3. Should show validation errors

**Test Network Errors:**
1. Open DevTools → Network tab
2. Throttle to "Offline"
3. Try to create a ticket
4. Should show error message

**Test Large Files:**
1. Try to upload a file > 50MB
2. Should handle gracefully (may need size limits)

---

## Quick Test Commands

### Check if migrations applied:
```powershell
supabase db remote get
```

### Check if bucket exists:
```powershell
supabase storage list
```

### View all tickets in database:
```sql
SELECT id, subject, status, user_id, created_at 
FROM public.tickets 
ORDER BY created_at DESC;
```

### View admin users:
```sql
SELECT u.email, ur.role 
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

---

## Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution:** 
```powershell
bun install
# or
npm install
```

### Issue: Migrations not applying
**Solution:**
```powershell
supabase db reset --linked
supabase db push
```

### Issue: Storage bucket not found
**Solution:** Manually create in Supabase Dashboard → Storage → New Bucket

### Issue: RLS policies blocking everything
**Solution:** Check policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'tickets';
```

---

## Test Results Checklist

Mark off as you test:

**User Features:**
- [ ] Can create ticket from service detail page
- [ ] Receives unique ticket ID after creation
- [ ] Can view all own tickets on My Tickets page
- [ ] Can see ticket status updates
- [ ] Can see admin responses
- [ ] Can upload and view attachments

**Admin Features:**
- [ ] Can access admin panel
- [ ] Can view all tickets from all users
- [ ] Can accept tickets
- [ ] Can reject tickets
- [ ] Can change status via dropdown
- [ ] Can send admin responses
- [ ] Can view ticket details and attachments

**Security:**
- [ ] Non-admins cannot access admin panel
- [ ] Users only see their own tickets
- [ ] Users cannot modify ticket status
- [ ] RLS policies are enforced

**Edge Cases:**
- [ ] Form validation works
- [ ] Error messages display properly
- [ ] File uploads handle various formats
- [ ] Timestamps display correctly

---

## Next Steps After Testing

1. ✅ **If everything works:** You're ready for production!
2. ❌ **If issues found:** Document them and we'll fix them
3. 🎨 **Customizations:** Adjust styling, status labels, workflows as needed
4. 📧 **Enhancements:** Add email notifications, search, filters, etc.

---

**Need Help?** Let me know what test fails and I'll help debug! 🚀
