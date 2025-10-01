# Deployment Checklist - Design-Rite v3
**Complete Pre/Post Deployment Guide for Production**

---

## 📋 Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All changes committed to git
- [ ] Code reviewed and tested locally
- [ ] No console errors in browser dev tools
- [ ] All TypeScript errors resolved
- [ ] Tests passing (if applicable)

### 2. Database Preparation
- [ ] Migration scripts ready (if schema changes)
- [ ] Backup current production database
- [ ] Test migrations on staging database first
- [ ] Verify all tables exist in production Supabase

### 3. Environment Variables
- [ ] All required env vars documented
- [ ] Secrets rotated if needed
- [ ] Production URLs configured (not localhost)
- [ ] API keys validated and working
- [ ] See [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)

### 4. Security Check
- [ ] No secrets in code or comments
- [ ] .env.local not committed to git
- [ ] Authentication flows tested
- [ ] Permission checks verified
- [ ] Rate limits configured correctly

---

## 🚀 Deployment Process

### Step 1: Push to GitHub
```bash
git status                    # Verify what's being deployed
git add .                     # Stage all changes
git commit -m "Deploy: [description]"
git push origin main          # Push to main branch
```

### Step 2: Monitor Render Build
1. Go to https://dashboard.render.com
2. Select your Design-Rite v3 service
3. Watch the build logs in real-time
4. Wait for "Build succeeded" message
5. Note the deploy URL once live

### Step 3: Verify Environment Variables
In Render dashboard, check these are set:
```bash
# Authentication
NEXTAUTH_SECRET=design-rite-v3-super-secret-key-change-in-production-2025
NEXTAUTH_URL=https://your-production-domain.com  # NOT localhost!

# Database
NEXT_PUBLIC_SUPABASE_URL=https://ickwrbdpuorzdpzqbqpf.supabase.co
SUPABASE_SERVICE_KEY=[your-service-role-key]

# AI Services
OPENAI_API_KEY=[your-openai-key]
ANTHROPIC_API_KEY=[your-anthropic-key]

# Assistants
ASSESSMENT_ASSISTANT_ID=[your-assistant-id]
CREATIVE_ASSISTANT_ID=[your-assistant-id]
```

---

## ✅ Post-Deployment Testing

### Test 1: Login Flow
**URL**: `https://your-domain.com/admin/login`

**Steps**:
1. Navigate to login page
2. Enter: `dan@design-rite.com` / `Pl@tformbuilder2025`
3. Should redirect to `/admin/super`
4. Dashboard loads with your user info

**Expected Results**:
- ✅ Login successful
- ✅ Redirect to dashboard
- ✅ Stats cards show data
- ✅ User table shows your account
- ✅ Activity feed shows login event

**If Failed**:
- Check NEXTAUTH_URL is production domain (not localhost)
- Verify NEXTAUTH_SECRET is set
- Check Supabase connection
- Ensure admin user exists in production DB

---

### Test 2: Create User
**Location**: `/admin/super`

**Steps**:
1. Click "+ Create New User"
2. Fill form:
   - Email: `test@yourcompany.com`
   - Password: `TestUser123!`
   - Name: `Test User`
   - Role: `user`
3. Click "Create User"

**Expected Results**:
- ✅ Success message appears
- ✅ Redirect to dashboard
- ✅ New user in user table
- ✅ Activity log shows "user_created"

**If Failed**:
- Check SUPABASE_SERVICE_KEY is set
- Verify `users` table exists
- Check browser console for errors

---

### Test 3: User Actions (Suspend)
**Location**: `/admin/super` - User table

**Steps**:
1. Find test user in table
2. Click "Suspend" button (yellow)
3. Confirm in dialog
4. Wait for success message

**Expected Results**:
- ✅ Confirmation dialog appears
- ✅ "User suspended successfully" alert
- ✅ User status badge changes to "suspended"
- ✅ Dashboard refreshes
- ✅ Activity log shows "user_suspended"

**If Failed**:
- Check `/api/admin/suspend-user` route exists
- Verify SUPABASE_SERVICE_KEY is set
- Check browser network tab for API errors

---

### Test 4: User Actions (Delete)
**Location**: `/admin/super` - User table

**Steps**:
1. Find test user in table
2. Click "Delete" button (red - only for super admin)
3. Confirm in warning dialog
4. Wait for success message

**Expected Results**:
- ✅ Warning dialog with ⚠️ icon
- ✅ "User deleted successfully" alert
- ✅ User disappears from table
- ✅ Dashboard refreshes
- ✅ Activity log shows "user_deleted"

**If Failed**:
- Verify you're logged in as super_admin
- Check `/api/admin/delete-user` route exists
- Check browser console for errors

---

### Test 5: Data Exports
**Location**: `/admin/super` - Data Exports section

**Steps**:
1. Click "📥 Export All Users"
2. Click "📥 Export Activity Logs"
3. Click "📥 Export Database Backup" (super admin only)

**Expected Results**:
- ✅ Each export downloads a file:
  - `users_export_2025-10-01.csv`
  - `activity_logs_export_2025-10-01.csv`
  - `database_backup_2025-10-01.json`
