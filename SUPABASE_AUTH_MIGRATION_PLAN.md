# 🔄 Supabase Auth Migration Plan
## Unifying Design-Rite v3 + Document AI Under Supabase Auth

**Goal:** Migrate Design-Rite v3 from Next-Auth to Supabase Auth to create unified platform
**Status:** Not Yet Launched - Safe to Migrate
**Estimated Time:** 1-2 days development + testing

---

## 📊 CURRENT STATE

### **Design-Rite v3 (Next-Auth)**
- Uses `lib/auth-config.ts` with Next-Auth
- Custom `public.users` table with password hashing (bcrypt)
- Role system: super_admin, admin, manager, user, guest
- JWT sessions with 24-hour expiration
- Activity logging and rate limiting

### **Document AI (Supabase Auth)**
- Uses `auth.users` (Supabase managed)
- `profiles` table extends `auth.users`
- Role system: admin, moderator, user (stored in `user_roles` table)
- Supabase Auth sessions
- Document management and AI chat features

---

## 🎯 TARGET STATE

### **Unified Platform (Supabase Auth)**
- Single `auth.users` table managed by Supabase
- `profiles` table with ALL user data (Design-Rite + Document AI fields)
- Unified 5-tier role system in `user_roles` table
- Supabase Auth for all authentication
- All features accessible with single login

---

## 🔧 MIGRATION STRATEGY

### **Phase 1: Database Schema Unification** ✅

**Goal:** Merge `users` table into `profiles` + `auth.users`

```sql
-- 1. Extend profiles table with Design-Rite fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS access_code text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active'
  CHECK (status IN ('active', 'suspended', 'deleted', 'pending'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_by uuid;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login timestamp with time zone;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rate_limit_override boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notes text;

-- 2. Add subscription fields (Document AI compatibility)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'base'
  CHECK (subscription_tier IN ('base', 'pro', 'enterprise'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive'
  CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- 3. Extend user_roles with 5-tier system
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'guest';
-- Result: app_role enum = (admin, moderator, user, super_admin, manager, guest)
```

**Benefits:**
- Keeps existing Document AI data intact
- Extends with Design-Rite features
- Single source of truth for user data

---

### **Phase 2: Authentication Migration** ✅

**Replace Next-Auth with Supabase Auth:**

#### **2.1 Install Supabase Auth Helpers**
```bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
```

#### **2.2 Create Supabase Client**
```typescript
// lib/supabase-client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()
```

#### **2.3 Create Auth Hook**
```typescript
// lib/hooks/useSupabaseAuth.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    loading,
    signIn: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    signUp: (email: string, password: string) =>
      supabase.auth.signUp({ email, password })
  }
}
```

#### **2.4 Update API Routes**
```typescript
// Before (Next-Auth)
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

const session = await getServerSession(authOptions)
const userId = session.user.id

// After (Supabase Auth)
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabase = createRouteHandlerClient({ cookies })
const { data: { session } } = await supabase.auth.getSession()
const userId = session?.user?.id
```

---

### **Phase 3: Role System Unification** ✅

**Merge 5-tier Design-Rite roles with Document AI `user_roles` table:**

```sql
-- Create helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid)
RETURNS app_role
LANGUAGE sql
STABLE
AS $$
  SELECT role FROM user_roles
  WHERE user_id = user_uuid
  ORDER BY
    CASE role
      WHEN 'super_admin' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'manager' THEN 3
      WHEN 'moderator' THEN 3
      WHEN 'user' THEN 4
      WHEN 'guest' THEN 5
    END
  LIMIT 1;
$$;

-- Create helper for role hierarchy checks
CREATE OR REPLACE FUNCTION has_role_level(user_uuid uuid, required_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT
    CASE get_user_role(user_uuid)
      WHEN 'super_admin' THEN true
      WHEN 'admin' THEN required_role IN ('admin', 'manager', 'moderator', 'user', 'guest')
      WHEN 'manager' THEN required_role IN ('manager', 'user', 'guest')
      WHEN 'moderator' THEN required_role IN ('moderator', 'user', 'guest')
      WHEN 'user' THEN required_role IN ('user', 'guest')
      WHEN 'guest' THEN required_role = 'guest'
      ELSE false
    END;
$$;
```

