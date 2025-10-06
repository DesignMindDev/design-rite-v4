# Render Staging Service Setup

**Service**: Design-Rite Validation Lab
**Date**: 2025-10-06

---

## 🚀 **Create New Web Service**

### Step 1: Log In to Render

1. Go to https://dashboard.render.com
2. Log in with your Render account
3. Click **"New +"** → **"Web Service"**

### Step 2: Connect GitHub Repository

1. **Connect Repository**:
   - Repository: `DesignMindDev/design-rite-v3`
   - If not listed, click "Configure account" to grant access

2. **Service Configuration**:
   ```
   Name: design-rite-staging
   Region: Oregon (US West) - Same as production
   Branch: staging  ⚠️ IMPORTANT: Select "staging" branch
   Root Directory: (leave blank)
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm run start
   ```

3. **Advanced Settings**:
   ```
   Auto-Deploy: OFF  ⚠️ IMPORTANT: Manual deployments only
   Pre-Deploy Command: (leave blank)
   Health Check Path: /
   ```

### Step 3: Configure Instance

```
Instance Type: Standard (same as production)
  - 2 GB RAM
  - 1 CPU
  - $25/month

OR

Instance Type: Starter (for testing)
  - 512 MB RAM
  - 0.5 CPU
  - $7/month
```

**Recommendation**: Start with Starter, upgrade to Standard after validation

---

## 🔐 **Environment Variables**

### Copy from Production + Modify

**Navigate to**: Settings → Environment → Environment Variables

### Required Variables

```bash
# ========================================
# Supabase Configuration (STAGING)
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://[staging-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key-from-supabase]
SUPABASE_SERVICE_KEY=[staging-service-role-key-from-supabase]

# ========================================
# OpenAI Configuration (Production Key OK)
# ========================================
OPENAI_API_KEY=[same-as-production]
ASSESSMENT_ASSISTANT_ID=[same-as-production]
SEARCH_ASSISTANT_ID=[same-as-production]
GENERAL_ASSISTANT_ID=[same-as-production]

# ========================================
# Stripe Configuration (TEST MODE)
# ========================================
STRIPE_SECRET_KEY=sk_test_[your-stripe-test-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[your-stripe-test-publishable]
STRIPE_WEBHOOK_SECRET=whsec_[staging-webhook-secret]

# ========================================
# Next.js Configuration
# ========================================
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_APP_URL=https://design-rite-staging.onrender.com

# ========================================
# Feature Flags (Enable ALL in staging)
# ========================================
NEXT_PUBLIC_FEATURE_FLAGS=team_repo_dashboard,voltage_calculator,tier_system,new_ai_provider

# ========================================
# Email Configuration (Same as Production)
# ========================================
SMTP_HOST=[your-smtp-host]
SMTP_PORT=587
SMTP_USER=[your-smtp-user]
SMTP_PASSWORD=[your-smtp-password]
SMTP_FROM=noreply@design-rite.com

# ========================================
# Optional: Monitoring
# ========================================
SENTRY_DSN=[your-sentry-dsn]
SENTRY_ENVIRONMENT=staging
```

### Environment Variable Groups (Optional)

Create environment variable groups for easier management:

**Group 1: Supabase Staging**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY

**Group 2: Stripe Test Mode**
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET

---

## 🔧 **Build & Deploy Settings**

### Build Configuration

```yaml
Build Command: npm install && npm run build
Start Command: npm run start
Node Version: 20.x (match production)
```

### Health Checks

```
Health Check Path: /
Health Check Interval: 30 seconds
```

### Auto-Deploy Settings

```
Auto-Deploy: DISABLED ⚠️

Reason: Manual validation required before deployment
```

### Manual Deployment Process

1. Go to Render dashboard → design-rite-staging service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Select branch: **staging**
4. Click **"Deploy"**
5. Monitor build logs
6. Wait for deployment to complete (~3-5 minutes)

---

## 👥 **Team Access**

### Add Team Members

1. Go to **Settings → Access Control**
2. Click **"Invite Team Member"**

**Add:**

