# Environment Variables Reference - Design-Rite v3
**Complete Configuration Guide**

---

## 🔑 Critical Variables (Required)

### Authentication

#### NEXTAUTH_SECRET
**Value**: `design-rite-v3-super-secret-key-change-in-production-2025`
**Purpose**: Encrypts session tokens and cookies
**Required**: ✅ Yes
**Where to Set**:
- Development: `.env.local`
- Production: Render Environment Variables

**⚠️ Security**:
- **Change in production!**
- Use 32+ character random string
- Never commit to git
- Rotate every 90 days

**Generate New Secret**:
```bash
# Use this to generate a new secret
openssl rand -base64 32
```

---

#### NEXTAUTH_URL
**Development**: `http://localhost:3000`
**Production**: `https://your-actual-domain.com`
**Purpose**: Tells Next-Auth where the app is hosted
**Required**: ✅ Yes

**⚠️ Common Mistakes**:
- ❌ `http://localhost:3010` (wrong port)
- ❌ `https://your-domain.com/` (trailing slash)
- ❌ `localhost:3000` (missing protocol)
- ✅ `http://localhost:3000` (correct development)
- ✅ `https://design-rite.onrender.com` (correct production)

**Troubleshooting**:
- Login fails → Check this first!
- 401 errors → Verify matches actual URL
- Session issues → Ensure no trailing slash

---

### Database (Supabase)

#### NEXT_PUBLIC_SUPABASE_URL
**Value**: `https://ickwrbdpuorzdpzqbqpf.supabase.co`
**Purpose**: Supabase project URL
**Required**: ✅ Yes
**Public**: Yes (safe to expose to browser)

**Find this**:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy "Project URL"

---

#### SUPABASE_SERVICE_KEY
**Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long JWT token)
**Purpose**: Admin access to database (bypasses RLS)
**Required**: ✅ Yes
**Public**: ❌ **NEVER expose to browser**

**⚠️ Security**:
- Server-side only
- Full database access
- Never commit to git
- Rotate if compromised

**Find this**:
1. Supabase dashboard → Settings → API
2. Copy "service_role" key (not anon key!)
3. **Verify it starts with `eyJhbGc...`**

**Common Issue**:
- Using anon key instead → RLS errors
- Missing from env → Database failures

---

## 🤖 AI Services

### OpenAI

#### OPENAI_API_KEY
**Value**: `sk-proj-eNFCtLC6t8N9...` (starts with `sk-proj-` or `sk-`)
**Purpose**: OpenAI API access for AI features
**Required**: ✅ Yes (for AI features)
**Cost**: Usage-based billing

**Find this**:
1. Go to https://platform.openai.com/api-keys
2. Create new key or use existing
3. Copy immediately (shown once)

**Usage**:
- AI Discovery Assistant
- Quick estimate AI suggestions
- Content generation

---

#### ASSESSMENT_ASSISTANT_ID
**Value**: `asst_k6HbBQBgNG3p04jxkbqUtplv` (starts with `asst_`)
**Purpose**: OpenAI Assistant ID for assessments
**Required**: ✅ Yes (for AI assessments)

**Find this**:
1. OpenAI dashboard → Assistants
2. Select "Assessment Assistant"
3. Copy Assistant ID

**Alternative**: Can use general assistant if not set

---

#### CREATIVE_ASSISTANT_ID
**Value**: `asst_ybxoe2JxhEOobS84D7VnCGJj`
**Purpose**: Creative content generation
**Required**: ❌ Optional

---

### Anthropic (Claude)

#### ANTHROPIC_API_KEY
**Value**: `sk-ant-api03-JA1mUtTP5VnlNMgKwLjl0SN8...`
**Purpose**: Claude AI for advanced features
**Required**: ❌ Optional (fallback AI)

**Find this**:
1. Go to https://console.anthropic.com
2. Settings → API Keys
3. Create or copy key

---

## 🔧 Optional Variables

### Legacy Admin (Content Management)

#### ADMIN_PASSWORD
**Value**: `ProcessM@ker2025`
**Purpose**: Password for legacy `/admin` content management
**Required**: ❌ Optional (legacy system)

**Note**: This is separate from Next-Auth system
- Used for: Team members, blog, site settings
- Not used for: User management, dashboard

---

### Harvester API

#### NEXT_PUBLIC_HARVESTER_API_URL
**Value**: `http://localhost:8002`
**Purpose**: Spec harvester API connection
**Required**: ❌ Optional (if using harvester)

#### HARVESTER_API_URL
**Value**: `http://localhost:8002`
**Purpose**: Server-side harvester connection
**Required**: ❌ Optional

---

## 📝 Configuration by Environment

### Development (.env.local)

```bash
# Authentication
NEXTAUTH_SECRET=design-rite-v3-super-secret-key-change-in-production-2025
NEXTAUTH_URL=http://localhost:3000

# Database
NEXT_PUBLIC_SUPABASE_URL=https://ickwrbdpuorzdpzqbqpf.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...

# AI Services
OPENAI_API_KEY=sk-proj-...
ASSESSMENT_ASSISTANT_ID=asst_...
ANTHROPIC_API_KEY=sk-ant-...

# Optional
ADMIN_PASSWORD=ProcessM@ker2025
HARVESTER_API_URL=http://localhost:8002
```

