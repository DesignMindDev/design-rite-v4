# 🔐 Environment Variables Guide
## Design-Rite v3 + Document AI Integration

**Last Updated:** 2025-10-02
**Purpose:** Complete reference for all environment variables required for the unified platform

---

## 📋 Required Environment Variables

### **1. Next.js Core**

```bash
# Node environment
NODE_ENV=development  # or 'production'

# Next.js URL (used for redirects, webhooks, etc.)
NEXTAUTH_URL=http://localhost:3010  # Change to your domain in production
```

---

### **2. Next-Auth (Authentication)**

```bash
# Next-Auth secret key (REQUIRED)
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-super-secret-key-change-in-production

# Authentication providers (if using OAuth - optional)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

### **3. Supabase (Database & Storage)**

```bash
# Supabase project URL (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase anon key (public, safe to expose)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase service role key (SECRET - server-side only)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase JWT secret (optional, for advanced auth)
# SUPABASE_JWT_SECRET=your-jwt-secret
```

**Where to find these:**
1. Go to https://app.supabase.com/project/YOUR_PROJECT/settings/api
2. Copy:
   - URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_KEY` (keep secret!)

---

### **4. OpenAI (AI Features)**

```bash
# OpenAI API key (REQUIRED for AI chat, document generation)
OPENAI_API_KEY=sk-...

# Optional: Assistant ID for Assistants API
ASSESSMENT_ASSISTANT_ID=asst_...
GENERAL_ASSISTANT_ID=asst_...
```

**Where to find:**
- API Key: https://platform.openai.com/api-keys
- Assistant ID: https://platform.openai.com/assistants (if using Assistants API)

**Alternative:** Store API key in `admin_settings` table instead of environment variable

---

### **5. Google Gemini (Alternative AI - Optional)**

```bash
# Google Gemini API key (optional, for generate-document endpoint)
GEMINI_API_KEY=AIza...
```

**Where to find:**
- https://makersuite.google.com/app/apikey

**Note:** Document generation will use Gemini if `GEMINI_API_KEY` is set, otherwise falls back to OpenAI

---

### **6. Stripe (Payments & Subscriptions)**

```bash
# Stripe secret key (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_test_...  # or sk_live_... in production

# Stripe webhook secret (REQUIRED for webhook verification)
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Price IDs (can also be stored in admin_settings table)
STRIPE_PRICE_BASE=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
```

**Where to find:**
- API Keys: https://dashboard.stripe.com/apikeys
- Webhook Secret:
  1. Go to https://dashboard.stripe.com/webhooks
  2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
  3. Select events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
  4. Copy webhook secret
- Price IDs:
  1. Create products/prices: https://dashboard.stripe.com/products
  2. Copy price IDs (start with `price_...`)

---

### **7. Email (Optional - for notifications)**

```bash
# SendGrid API key (optional, for email notifications)
# SENDGRID_API_KEY=SG...

# Resend API key (alternative to SendGrid)
# RESEND_API_KEY=re_...

# From email address
# EMAIL_FROM=noreply@yourcompany.com
```

---

### **8. Analytics (Optional)**

```bash
# Google Analytics
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# PostHog (product analytics)
# NEXT_PUBLIC_POSTHOG_KEY=phc_...
# NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## 📄 Complete `.env.local` Template

Create `.env.local` in your project root with:

```bash
# ==============================================
# DESIGN-RITE V3 + DOCUMENT AI
# Environment Variables Configuration
# ==============================================

# ----------------------------------------------
# CORE
# ----------------------------------------------
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3010
NEXTAUTH_SECRET=generate-this-with-openssl-rand-base64-32

# ----------------------------------------------
# SUPABASE (Database & Storage)
# ----------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ----------------------------------------------
# AI PROVIDERS
# ----------------------------------------------
# OpenAI (REQUIRED for AI features)
OPENAI_API_KEY=sk-...

# Google Gemini (OPTIONAL - alternative to OpenAI for document generation)
# GEMINI_API_KEY=AIza...

# OpenAI Assistant IDs (OPTIONAL - if using Assistants API)
# ASSESSMENT_ASSISTANT_ID=asst_...
# GENERAL_ASSISTANT_ID=asst_...

# ----------------------------------------------
# STRIPE (Payments)
# ----------------------------------------------
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (OPTIONAL - can be stored in admin_settings table)
# STRIPE_PRICE_BASE=price_...
# STRIPE_PRICE_PRO=price_...
# STRIPE_PRICE_ENTERPRISE=price_...

