# Scripts Directory

Utility scripts for platform maintenance and deployment.

---

## 📋 verify-env.js

**Environment Variable Verification Script**

Checks all required environment variables for production deployment.

### Usage:

```bash
# From project root
node scripts/verify-env.js
```

### What it checks:

**Critical Variables:**
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ SUPABASE_SERVICE_KEY
- ✅ ANTHROPIC_API_KEY
- ✅ OPENAI_API_KEY
- ✅ NEXT_PUBLIC_APP_URL
- ✅ NEXT_PUBLIC_HARVESTER_API_URL

**Optional Variables:**
- ○ GOOGLE_API_KEY (tertiary AI failover)
- ○ SENTRY_DSN (error tracking)
- ○ STRIPE_SECRET_KEY (payments)

### Output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ENVIRONMENT VARIABLE VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL VARIABLES:

✓ NEXT_PUBLIC_SUPABASE_URL
  → Supabase project URL
  → Value: https://xxx...

✗ OPENAI_API_KEY MISSING
  → OpenAI API key for GPT-4 Vision
  → Example: sk-proj-...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✗ VERIFICATION FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Exit Codes:

- `0` - All required variables configured ✅
- `1` - Missing required variables ❌

---

## 🚀 When to Run:

**Before every deployment:**
```bash
node scripts/verify-env.js
```

**In CI/CD pipeline:**
```yaml
# .github/workflows/deploy.yml
- name: Verify Environment
  run: node scripts/verify-env.js
```

**Before production push:**
```bash
node scripts/verify-env.js && git push production main
```

---

## 📝 Adding New Scripts:

Create new utility scripts in this directory:

```bash
scripts/
├── verify-env.js          # Environment verification
├── check-migrations.js    # Database migration checker (future)
├── test-apis.js          # API smoke tests (future)
└── README.md             # This file
```

---

**Created:** October 5, 2025
**Last Updated:** October 5, 2025
