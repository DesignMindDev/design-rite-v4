# Next-Auth Files Deprecated

**Date:** 2025-10-02
**Migration:** Next-Auth → Supabase Auth
**Status:** DO NOT USE - Deprecated files kept for reference only

---

## Deprecated Files

### 1. `lib/auth-config.ts` ❌ DEPRECATED
**Replaced by:** `lib/supabase-admin-auth.ts`

**Old Usage:**
```typescript
import { authOptions } from '@/lib/auth-config';
import { getServerSession } from 'next-auth';

const session = await getServerSession(authOptions);
```

**New Usage:**
```typescript
import { requireAuth, requireRole } from '@/lib/supabase-admin-auth';

const user = await requireAuth();
// or
const admin = await requireRole(['super_admin', 'admin']);
```

---

### 2. `app/api/auth/[...nextauth]/route.ts` ❌ DEPRECATED
**Replaced by:** Supabase Auth (no API route needed)

**Old URL:** `http://localhost:3010/api/auth/signin`
**New URL:** `http://localhost:3010/login`

---

### 3. `lib/hooks/useUnifiedAuth.ts` ❌ DEPRECATED
**Replaced by:** `lib/hooks/useSupabaseAuth.ts`

**Old Usage:**
```typescript
import { useUnifiedAuth } from '@/lib/hooks/useUnifiedAuth';

const auth = useUnifiedAuth();
if (auth.isPro) {
  // Show pro features
}
```

**New Usage:**
```typescript
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';

const auth = useSupabaseAuth();
if (auth.isProfessional) {
  // Show pro features
}
```

---

### 4. `app/components/SessionProvider.tsx` ❌ DEPRECATED
**Replaced by:** Supabase Auth automatically manages sessions

**Old Usage:**
```typescript
import SessionProvider from '@/app/components/SessionProvider';

<SessionProvider>
  <YourApp />
</SessionProvider>
```

**New Usage:**
No provider needed! Supabase Auth works automatically.

---

## Files to Remove (After Successful Migration)

**Run these commands after verifying everything works:**

```bash
# Remove Next-Auth config
rm lib/auth-config.ts

# Remove Next-Auth API route
rm -rf app/api/auth

# Remove deprecated hook
rm lib/hooks/useUnifiedAuth.ts

# Remove deprecated session provider (if it exists)
rm app/components/SessionProvider.tsx

# Remove Next-Auth from package.json
npm uninstall next-auth bcryptjs
npm uninstall --save-dev @types/bcryptjs
```

---

## Environment Variables to Remove

After successful migration, remove these from `.env.local`:

```bash
# Next-Auth (REMOVE AFTER MIGRATION)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
```

---

## Rollback Plan

If you need to rollback to Next-Auth:

1. **Keep these files** - Don't delete yet, just mark as deprecated
2. **Git checkout** - Revert files from git:
   ```bash
   git checkout main -- lib/auth-config.ts
   git checkout main -- app/api/auth/[...nextauth]/route.ts
   git checkout main -- lib/hooks/useUnifiedAuth.ts
   ```
3. **Restore env vars** - Add back NEXTAUTH_SECRET and NEXTAUTH_URL
4. **Restart server** - `npm run dev`

---

## Migration Status

- ✅ Supabase Auth implemented
- ✅ Admin login migrated to Supabase
- ✅ Subscription admin routes migrated
- ⏳ Remaining admin routes (see scripts/update-admin-routes-to-supabase.md)
- ⏳ Admin pages need to use useSupabaseAuth
- ⏳ Full testing required

**DO NOT DELETE FILES UNTIL:**
1. All admin routes updated
2. All admin pages updated
3. Full testing complete
4. Production deployment successful
5. 7 days of stable operation

---

## Reference: What Each File Did

### `lib/auth-config.ts`
- Defined Next-Auth configuration
- Used CredentialsProvider for email/password login
- Verified passwords with bcrypt
- Queried `users` table in Supabase
- Created JWT sessions with role/accessCode

### `app/api/auth/[...nextauth]/route.ts`
- Next-Auth API route handler
- Handled sign in, sign out, session management
- Endpoint: `/api/auth/*`

### `lib/hooks/useUnifiedAuth.ts`
- React hook for client-side auth state
- Used `useSession()` from next-auth/react
- Provided role checks, subscription checks
- Property names: `isPro`, `user.name`

---

**Conclusion:** These files are kept for reference during migration but should NOT be used in new code.