- ✅ Files contain data (not empty)
- ✅ CSV opens in Excel/Sheets
- ✅ JSON is valid format

**If Failed**:
- Check `/api/admin/export` route exists
- Verify SUPABASE_SERVICE_KEY is set
- Check browser console for errors
- Try different browser

---

### Test 6: Activity Logging
**Location**: `/admin/super` - Recent Activity section

**Steps**:
1. Scroll to "Recent Activity (Live Feed)"
2. Review recent actions
3. Look for your login, user creation, suspend, delete

**Expected Results**:
- ✅ Shows last 50 actions
- ✅ Each has timestamp, user name, action
- ✅ Success/failure badges visible
- ✅ IP addresses shown (if available)
- ✅ Actions are in chronological order (newest first)

**If Failed**:
- Check `activity_logs` table in Supabase
- Verify `/api/admin/dashboard` route
- Check if actions are being logged

---

### Test 7: Main Platform Features
**Test the core business features still work**:

1. **Security Estimate**:
   - Go to `/estimate-options`
   - Try "Quick Security Estimate"
   - Verify form loads and submits

2. **AI Discovery**:
   - Go to `/ai-assessment`
   - Start an assessment
   - Check AI responses work

3. **System Surveyor**:
   - Go to `/integrations/system-surveyor/upload`
   - Upload a test Excel file
   - Verify parsing works

**Expected Results**:
- ✅ All core features functional
- ✅ No errors in browser console
- ✅ Data saves correctly
- ✅ AI responses generate

**If Failed**:
- Check OPENAI_API_KEY is set
- Verify ASSESSMENT_ASSISTANT_ID is valid
- Check Supabase connection
- Review API logs in Render

---

## 🔄 Rollback Procedure

**If deployment has critical issues:**

### Quick Rollback (Render Dashboard)
1. Go to Render dashboard
2. Click on your service
3. Click "Manual Deploy" tab
4. Select previous successful deploy
5. Click "Deploy"
6. Monitor build and verify

### Git Rollback (If Needed)
```bash
# Find the last good commit
git log --oneline

# Revert to that commit
git revert [commit-hash]

# Or hard reset (use with caution)
git reset --hard [commit-hash]

# Force push to trigger redeploy
git push origin main --force
```

### Database Rollback
1. **Stop all writes** to production database
2. Go to Supabase dashboard
3. Restore from most recent backup
4. Verify data integrity
5. Test login and critical features
6. Resume normal operations

---

## 📊 Monitoring After Deployment

### First Hour
- [ ] Check every 15 minutes for errors
- [ ] Monitor Render logs for crashes
- [ ] Test login flow multiple times
- [ ] Watch for failed API calls

### First Day
- [ ] Check hourly for issues
- [ ] Monitor user activity logs
- [ ] Review error rates in Render
- [ ] Test all critical features

### First Week
- [ ] Daily check of platform health
- [ ] Review new user signups
- [ ] Monitor performance metrics
- [ ] Check for security alerts

---

## 🚨 Common Deployment Issues

### Issue: Login Fails with 401
**Cause**: NEXTAUTH_URL still pointing to localhost

**Fix**:
1. Go to Render dashboard → Environment
2. Update `NEXTAUTH_URL=https://your-production-domain.com`
3. Save and redeploy

---

### Issue: "Cannot find module" errors
**Cause**: Missing dependencies or build cache issue

**Fix**:
1. In Render dashboard, click "Clear build cache"
2. Trigger manual deploy
3. If still fails, check `package.json` for missing deps

---

### Issue: Database connection fails
**Cause**: Wrong Supabase keys or network issue

**Fix**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` in env vars
2. Check `SUPABASE_SERVICE_KEY` is service role (not anon key)
3. Test connection from Supabase dashboard
4. Check Supabase status page for outages

---

### Issue: Environment variables not loading
**Cause**: Typo in variable name or not saved

**Fix**:
1. Go to Render → Environment tab
2. Verify all variables are spelled correctly
3. Click "Save Changes" button
4. Redeploy service

---

## 📝 Deployment Log Template

**Use this template to document each deployment:**

```markdown
## Deployment - [Date]

**Deployed By**: Dan Kozich
**Branch**: main
**Commit**: [commit hash]
**Deploy Time**: [time]

### Changes Deployed:
- [ ] Feature/fix description
- [ ] Database changes (if any)
- [ ] Environment variables added/changed

### Pre-Deployment:
- [x] Code tested locally
- [x] Database backup created
- [x] Environment variables verified

### Post-Deployment Tests:
- [x] Login flow working
- [x] User creation working
- [x] Data exports working
- [x] Activity logging working
- [x] Core features working

### Issues Encountered:
- None / [describe any issues]

### Rollback Required:
- No / Yes - [reason]

### Next Steps:
- [any follow-up actions needed]
```

---

## ✨ Success Criteria

**Deployment is successful when:**

✅ All post-deployment tests pass
✅ No errors in Render logs
✅ Login flow works smoothly
✅ User management functions correctly
✅ Data exports download properly
✅ Activity logging captures events
✅ Core business features operational
✅ No user-reported issues within 24 hours

---

**Last Updated**: October 1, 2025
**Next Review**: After Phase 3 deployment
