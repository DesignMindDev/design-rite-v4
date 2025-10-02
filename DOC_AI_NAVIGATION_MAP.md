# Document AI - Navigation & Authentication Map

## 🔐 Unified Authentication Flow (Supabase Auth)

**Date Updated:** 2025-10-02
**Migration:** ✅ Migrated from Next-Auth to Supabase Auth

### Single Login for Both Systems

**Unified Login Page:**
```
/login  ✅ WORKS FOR BOTH ADMIN & DOC-AI
```

**How it Works:**
1. User enters email/password at `/login`
2. Supabase Auth validates credentials
3. System checks user role from `user_roles` table
4. **Auto-redirects based on role:**
   - Super Admin/Admin/Manager → `/admin`
   - Regular Users → `/doc-ai/chat`

---

### Alternative Login Pages (Same Auth, Different UI)

**Document AI Login:**
```
/doc-ai/login  ✅ EXISTS (Blue theme)
```

**Admin Login:**
```
/admin/login  ✅ EXISTS (Purple theme)
```

**All three login pages** use the same Supabase Auth backend. Use whichever you prefer!

---

### Authentication Summary

| Feature | Value |
|---------|-------|
| **Auth System** | Supabase Auth (unified) |
| **Primary Login** | `/login` (auto-redirects by role) |
| **Alt Logins** | `/admin/login`, `/doc-ai/login` |
| **Session Hook** | `useSupabaseAuth()` |
| **User Table** | `auth.users` (Supabase Auth) |
| **Profile Table** | `profiles` |
| **Roles Table** | `user_roles` |
| **Protected Routes** | `/admin/*`, `/doc-ai/*` |
| **Logout** | `await auth.signOut()` |

---

### User Roles & Permissions

**Super Admin (`super_admin`):**
- Full platform control, manage all users, access all data
- Unlimited everything, no rate limits
- Access via: `/admin`

**Admin (`admin`):**
- Manage standard users, view team activity logs
- Unlimited platform features
- Cannot create other admins
- Access via: `/admin`

**Manager (`manager`):**
- Unlimited quotes, AI assessments, System Surveyor uploads
- Own projects only, no user management
- Access via: `/admin` or `/doc-ai`

**User (`user`):**
- Rate limited: 10 quotes/day (50/month), 5 AI assessments/day
- Own data only
- Access via: `/doc-ai`

**Guest (`guest`):**
- 3 quick estimates per week (IP-based)
- No saved projects
- Limited access

---

## 📂 Complete Site Map

### Public Pages
```
/                                  → Homepage
/pricing                          → Pricing page
/solutions                        → Solutions overview
/contact                          → Contact form
/help                             → Help center
```

### Document AI (Supabase Auth Required)
```
/doc-ai
├── /doc-ai/chat                  → AI Chat Assistant
├── /doc-ai/documents             → Document Upload & Management
├── /doc-ai/library               → Generated Documents Library
├── /doc-ai/subscription          → Subscription Plans & Upgrade
└── /doc-ai/login                 → ✅ Login Page (Blue theme)
```

**Auth Status:**
- ✅ Frontend pages use `useSupabaseAuth` hook
- ✅ API routes use Supabase Auth
- ✅ Login page created (use `/login`, `/doc-ai/login`, or `/admin/login`)

---

### Admin Panel (Supabase Auth Required)
```
/admin
├── /admin/login                  → ✅ Admin Login Page
├── /admin                        → Main Dashboard
│
├── AI Tools Dropdown
│   ├── /admin/ai-providers       → AI Provider Management
│   ├── /admin/ai-assistant       → AI Assistant Config
│   └── /admin/chatbot            → Chatbot Config
│
├── Data Tools Dropdown
│   └── /admin/harvester          → Product Harvester
│
├── Content Tools Dropdown
│   ├── Team Management (tab)     → Team member management
│   ├── /admin/creative-studio    → Creative content studio
│   ├── /admin/spatial-studio-dev → Spatial studio development
│   ├── Logo Management (tab)     → Logo upload/management
│   ├── Video Management (tab)    → Video content management
│   └── Blog Posts (tab)          → Blog management
│
├── Business Tools Dropdown ⭐ NEW
│   ├── /admin/subscriptions      → ✅ Subscription Management
│   └── /admin/demo-dashboard     → Demo booking dashboard
│
├── About Us Dropdown
│   └── /admin/careers            → Careers page management
│
├── Operations Dashboard
│   └── /admin/operations         → Operations metrics
│
└── Analytics
    ├── /admin/demo-dashboard      → Calendly demo bookings
    ├── /admin/leads-dashboard     → Lead pipeline
    ├── /admin/user-journey        → User behavior
    ├── /admin/spatial-studio-dev  → Spatial analytics
    ├── /admin/ai-analytics        → AI usage metrics
    ├── /admin/user-activity       → User event logs
    ├── /admin/assessments         → AI assessments
    └── /admin/session-debug       → Session debugging
```

---

## 🚀 Quick Access URLs

