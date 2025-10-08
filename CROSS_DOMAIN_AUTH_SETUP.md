# Cross-Domain Authentication Setup

## Problem
Users sign in at `portal.design-rite.com` but when redirected to `www.design-rite.com/estimate-options`, they see "Authentication Required" because Supabase localStorage is subdomain-specific.

## Solution
Pass authentication tokens via URL parameters when redirecting between subdomains.

---

## For Portal Team (portal.design-rite.com)

### Update "Launch AI Platform" Button

**Current Code (portal):**
```typescript
// ❌ DON'T DO THIS - session won't transfer
<button onClick={() => window.location.href = 'https://www.design-rite.com/estimate-options'}>
  Launch AI Platform
</button>
```

**New Code (portal):**
```typescript
import { crossDomainAuth } from '@/lib/cross-domain-auth';

// ✅ DO THIS - includes auth tokens
const handleLaunchPlatform = async () => {
  const authUrl = await crossDomainAuth.getAuthRedirectUrl('/estimate-options');
  window.location.href = authUrl;
};

<button onClick={handleLaunchPlatform}>
  Launch AI Platform
</button>
```

### What This Does
1. Gets current Supabase session from portal
2. Extracts `access_token` and `refresh_token`
3. Creates URL: `https://www.design-rite.com/estimate-options?access_token=...&refresh_token=...&auth_source=portal`
4. User clicks → redirects with auth tokens in URL

---

## Already Implemented on Main Site (www.design-rite.com)

### Auto-Detection on `/estimate-options`
The estimate-options page automatically:
1. Detects auth tokens in URL parameters
2. Calls `crossDomainAuth.handleAuthRedirect()`
3. Establishes Supabase session using tokens
4. Cleans up URL (removes tokens from address bar)
5. User is authenticated ✅

**Code (already implemented):**
```typescript
// app/estimate-options/page.tsx (lines 32-36)
const hasPortalAuth = await crossDomainAuth.handleAuthRedirect();
if (hasPortalAuth) {
  console.log('✅ Authenticated via portal redirect');
}
```

---

## Testing the Flow

### 1. Sign in at Portal
```
portal.design-rite.com/login
↓
User signs in with Supabase
↓
Goes to portal dashboard
```

### 2. Launch AI Platform
```
User clicks "Launch AI Platform"
↓
portal.design-rite.com calls crossDomainAuth.getAuthRedirectUrl()
↓
Redirects to: www.design-rite.com/estimate-options?access_token=...&refresh_token=...&auth_source=portal
```

### 3. Auto-Authentication
```
www.design-rite.com/estimate-options loads
↓
crossDomainAuth.handleAuthRedirect() runs
↓
Establishes session from URL tokens
↓
Cleans URL to: www.design-rite.com/estimate-options
↓
User sees estimate options page (authenticated) ✅
```

---

## File Locations

### Portal Repository (portal.design-rite.com)
```
lib/cross-domain-auth.ts          ← Copy this file from main repo
components/LaunchButton.tsx       ← Update to use crossDomainAuth.getAuthRedirectUrl()
```

### Main Repository (www.design-rite.com)
```
lib/cross-domain-auth.ts          ← Already created ✅
lib/supabase.ts                   ← Updated with shared storage key ✅
app/estimate-options/page.tsx     ← Updated to handle auth redirect ✅
```

---

## Security Notes

### ✅ Safe
- Tokens are passed via HTTPS only
- Tokens are immediately removed from URL after processing
- `auth_source=portal` parameter validates the redirect source
- Supabase validates tokens on setSession()

### ⚠️ Important
- Only use HTTPS in production
- Tokens are short-lived (expire in 1 hour by default)
- Clean up URL immediately after processing

---

## Deployment Checklist

### Portal Team (portal.design-rite.com)
- [ ] Copy `lib/cross-domain-auth.ts` from main repo
- [ ] Update "Launch AI Platform" button to use `crossDomainAuth.getAuthRedirectUrl()`
- [ ] Test: Sign in at portal → Launch platform → Should be authenticated on www

### Main Site (www.design-rite.com)
- [x] `lib/cross-domain-auth.ts` created
- [x] `lib/supabase.ts` updated with shared storage key
- [x] `app/estimate-options/page.tsx` handles cross-domain auth
- [ ] Deploy to production
- [ ] Test: Portal redirect → Should auto-authenticate

---

## Troubleshooting

### Still seeing "Authentication Required"
1. Check browser console for cross-domain auth logs
2. Verify URL contains `access_token` parameter when redirecting from portal
3. Check that `crossDomainAuth.handleAuthRedirect()` is running (see console logs)
4. Verify Supabase `NEXT_PUBLIC_SUPABASE_URL` matches in both repos

### Tokens not working
1. Check Supabase session is valid in portal before redirecting
2. Verify tokens aren't expired (check timestamps)
3. Check Supabase project keys match in both repos

### URL not cleaned up
1. Check `window.history.replaceState()` is running
2. Verify browser supports History API
3. Check for console errors

---

## Alternative: Shared Cookie Domain (Future Enhancement)

If you control DNS for both subdomains, you can configure Supabase to use a shared cookie domain:

```typescript
// Future enhancement - requires DNS control
const supabase = createBrowserClient(url, key, {
  auth: {
    storage: customCookieStorage({
      domain: '.design-rite.com'  // Shared across all subdomains
    })
  }
});
```

This would eliminate the need for URL parameter passing, but requires:
- Custom cookie storage implementation
- DNS configuration access
- Cookie security considerations

---

## Support

**Questions?**
- Check browser console logs (look for `[Cross-Domain Auth]` messages)
- Verify Supabase session exists before redirecting
- Test with incognito window to rule out cached auth states

**Files to update on portal:**
1. Copy `lib/cross-domain-auth.ts`
2. Update launch button component to use `crossDomainAuth.getAuthRedirectUrl()`
3. Test end-to-end flow
