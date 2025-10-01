# Design-Rite v3 - Admin Authentication System Setup Guide

**Created:** October 1, 2025
**Status:** Phase 1 Complete - Database & Authentication Infrastructure

---

## Overview

This guide covers the complete setup process for the Design-Rite v3 admin authentication system, including:

- 5-tier role-based access control (Super Admin, Admin, Manager, User, Guest)
- Next-Auth.js authentication with credentials provider
- Supabase database backend with RLS policies
- Activity logging and rate limiting
- Protected admin routes with middleware

---

## Phase 1: Database Setup (COMPLETED)

### Step 1: Create Database Tables

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/auth_tables.sql`
4. Paste into SQL Editor and click **Run**

This creates:
- `users` - User accounts with role-based access
- `user_sessions` - Active login sessions
- `activity_logs` - Complete audit trail
- `permissions` - Feature permissions per role
- `usage_tracking` - Rate limiting data

**Verification:**
```sql
-- Check that all tables were created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'user_sessions', 'activity_logs', 'permissions', 'usage_tracking');
```

### Step 2: Create Your Super Admin Account

**IMPORTANT:** You must create the super admin account manually in Supabase.

#### Generate Password Hash

Option 1 - Using Node.js:
```bash
cd "C:\Users\dkozi\Projects\Design-Rite\v3\design-rite-v3.1\design-rite-v3"
node -e "require('bcryptjs').hash('YourPassword123!', 10).then(console.log)"
```

Option 2 - Using online tool:
- Visit https://bcrypt-generator.com/
- Enter your desired password
- Use cost factor: 10
- Copy the generated hash

#### Insert Super Admin User

Run this in Supabase SQL Editor:
```sql
INSERT INTO users (
  email,
  password_hash,
  full_name,
  role,
  company,
  access_code,
  status
) VALUES (
  'dan@designrite.com',
  '$2b$10$YourGeneratedHashHere',  -- Replace with your hash
  'Dan Kozich',
  'super_admin',
  'Design-Rite Professional',
  'DR-SA-DK-2025',
  'active'
);
```

**Verification:**
```sql
SELECT id, email, full_name, role, status, created_at
FROM users
WHERE role = 'super_admin';
```

---

## Phase 2: Application Configuration (COMPLETED)

### Environment Variables

The following environment variables have been added to `.env.local`:

```bash
# Next-Auth Configuration
NEXTAUTH_SECRET=design-rite-v3-super-secret-key-change-in-production-2025
NEXTAUTH_URL=http://localhost:3010

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://ickwrbdpuorzdpzqbqpf.supabase.co
SUPABASE_SERVICE_KEY=<your-service-role-key>
```

**For Production Deployment:**
1. Generate a secure NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```
2. Update NEXTAUTH_URL to your production domain:
   ```
   NEXTAUTH_URL=https://design-rite-v3.onrender.com
   ```

### Files Created

#### Authentication Core
- `lib/auth-config.ts` - Next-Auth configuration with Supabase
- `app/api/auth/[...nextauth]/route.ts` - Next-Auth API route handler
- `lib/permissions.ts` - Permission checking and rate limiting functions
- `middleware.ts` - Route protection middleware

#### Admin UI Components
- `app/admin/login/page.tsx` - Admin login page
- `app/admin/components/AdminAuthWrapper.tsx` - Protected page wrapper
- `app/admin/components/AdminHeader.tsx` - User info header with logout

#### Database Migration
- `supabase/auth_tables.sql` - Complete database schema with RLS

---

## Phase 3: Testing the Authentication Flow

### Step 1: Start Development Server

```bash
cd "C:\Users\dkozi\Projects\Design-Rite\v3\design-rite-v3.1\design-rite-v3"
npm run dev
```

The server should start on http://localhost:3010

### Step 2: Test Login

1. Navigate to http://localhost:3010/admin/login
2. Enter your super admin email and password
3. Click "Sign In"
4. You should be redirected to `/admin` (or your callback URL)

### Step 3: Verify Session

After successful login:
- Check browser DevTools → Application → Cookies
- Look for `next-auth.session-token` cookie
- User info should appear in admin header