**Usage:**
```typescript
// Check if user has admin access
const { data: hasAccess } = await supabase
  .rpc('has_role_level', { user_uuid: userId, required_role: 'admin' })

if (hasAccess) {
  // Grant admin access
}
```

---

### **Phase 4: Update Frontend Components** ✅

#### **4.1 Update Login Page**
```typescript
// app/admin/login/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
      return
    }

    // Fetch user role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single()

    // Redirect based on role
    if (roleData?.role === 'super_admin') {
      router.push('/admin/super')
    } else if (roleData?.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    // Login form JSX
  )
}
```

#### **4.2 Update Protected Routes**
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}
```

#### **4.3 Update Navigation**
```typescript
// app/components/UnifiedNavigation.tsx
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'

export function UnifiedNavigation() {
  const { user, signOut } = useSupabaseAuth()

  return (
    <nav>
      {user ? (
        <button onClick={() => signOut()}>Logout</button>
      ) : (
        <Link href="/admin/login">Sign In</Link>
      )}
    </nav>
  )
}
```

---

### **Phase 5: Migrate Existing Users** ⚠️

**Challenge:** Next-Auth uses bcrypt, Supabase Auth uses different hashing
**Solution:** Force password reset for all users

```sql
-- 1. Create migration tracking table
CREATE TABLE IF NOT EXISTS auth_migration_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  old_user_id uuid,
  new_user_id uuid,
  email text,
  migrated_at timestamp DEFAULT now(),
  status text CHECK (status IN ('pending', 'completed', 'failed')),
  error_message text
);

-- 2. For each user in old 'users' table:
--    - Create Supabase Auth account with temporary password
--    - Send password reset email
--    - Copy data to profiles table
--    - Mark as migrated

-- Example migration script (run via Node.js):
```

```typescript
// scripts/migrate-users-to-supabase-auth.ts
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!, // Admin key
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function migrateUsers() {
  // 1. Get all users from old users table
  const { data: oldUsers } = await supabaseAdmin
    .from('users')
    .select('*')

  for (const oldUser of oldUsers || []) {
    try {
      // 2. Create Supabase Auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: oldUser.email,
        email_confirm: true,
        password: generateRandomPassword(), // Temporary password
        user_metadata: {
          full_name: oldUser.full_name,
          migrated_from_nextauth: true
        }
      })

      if (authError) throw authError

      // 3. Copy data to profiles table
      await supabaseAdmin.from('profiles').upsert({
        id: authData.user.id,
        email: oldUser.email,
        full_name: oldUser.full_name,
        company: oldUser.company,
        phone: oldUser.phone,
        access_code: oldUser.access_code,
        status: oldUser.status,
        created_by: oldUser.created_by,
        last_login: oldUser.last_login,
        login_count: oldUser.login_count,
        rate_limit_override: oldUser.rate_limit_override,
        notes: oldUser.notes
      })

      // 4. Assign role
      await supabaseAdmin.from('user_roles').insert({
        user_id: authData.user.id,
        role: oldUser.role
      })

      // 5. Send password reset email
      await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: oldUser.email
      })

      // 6. Log migration
      await supabaseAdmin.from('auth_migration_log').insert({
        old_user_id: oldUser.id,
        new_user_id: authData.user.id,
        email: oldUser.email,
        status: 'completed'
      })

      console.log(`✅ Migrated: ${oldUser.email}`)
    } catch (error) {
      console.error(`❌ Failed to migrate ${oldUser.email}:`, error)
      await supabaseAdmin.from('auth_migration_log').insert({
        old_user_id: oldUser.id,
        email: oldUser.email,
        status: 'failed',
        error_message: (error as Error).message
      })
    }
  }
}

function generateRandomPassword() {
  return Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16)
}