**Phil Lisk**
- Email: [Phil's email]
- Role: Developer

**Nicholas Munn**
- Email: munnymancom@gmail.com
- Role: Developer

**Permissions:**
- View logs
- Trigger manual deployments
- Update environment variables
- View metrics

---

## 📊 **Monitoring & Alerts**

### Enable Notifications

1. Go to **Settings → Notifications**
2. Configure:
   ```
   Deploy Started: Email to team
   Deploy Succeeded: Email to team
   Deploy Failed: Email to team + Slack (if configured)
   Service Down: Email to team immediately
   ```

### Log Retention

```
Standard Plan: 7 days
Pro Plan: 30 days

Recommendation: Export critical logs to external service
```

### Performance Monitoring

**Metrics to Watch:**
- Response time (should be < 2 seconds)
- Memory usage (should be < 80%)
- CPU usage (should be < 70%)
- Error rate (should be < 1%)

---

## 🔗 **Custom Domain (Optional)**

If you want staging to have a custom subdomain:

1. Go to **Settings → Custom Domain**
2. Add domain: `staging.design-rite.com`
3. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: staging
   Value: design-rite-staging.onrender.com
   ```
4. Wait for SSL certificate (5-10 minutes)

---

## 🧪 **Test Deployment**

### After First Deployment

1. **Check Service Status**:
   - Go to service dashboard
   - Verify status: "Live"
   - Check last deployment: "Succeeded"

2. **Test Homepage**:
   ```
   https://design-rite-staging.onrender.com
   ```
   - Should load without errors
   - Check browser console for errors

3. **Test Authentication**:
   ```
   https://design-rite-staging.onrender.com/login
   ```
   - Try logging in with test account
   - test@design-rite.com / Localtestingonly2025

4. **Test API Endpoints**:
   ```
   https://design-rite-staging.onrender.com/api/health
   ```
   - Should return 200 OK

5. **Check Logs**:
   - Click "Logs" tab
   - Look for any errors or warnings
   - Verify Supabase connection successful

---

## 🔄 **Deployment Workflow**

### Standard Deployment Process

1. **Develop Feature**:
   ```bash
   git checkout develop
   git checkout -b feature/my-feature
   # ... make changes ...
   git commit -m "Add my feature"
   git push origin feature/my-feature
   ```

2. **Merge to Develop**:
   ```bash
   git checkout develop
   git merge feature/my-feature
   git push origin develop
   ```

3. **Promote to Staging** (Manual):
   ```bash
   git checkout staging
   git merge develop
   git push origin staging
   ```

4. **Deploy on Render**:
   - Go to Render dashboard
   - Click "Manual Deploy"
   - Select "staging" branch
   - Click "Deploy"

5. **Validate in Staging**:
   - Test feature thoroughly
   - Complete validation checklist
   - Get team sign-off

6. **Promote to Production**:
   ```bash
   git checkout main
   git merge staging
   git push origin main
   # Then trigger production deployment
   ```

---

## 🚨 **Rollback Procedure**

### If Staging Deployment Fails

1. **Check Build Logs**:
   - Click "Logs" tab
   - Look for error messages
   - Common issues:
     - Missing environment variables
     - Build errors
     - Node version mismatch

2. **Rollback via Git**:
   ```bash
   git checkout staging
   git revert HEAD
   git push origin staging
   # Then re-deploy on Render
   ```

3. **Rollback via Render**:
   - Go to "Events" tab
   - Find last successful deployment
   - Click "Redeploy this version"

---

## 📋 **Pre-Deployment Checklist**

Before each staging deployment:

- [ ] All tests pass locally
- [ ] Build succeeds locally
- [ ] No console errors
- [ ] Environment variables updated (if needed)
- [ ] Database migrations tested (if any)
- [ ] Team notified of deployment

---

## ✅ **Verification Checklist**

After setup complete:

- [ ] Service created and deployed
- [ ] Environment variables configured
- [ ] Health checks passing
- [ ] Team members have access
- [ ] Logs accessible
- [ ] Test deployment successful
- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] API endpoints respond
- [ ] Supabase connection verified

---

## 🔗 **Useful Links**

**Render Dashboard**: https://dashboard.render.com
**Staging Service**: https://design-rite-staging.onrender.com (after setup)
**Render Docs**: https://render.com/docs
**GitHub Repo**: https://github.com/DesignMindDev/design-rite-v3

---

## 📝 **Next Steps**

After Render staging setup:
1. ✅ Render staging service created
2. ⏭️ Configure daily database sync
3. ⏭️ Create promotion scripts
4. ⏭️ Test first deployment
5. ⏭️ Validate team access

---

**Setup Completed**: _______________
**Verified By**: _______________
**Date**: _______________