---

### Production (Render)

**Set in Render Dashboard → Environment**:

```bash
# Authentication (CRITICAL - Update these!)
NEXTAUTH_SECRET=<generate-new-32-char-random-string>
NEXTAUTH_URL=https://design-rite.onrender.com

# Database (Same as dev)
NEXT_PUBLIC_SUPABASE_URL=https://ickwrbdpuorzdpzqbqpf.supabase.co
SUPABASE_SERVICE_KEY=<same-as-dev>

# AI Services (Same as dev)
OPENAI_API_KEY=<same-as-dev>
ASSESSMENT_ASSISTANT_ID=<same-as-dev>
ANTHROPIC_API_KEY=<same-as-dev>

# Optional
ADMIN_PASSWORD=<change-this-too>
```

**⚠️ Don't Forget**:
- Change NEXTAUTH_SECRET from dev value
- Update NEXTAUTH_URL to production domain
- Consider changing ADMIN_PASSWORD

---

## 🔍 Verification Checklist

### After Setting Environment Variables

**Development**:
- [ ] Create `.env.local` file
- [ ] Copy all required variables
- [ ] Update URLs for localhost
- [ ] Restart dev server
- [ ] Test login works

**Production (Render)**:
- [ ] All variables added in Render dashboard
- [ ] NEXTAUTH_URL matches production domain
- [ ] NEXTAUTH_SECRET is different from dev
- [ ] Click "Save Changes" in Render
- [ ] Trigger manual deploy
- [ ] Test production login

---

## 🚨 Common Issues

### Issue: Login Fails with "Invalid credentials"

**Check**:
1. NEXTAUTH_URL matches current environment
2. NEXTAUTH_SECRET is set
3. SUPABASE_SERVICE_KEY is correct (not anon key)

---

### Issue: Database Errors

**Check**:
1. NEXT_PUBLIC_SUPABASE_URL is correct
2. SUPABASE_SERVICE_KEY is service role key
3. Service key starts with `eyJhbGc...`

---

### Issue: AI Features Don't Work

**Check**:
1. OPENAI_API_KEY is valid
2. API key has credits
3. ASSESSMENT_ASSISTANT_ID exists
4. Assistant is published (not draft)

---

### Issue: Changes Not Reflected

**Development**:
```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

**Production**:
1. Render dashboard → Environment
2. Verify changes saved
3. Manual deploy or wait for auto-deploy

---

## 🔐 Security Best Practices

### Never Commit Secrets

**.gitignore should include**:
```
.env.local
.env*.local
.env.production
```

**Verify**:
```bash
git status
# .env.local should NOT appear
```

---

### Rotate Secrets Regularly

**Every 90 Days**:
- [ ] Generate new NEXTAUTH_SECRET
- [ ] Update in all environments
- [ ] Redeploy
- [ ] Test thoroughly

**If Compromised**:
- [ ] Rotate immediately
- [ ] Check for unauthorized access
- [ ] Review activity logs
- [ ] Notify security team

---

### Store Backups Securely

**Environment Variable Backup**:
1. Export from Render dashboard
2. Encrypt file with 7-Zip (AES-256)
3. Store in secure location
4. Include in disaster recovery plan

---

## 📋 Quick Reference Table

| Variable | Required | Public | Where to Get |
|----------|----------|--------|--------------|
| NEXTAUTH_SECRET | ✅ | ❌ | Generate with `openssl rand -base64 32` |
| NEXTAUTH_URL | ✅ | ❌ | Your domain URL |
| NEXT_PUBLIC_SUPABASE_URL | ✅ | ✅ | Supabase Settings → API |
| SUPABASE_SERVICE_KEY | ✅ | ❌ | Supabase Settings → API (service_role) |
| OPENAI_API_KEY | ✅ | ❌ | OpenAI Dashboard → API Keys |
| ASSESSMENT_ASSISTANT_ID | ✅ | ❌ | OpenAI Assistants page |
| ANTHROPIC_API_KEY | ❌ | ❌ | Anthropic Console → API Keys |
| ADMIN_PASSWORD | ❌ | ❌ | Your choice |

---

## 📞 Getting Help

### If Variables Not Working

1. **Check spelling**: Copy/paste to avoid typos
2. **Verify values**: Ensure no extra spaces or quotes
3. **Restart**: Server (dev) or redeploy (production)
4. **Check logs**: Browser console and Render logs
5. **See**: [Troubleshooting Guide](./TROUBLESHOOTING.md)

### Resources

- **Render Docs**: https://render.com/docs/environment-variables
- **Next-Auth Docs**: https://next-auth.js.org/configuration/options
- **Supabase Docs**: https://supabase.com/docs/guides/api

---

**Last Updated**: October 1, 2025
**Owner**: Dan Kozich
**Questions?** See [Troubleshooting](./TROUBLESHOOTING.md)