migrateUsers().catch(console.error)
```

---

### **Phase 6: Update All API Routes** ✅

**Files to update:**

1. **Document AI Routes** (already created, need Supabase Auth):
   - `app/api/doc-ai-chat/route.ts`
   - `app/api/doc-ai/create-checkout/route.ts`
   - `app/api/doc-ai/generate-document/route.ts`

2. **Design-Rite Routes** (existing, need Supabase Auth):
   - All routes in `app/api/*`

**Template for Supabase Auth in API routes:**
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  // Get authenticated user
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  // Your API logic here...
}
```

---

## 📋 MIGRATION CHECKLIST

### **Pre-Migration**
- [ ] Backup production database
- [ ] Enable Supabase Auth in project settings
- [ ] Configure email templates in Supabase
- [ ] Set up SMTP for password reset emails
- [ ] Test Supabase Auth on staging

### **Code Changes**
- [ ] Install `@supabase/auth-helpers-nextjs`
- [ ] Create `lib/supabase-client.ts`
- [ ] Create `lib/hooks/useSupabaseAuth.ts`
- [ ] Update all API routes to use Supabase Auth
- [ ] Update login/signup pages
- [ ] Update middleware for route protection
- [ ] Update navigation components
- [ ] Remove Next-Auth dependencies

### **Database Changes**
- [ ] Extend `profiles` table with Design-Rite fields
- [ ] Add new roles to `app_role` enum
- [ ] Create role helper functions
- [ ] Update RLS policies for unified schema
- [ ] Run user migration script

### **Testing**
- [ ] Test user signup flow
- [ ] Test user login flow
- [ ] Test password reset flow
- [ ] Test role-based access control
- [ ] Test all API endpoints with Supabase Auth
- [ ] Test Document AI features
- [ ] Test Design-Rite features

### **Deployment**
- [ ] Deploy to staging
- [ ] Run user migration on staging
- [ ] Verify all features working
- [ ] Send password reset emails to all users
- [ ] Deploy to production
- [ ] Monitor error logs

---

## 🎯 BENEFITS OF MIGRATION

1. **Single Authentication System** - One login for all features
2. **Built-in Auth UI** - Supabase provides pre-built login/signup components
3. **Email Verification** - Built-in email confirmation
4. **Password Reset** - Automatic password reset flow
5. **OAuth Support** - Easy to add Google/GitHub/etc login
6. **Row Level Security** - Database-level security with RLS
7. **Session Management** - Automatic session refresh
8. **Multi-factor Auth** - Optional MFA support
9. **Better Scalability** - Supabase handles auth infrastructure
10. **Cost Reduction** - No need for separate auth service

---

## ⚠️ RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| User password loss | High | Send password reset emails to all users |
| Session disruption | Medium | Plan migration during low-traffic period |
| Data migration errors | High | Backup database before migration |
| Auth flow bugs | Medium | Comprehensive testing on staging |
| Email delivery issues | Medium | Configure SMTP properly, use SendGrid/etc |

---

## 📊 ESTIMATED TIMELINE

| Phase | Time | Dependencies |
|-------|------|--------------|
| Phase 1: Schema | 2 hours | None |
| Phase 2: Auth Migration | 4 hours | Phase 1 |
| Phase 3: Role System | 2 hours | Phase 1 |
| Phase 4: Frontend | 4 hours | Phase 2 |
| Phase 5: User Migration | 2 hours | All phases |
| Phase 6: API Routes | 4 hours | Phase 2 |
| Testing | 4 hours | All phases |
| **Total** | **22 hours** | **~3 days** |

---

## 🚀 NEXT STEPS

**Ready to proceed?** I can:

1. ✅ Create unified database migration SQL
2. ✅ Create user migration script
3. ✅ Update all API routes for Supabase Auth
4. ✅ Update frontend components
5. ✅ Create testing checklist

**Or would you like to:**
- Review the plan first?
- Start with Phase 1 (database schema)?
- Test on staging environment first?

---

**Status:** ✅ Ready to Execute
**Last Updated:** 2025-10-02
**Recommended:** Start with Phase 1 database migration