### Step 4: Test Logout

1. Click on your user avatar in the admin header
2. Click "Logout"
3. You should be redirected to `/admin/login`
4. Session cookie should be cleared

### Step 5: Test Route Protection

1. Logout if logged in
2. Try to access http://localhost:3010/admin
3. You should be automatically redirected to `/admin/login?callbackUrl=/admin`
4. After login, you should be redirected back to `/admin`

---

## Phase 4: Creating Additional Users

### Using Supabase SQL Editor

**Create an Admin:**
```sql
INSERT INTO users (
  email,
  password_hash,
  full_name,
  role,
  company,
  access_code,
  status,
  created_by
) VALUES (
  'philip@designrite.com',
  '$2b$10$HashHere',  -- Generate with bcrypt
  'Philip Lisk',
  'admin',
  'Design-Rite Professional',
  'DR-AD-PL-2025',
  'active',
  (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)
);
```

**Create a Manager:**
```sql
INSERT INTO users (
  email,
  password_hash,
  full_name,
  role,
  company,
  access_code,
  status,
  created_by
) VALUES (
  'sales@designrite.com',
  '$2b$10$HashHere',
  'Sales Manager',
  'manager',
  'Design-Rite Professional',
  'DR-MG-SM-2025',
  'active',
  (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)
);
```

**Create a Standard User:**
```sql
INSERT INTO users (
  email,
  password_hash,
  full_name,
  role,
  company,
  access_code,
  status,
  created_by
) VALUES (
  'customer@example.com',
  '$2b$10$HashHere',
  'Customer Name',
  'user',
  'Customer Company',
  'DR-US-CUST-001',
  'active',
  (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)
);
```

---

## Role Permissions Summary

### Super Admin
- **Full Access:** Everything
- **Rate Limits:** None
- **Can Manage:** All users
- **Admin Panel:** `/admin/super` (to be created)

### Admin
- **Access:** All platform features
- **Rate Limits:** None
- **Can Manage:** Users and Managers (not other Admins)
- **Admin Panel:** `/admin/team` (to be created)

### Manager
- **Access:** Unlimited quotes, AI assessments, System Surveyor uploads
- **Rate Limits:** None
- **Can Manage:** Own projects only
- **Dashboard:** `/dashboard/manager` (to be created)

### User
- **Access:** Limited quotes (10/day, 50/month), AI assessments (5/day)
- **Rate Limits:** See permissions table
- **Can Manage:** Own data only
- **Dashboard:** `/dashboard/user` (to be created)

### Guest
- **Access:** Quick estimates only (3/week)
- **Rate Limits:** Very restrictive
- **Can Manage:** Nothing
- **Dashboard:** None

---

## Integrating Auth with Existing Admin Pages

### Example: Protect an Admin Page

```typescript
'use client';

import { useSession } from 'next-auth/react';
import AdminAuthWrapper from '../components/AdminAuthWrapper';
import AdminHeader from '../components/AdminHeader';

export default function MyAdminPage() {
  const { data: session } = useSession();

  return (
    <AdminAuthWrapper requiredRole="admin">
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <AdminHeader
          title="My Admin Page"
          subtitle="Manage important stuff"
        />

        <div className="p-8">
          <h2>Welcome, {session?.user?.name}</h2>
          <p>Your role: {session?.user?.role}</p>
          {/* Your page content */}
        </div>
      </div>
    </AdminAuthWrapper>
  );
}
```

### Example: Check Permission in API Route

```typescript
import { requireRole, checkPermission, logActivity } from '@/lib/permissions';

export async function POST(req: Request) {
  try {
    // Require admin or higher role
    const session = await requireRole('admin');

    // Check specific permission
    const canCreate = await checkPermission('quotes', 'create');
    if (!canCreate) {
      return new Response('Forbidden', { status: 403 });
    }

    // Your logic here
    const result = await doSomething();

    // Log activity
    await logActivity(session.user.id, 'quote_generated', {
      resourceType: 'quote',
      resourceId: result.id,
      details: { /* any data */ }
    });

    return Response.json({ success: true, data: result });
  } catch (error) {
    return new Response(error.message, { status: 401 });
  }
}
```

