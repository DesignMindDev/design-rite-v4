# Script to Update All Admin API Routes to Supabase Auth

## Summary
This script shows you how to update all remaining admin API routes from Next-Auth to Supabase Auth.

## Already Updated (Examples):
- ✅ `/api/admin/subscriptions/cancel`
- ✅ `/api/admin/subscriptions/upgrade`
- ✅ `/api/admin/subscriptions/extend-trial`

## Pattern to Apply to All Other Routes

### Step 1: Add Import
At the top of each `app/api/admin/**/route.ts` file:

**Before:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
// other imports...
```

**After:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole, logAdminAction } from '@/lib/supabase-admin-auth';
// other imports...
```

### Step 2: Add Auth Check at Start of Handler Function

**Before:**
```typescript
export async function POST(req: NextRequest) {
  try {
    // ... your code
  }
}
```

**After (if any authenticated user can access):**
```typescript
export async function POST(req: NextRequest) {
  // Check authentication
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    // ... your code
  }
}
```

**After (if only admins can access):**
```typescript
export async function POST(req: NextRequest) {
  // Check admin authentication
  const admin = await requireRole(['super_admin', 'admin']);
  if (admin instanceof NextResponse) return admin;

  try {
    // ... your code
  }
}
```

**After (if only super admins can access):**
```typescript
export async function POST(req: NextRequest) {
  // Check super admin authentication
  const admin = await requireRole(['super_admin']);
  if (admin instanceof NextResponse) return admin;

  try {
    // ... your code
  }
}
```

### Step 3: (Optional) Log Admin Actions

Add logging for important admin actions:

```typescript
await logAdminAction({
  userId: admin.id,
  action: 'user_created', // or 'user_deleted', 'settings_updated', etc.
  details: {
    target_user_id: newUser.id,
    // ... other relevant details
  },
});
```

## Routes to Update

Run this command to find all admin routes:
```bash
find app/api/admin -name "route.ts" -type f
```

### Critical Routes (Update First):
1. **User Management:**
   - `/api/admin/create-user/route.ts` → requireRole(['super_admin', 'admin'])
   - `/api/admin/update-user/route.ts` → requireRole(['super_admin', 'admin'])
   - `/api/admin/delete-user/route.ts` → requireRole(['super_admin'])
   - `/api/admin/suspend-user/route.ts` → requireRole(['super_admin', 'admin'])
   - `/api/admin/get-user/route.ts` → requireAuth()
   - `/api/admin/get-admins/route.ts` → requireRole(['super_admin'])

2. **Permissions:**
   - `/api/admin/get-permissions/route.ts` → requireRole(['super_admin', 'admin'])
   - `/api/admin/update-permissions/route.ts` → requireRole(['super_admin'])

3. **Activity Logs:**
   - `/api/admin/activity-logs/route.ts` → requireRole(['super_admin', 'admin'])

### Standard Routes (Update Next):
- `/api/admin/ai-providers/route.ts` → requireAuth()
- `/api/admin/assessments/route.ts` → requireAuth()
- `/api/admin/blog/route.ts` → requireRole(['super_admin', 'admin'])
- `/api/admin/harvester/route.ts` → requireAuth()
- `/api/admin/settings/route.ts` → requireRole(['super_admin', 'admin'])
- `/api/admin/team/route.ts` → requireRole(['super_admin', 'admin'])
- `/api/admin/team-activity/route.ts` → requireAuth()
- `/api/admin/dashboard/route.ts` → requireAuth()

### Analytics Routes (Read-Only, Update Last):
- `/api/admin/chatbot-analytics/route.ts` → requireAuth()
- `/api/admin/spatial-analytics/route.ts` → requireAuth()
- `/api/admin/leads-analytics/route.ts` → requireAuth()
- `/api/admin/ai-analytics/route.ts` → requireAuth()
- `/api/admin/operations/route.ts` → requireAuth()
- `/api/admin/user-journey/route.ts` → requireAuth()

## Automated Find & Replace

Use VS Code's Find & Replace (Ctrl+Shift+H) with these patterns:

### Pattern 1: Find routes without auth check
**Find (regex):**
```
export async function (GET|POST|PUT|DELETE)\(req: NextRequest\) \{
  try \{
```

**Replace with:**
```
export async function $1(req: NextRequest) {
  // Check authentication
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
```

Then manually change `requireAuth()` to `requireRole([...])` where needed.

## Testing Checklist

After updating each route:
1. ✅ Try accessing route without auth (should return 401)
2. ✅ Try accessing route with wrong role (should return 403)
3. ✅ Try accessing route with correct role (should work)
4. ✅ Verify activity log entry created (if using logAdminAction)

## Example: Full Migration of a Route

**Before (`/api/admin/create-user/route.ts`):**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { email, password, role } = await req.json();

    // Create user...
    const passwordHash = await hash(password, 10);
    // ... rest of code
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

**After:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireRole, logAdminAction } from '@/lib/supabase-admin-auth';

export async function POST(req: NextRequest) {
  // Check admin authentication
  const admin = await requireRole(['super_admin', 'admin']);
  if (admin instanceof NextResponse) return admin;

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const { email, password, role } = await req.json();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    // Create profile
    await supabase.from('profiles').insert({
      id: authData.user.id,
      email,
      status: 'active',
      created_by: admin.id,
    });

    // Assign role
    await supabase.from('user_roles').insert({
      user_id: authData.user.id,
      role,
    });

    // Log action
    await logAdminAction({
      userId: admin.id,
      action: 'user_created',
      details: {
        new_user_id: authData.user.id,
        email,
        role,
      },
    });

    return NextResponse.json({ success: true, user: authData.user });
  } catch (error) {
    console.error('[Admin] Error creating user:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

## Complete Migration Checklist

- [x] Update subscription admin routes (already done)
- [ ] Update user management routes (critical)
- [ ] Update permissions routes (critical)
- [ ] Update activity logs route
- [ ] Update content/settings routes
- [ ] Update analytics routes
- [ ] Test all routes with auth
- [ ] Remove Next-Auth dependencies

---

**Estimated Time:** 2-3 hours for all ~30 routes
**Priority:** Critical routes first, analytics last