# ----------------------------------------------
# EMAIL (OPTIONAL)
# ----------------------------------------------
# SENDGRID_API_KEY=SG...
# EMAIL_FROM=noreply@yourcompany.com

# ----------------------------------------------
# ANALYTICS (OPTIONAL)
# ----------------------------------------------
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
# NEXT_PUBLIC_POSTHOG_KEY=phc_...
# NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ----------------------------------------------
# ADMIN PASSWORD (Legacy - can be removed after migration)
# ----------------------------------------------
# ADMIN_PASSWORD=your-admin-password
```

---

## 🔒 Security Best Practices

### **1. Never Commit `.env.local`**

Add to `.gitignore`:
```
.env.local
.env*.local
.env.production
```

### **2. Use Different Keys Per Environment**

| Environment | Stripe | OpenAI | Supabase |
|-------------|--------|--------|----------|
| Development | `sk_test_...` | Dev API key | Dev project |
| Staging | `sk_test_...` | Separate key | Staging project |
| Production | `sk_live_...` | Prod API key | Prod project |

### **3. Rotate Secrets Regularly**

- Change `NEXTAUTH_SECRET` every 90 days
- Rotate API keys if compromised
- Use environment-specific webhook secrets

### **4. Restrict API Key Permissions**

**OpenAI:**
- Limit to necessary models only
- Set spending limits

**Stripe:**
- Use restricted keys when possible
- Limit to required permissions

**Supabase:**
- Never expose `SUPABASE_SERVICE_KEY` to frontend
- Use RLS policies to protect data

---

## 🚀 Deployment-Specific Configuration

### **Vercel**

Add environment variables in project settings:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Set appropriate environment (Development/Preview/Production)

### **Netlify**

Add in `netlify.toml`:
```toml
[build.environment]
  NEXTAUTH_URL = "https://yoursite.com"
```

Or via UI: Site Settings → Environment Variables

### **Railway / Render**

Add via dashboard environment variables section.

**Important:** Set `NEXTAUTH_URL` to your production domain!

---

## 🧪 Testing Environment Variables

### **Check if variables are loaded:**

```bash
# In your terminal
node -e "console.log(process.env.NEXTAUTH_URL)"
```

### **Check in Next.js API route:**

```typescript
// app/api/test-env/route.ts
export async function GET() {
  return Response.json({
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasStripe: !!process.env.STRIPE_SECRET_KEY
  });
}
```

Access: `http://localhost:3010/api/test-env`

---

## ❌ Common Issues

### **Issue: "NEXTAUTH_SECRET is not defined"**

**Solution:**
```bash
# Generate a new secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET=<generated-secret>

# Restart dev server
npm run dev
```

### **Issue: Supabase RLS policies failing**

**Problem:** Using `NEXT_PUBLIC_SUPABASE_ANON_KEY` for admin operations

**Solution:** Use `SUPABASE_SERVICE_KEY` in server-side code:
```typescript
// ✅ CORRECT (server-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!  // Service key for admin ops
);

// ❌ WRONG (server-side admin ops)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // Restricted by RLS
);
```

### **Issue: Stripe webhook signature verification fails**

**Problem:** Webhook secret mismatch

**Solution:**
1. Check webhook endpoint in Stripe dashboard matches your deployed URL
2. Copy correct webhook secret from Stripe dashboard
3. Update `STRIPE_WEBHOOK_SECRET` in environment variables
4. Redeploy

---

## 📊 Environment Variable Priority

Variables are loaded in this order (later overrides earlier):

1. System environment variables
2. `.env` (committed to repo - never use for secrets!)
3. `.env.local` (gitignored - use for secrets)
4. `.env.production` or `.env.development`
5. `.env.production.local` or `.env.development.local`

**Best Practice:** Use `.env.local` for all secrets, keep `.env` for documentation only.

---

## ✅ Production Deployment Checklist

Before deploying to production:

- [ ] Generate new `NEXTAUTH_SECRET` (don't reuse dev secret)
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Use production Supabase project
- [ ] Use Stripe live keys (`sk_live_...`)
- [ ] Configure production webhook URL in Stripe
- [ ] Use production OpenAI API key with spending limits
- [ ] Enable rate limiting in production
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Test all payment flows in Stripe test mode first
- [ ] Verify all environment variables in deployment platform
- [ ] Document all API keys in password manager (1Password, etc.)

---

**Questions or issues?** Check `UNIFIED_AUTH_INTEGRATION_GUIDE.md` for detailed setup instructions.