---

## Activity Logging

All admin actions are automatically logged to the `activity_logs` table:

### Automatic Logging
- Login/logout
- Failed login attempts
- Quote generation
- AI assessments
- User management actions

### Manual Logging
Use the `logActivity` function from `lib/permissions.ts`:

```typescript
import { logActivity } from '@/lib/permissions';

await logActivity(userId, 'custom_action', {
  resourceType: 'custom_resource',
  resourceId: '123',
  details: { foo: 'bar' },
  success: true
});
```

### View Activity Logs
```sql
SELECT
  u.full_name,
  a.action,
  a.resource_type,
  a.timestamp,
  a.success
FROM activity_logs a
LEFT JOIN users u ON a.user_id = u.id
ORDER BY a.timestamp DESC
LIMIT 100;
```

---

## Rate Limiting

Rate limits are enforced based on user role and feature:

### Check Rate Limit
```typescript
import { checkRateLimit } from '@/lib/permissions';

const limit = await checkRateLimit(userId, 'quotes');
if (!limit.allowed) {
  return Response.json({
    error: 'Rate limit exceeded',
    limit: limit.limit,
    remaining: limit.remaining,
    resetAt: limit.resetDate
  }, { status: 429 });
}
```

### Increment Usage
```typescript
import { incrementUsage } from '@/lib/permissions';

await incrementUsage(userId, 'quotes');
```

### Default Rate Limits
- **Guest:** 3 estimates/week
- **User:** 10 quotes/day, 50/month, 5 AI assessments/day
- **Manager:** Unlimited
- **Admin:** Unlimited
- **Super Admin:** Unlimited

---

## Troubleshooting

### "Unauthorized" Error After Login
**Cause:** Session not being read correctly

**Solution:** Ensure you're using `getServerSession` in API routes:
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

const session = await getServerSession(authOptions);
```

### "Too Many Redirects"
**Cause:** Middleware redirect loop

**Solution:** Check that `/admin/login` is excluded in `middleware.ts`:
```typescript
if (path.startsWith('/admin/login')) {
  return NextResponse.next();
}
```

### Password Hash Not Working
**Cause:** Wrong bcrypt cost factor or encoding

**Solution:** Use bcrypt with cost factor 10:
```bash
node -e "require('bcryptjs').hash('password', 10).then(console.log)"
```

### Session Cookie Not Persisting
**Cause:** NEXTAUTH_URL mismatch

**Solution:** Ensure NEXTAUTH_URL matches your development URL:
```
NEXTAUTH_URL=http://localhost:3010
```

---

## Next Steps

### Phase 2: User Management UI (To be implemented)
- Create `/admin/super/page.tsx` - Super admin dashboard
- Create `/admin/users/page.tsx` - User management interface
- Create user creation/editing forms
- Build activity log viewer

### Phase 3: Activity Monitoring (To be implemented)
- Real-time activity feed
- User activity analytics
- Security alerts for suspicious activity
- Export activity logs

### Phase 4: Data Export (To be implemented)
- Export user list (CSV)
- Export quotes/BOMs (CSV/JSON)
- Export activity logs
- Database backup functionality

---

## Production Deployment Checklist

### Environment Variables
- [ ] Generate secure NEXTAUTH_SECRET with `openssl rand -base64 32`
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Verify SUPABASE_SERVICE_KEY is set
- [ ] Update Stripe keys if using payments

### Security
- [ ] Change all default passwords
- [ ] Review RLS policies in Supabase
- [ ] Enable 2FA for super admin (optional)
- [ ] Set up IP allowlisting (optional)
- [ ] Configure automated backups

### Testing
- [ ] Test login flow on production domain
- [ ] Verify rate limiting works
- [ ] Check activity logging captures all actions
- [ ] Test role-based access control
- [ ] Verify session expiration (24 hours)

---

## Support

### Issues or Questions?
- Review this guide first
- Check `admin_system_guide.md` for detailed architecture
- Review `CLAUDE.md` for recent implementation notes
- Contact: dan@designrite.com

---

**Design-Rite v3 Admin Authentication System**
**Version:** 1.0
**Last Updated:** October 1, 2025
