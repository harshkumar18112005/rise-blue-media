# 🚀 Apply Ticket System to Production

Your code is deployed to Vercel, but the database changes need to be applied to production Supabase.

## 📋 Steps to Fix:

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/cuwcozpyuhfzaacxhdbv

### 2. Open SQL Editor
- Click on "SQL Editor" in the left sidebar
- Click "New Query"

### 3. Run the Production Setup Script
- Open the file: `PRODUCTION_SETUP.sql`
- Copy ALL the contents
- Paste into the Supabase SQL Editor
- Click "Run" or press `Ctrl+Enter`

### 4. Verify Success
You should see output showing:
```
✅ Admin Status | Email: 21naimish21@gmail.com | Role: admin
```

### 5. Refresh Your Live Website
- Go to your live website: https://rise-blue-media.vercel.app
- Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
- Click on your email in the top right
- You should now see "🛡️ Admin Panel" option!

## ✅ What This Does:

1. Creates `user_roles` table for admin management
2. Creates `tickets` table with all fields
3. Creates `ticket_messages` table for discussions
4. Sets up Row Level Security (RLS) policies
5. Makes you (21naimish21@gmail.com) an admin
6. Enables admin panel access

## 🔧 If Still Not Working:

1. Check browser console for errors (F12)
2. Verify you're logged in with: 21naimish21@gmail.com
3. Try logging out and back in
4. Clear browser cache and cookies

## 📞 Need Help?

Check these files for debugging:
- `DEBUG_ADMIN_ACCESS.sql` - Check your admin status
- `FIX_EVERYTHING_NOW.sql` - Alternative comprehensive fix