### Document AI URLs (Supabase Auth)
```bash
# Main Document AI Hub
http://localhost:3010/doc-ai

# AI Chat Interface
http://localhost:3010/doc-ai/chat

# Document Upload
http://localhost:3010/doc-ai/documents

# Generated Documents Library
http://localhost:3010/doc-ai/library

# Subscription & Pricing
http://localhost:3010/doc-ai/subscription
```

### Admin URLs (Next-Auth)
```bash
# Admin Login
http://localhost:3010/admin/login

# Admin Dashboard
http://localhost:3010/admin

# Subscription Management (NEW!)
http://localhost:3010/admin/subscriptions

# Demo Dashboard
http://localhost:3010/admin/demo-dashboard
```

---

## 🔧 What Needs To Be Built

### ⚠️ Missing: Document AI Login Page

**File to Create:** `app/doc-ai/login/page.tsx`

**Should Include:**
- Supabase Auth sign-in form
- Email/password login
- "Forgot password" link
- Sign-up link for new users
- Redirect to `/doc-ai/chat` after successful login

**Example Structure:**
```typescript
'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function DocAILoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClient(...);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.session) {
      router.push('/doc-ai/chat');
    }
  };

  return (
    <div>
      <h1>Document AI Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
}
```

---

## 🔑 Unified Authentication Summary

### Single Supabase Auth System

| Feature | Document AI | Admin Panel |
|---------|-------------|-------------|
| **Auth System** | Supabase Auth | Supabase Auth |
| **Login URL** | `/doc-ai/login` or `/login` | `/admin/login` or `/login` |
| **Session Hook** | `useSupabaseAuth()` | `useSupabaseAuth()` |
| **User Table** | `auth.users` (Supabase) + `profiles` + `user_roles` | Same |
| **Protected Routes** | `/doc-ai/*` | `/admin/*` |
| **Logout** | `await auth.signOut()` | `await auth.signOut()` |
| **API Auth** | `requireAuth()` or `requireRole()` | `requireAuth()` or `requireRole()` |

---

## 📊 Navigation Updates from Session 3

### What Was Added

1. **Business Tools Dropdown** (Admin)
   - New dropdown in admin navigation
   - Contains Subscriptions link
   - Contains Demo Dashboard link

2. **Subscriptions Page** (`/admin/subscriptions`)
   - Real-time metrics dashboard
   - Subscriber management table
   - Detailed subscription modal
   - Admin actions (cancel/upgrade/extend)

3. **Utility Menu** (Public Navigation)
   - Help link
   - Subscribe link
   - Sign In button (shows Logout when authenticated)

---

## 🎯 Recommended Next Steps

### 1. Create Document AI Login Page
**Priority:** HIGH
**File:** `app/doc-ai/login/page.tsx`
**Reason:** Users can't access Document AI without login page

### 2. Add "Login" Link to Document AI Pages
Update `app/doc-ai/layout.tsx` to show "Login" button when not authenticated

### 3. Create Sign-Up Page
**File:** `app/doc-ai/signup/page.tsx`
**Purpose:** New user registration for Document AI

### 4. Test Complete Flow
- User visits `/doc-ai/subscription`
- Clicks "Subscribe"
- Redirected to `/doc-ai/login`
- Logs in with Supabase Auth
- Redirected to Stripe checkout
- Webhook processes subscription
- Admin can view in `/admin/subscriptions`

---

## 💡 Quick Reference

**To Access Admin Subscriptions:**
1. Go to `http://localhost:3010/admin/login`
2. Login with admin credentials
3. Click "Business Tools" dropdown
4. Click "Subscriptions"
5. View/manage all subscriptions

**To Use Document AI (After Login Page Created):**
1. Go to `http://localhost:3010/doc-ai/login`
2. Login with Supabase credentials
3. Access chat, documents, library, subscription pages
4. Click "Subscribe" to create Stripe checkout
5. Complete payment
6. Subscription appears in admin panel

---

## ✅ Migration Complete!

**Date:** 2025-10-02
**Status:** Unified Supabase Auth System Implemented

### What Changed:
1. ✅ **Unified Login:** All users (admin & doc-ai) use Supabase Auth
2. ✅ **Three Login Pages:** `/login`, `/admin/login`, `/doc-ai/login` (all use same backend)
3. ✅ **Auto-Redirect:** Login page detects user role and redirects appropriately
4. ✅ **Admin API Routes:** Updated subscription routes to use Supabase Auth helpers
5. ✅ **Helper Functions:** Created `requireAuth()`, `requireRole()`, `logAdminAction()`

### Next Steps:
1. **Run Database Migration:** Execute `supabase/migrations/SUPABASE_AUTH_001_unify_schema.sql`
2. **Migrate Users:** Run `scripts/migrate-users-to-supabase-auth.ts`
3. **Update Remaining Admin Routes:** See `scripts/update-admin-routes-to-supabase.md`
4. **Test Everything:** Verify login, permissions, API routes

### Documentation:
- **Migration Guide:** `SUPABASE_AUTH_MIGRATION_GUIDE.md`
- **Deprecated Files:** `NEXT_AUTH_DEPRECATED.md`
- **API Route Updates:** `scripts/update-admin-routes-to-supabase.md`
