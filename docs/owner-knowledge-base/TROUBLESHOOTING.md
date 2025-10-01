# Troubleshooting Guide - Design-Rite v3
**Quick Fixes for Common Issues**

---

## 🚨 Login & Authentication Issues

### Problem: Can't Login - "Invalid email or password"

**Possible Causes**:
- Wrong credentials
- Account suspended
- User doesn't exist in production database

**Solutions**:
1. **Verify credentials**:
   - Email: `dan@design-rite.com` (all lowercase)
   - Password: `Pl@tformbuilder2025` (case-sensitive)

2. **Check account status** in Supabase:
   ```sql
   SELECT email, status, role FROM users
   WHERE email = 'dan@design-rite.com';
   ```
   - If `status = 'suspended'`: Unsuspend in database
   - If no results: User doesn't exist, run creation script

3. **Create admin user** if missing:
   ```bash
   node scripts/create-admin-simple.mjs
   ```

4. **Clear browser cache**:
   - Chrome: Ctrl+Shift+Delete → Clear cookies
   - Try incognito mode

---

### Problem: Login Redirects Back to Login Page

**Cause**: Session not being created properly

**Solutions**:
1. **Check NEXTAUTH_URL**:
   - Production: `https://your-domain.com` (NO trailing slash)
   - Development: `http://localhost:3000`
   - NOT `http://localhost:3010`

2. **Verify NEXTAUTH_SECRET** is set in environment variables

3. **Clear browser cookies**:
   - Delete `next-auth.session-token` cookie
   - Try different browser

4. **Check Render logs**:
   - Look for "session" or "auth" errors
   - Verify no missing dependencies

---

### Problem: 401 Unauthorized After Login

**Cause**: Session token not being read correctly

**Solutions**:
1. **Restart dev server** (if local):
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Check browser DevTools**:
   - Application → Cookies
   - Verify `next-auth.session-token` exists
   - Check expiration date

3. **Verify environment variables**:
   ```bash
   NEXTAUTH_SECRET=design-rite-v3-super-secret-key-change-in-production-2025
   NEXTAUTH_URL=https://your-domain.com
   ```

4. **Hard refresh page**: Ctrl+Shift+R

---

## 📊 Dashboard Issues

### Problem: Dashboard Shows No Data

**Cause**: Database connection or query issue

**Solutions**:
1. **Check Supabase connection**:
   - Go to https://supabase.com/dashboard
   - Verify project is active
   - Check API keys are correct

2. **Verify tables exist**:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```
   - Should see: users, activity_logs, permissions, etc.

3. **Check environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`

4. **Review browser console** (F12):
   - Look for API errors
   - Check network tab for failed requests

---

### Problem: Stats Cards Show Zero

**Cause**: No activity or query issue

**Solutions**:
1. **Normal if new deployment**:
   - Create a user → Total Users increases
   - Login → Active Now increases
   - Generate quote → Quotes Today increases

2. **Check activity_logs table**:
   ```sql
   SELECT COUNT(*) FROM activity_logs
   WHERE timestamp >= CURRENT_DATE;
   ```

3. **Verify `/api/admin/dashboard` route**:
   - Check Render logs for errors
   - Test API endpoint directly

---

### Problem: User Table Empty

**Cause**: No users in database or query filtering issue

**Solutions**:
1. **Check users table**:
   ```sql
   SELECT COUNT(*) FROM users WHERE status != 'deleted';
   ```

2. **Create your admin user**:
   ```bash
   node scripts/create-admin-simple.mjs
   ```

3. **Check RLS policies**:
   - Ensure super_admin can read all users
   - Verify service key has proper permissions

---

## 🔘 Action Button Issues

### Problem: Action Buttons Don't Respond

**Cause**: JavaScript error or API route missing

**Solutions**:
1. **Check browser console** (F12):
   - Look for JavaScript errors
   - Check for "Failed to fetch" errors

2. **Verify API routes exist**:
   - `/api/admin/suspend-user/route.ts`
   - `/api/admin/delete-user/route.ts`

3. **Hard refresh**: Ctrl+Shift+R

4. **Try different browser**

---

### Problem: Suspend Button Shows Success But User Still Active

**Cause**: Database update failed silently

**Solutions**:
1. **Check Supabase logs**:
   - Look for update errors
   - Verify RLS policies allow update

2. **Manually suspend in database**:
   ```sql
   UPDATE users
   SET status = 'suspended'
   WHERE email = 'user@example.com';
   ```

3. **Refresh dashboard**: Click refresh or reload page

---

### Problem: Delete Button Not Visible

**Cause**: Not logged in as super_admin

**Solutions**:
1. **Verify your role**:
   - Check top of dashboard: "(super_admin)" should show
   - If shows "(admin)", you don't have super_admin role

2. **Update role in database**:
   ```sql
   UPDATE users
   SET role = 'super_admin'
   WHERE email = 'dan@design-rite.com';
   ```

3. **Logout and login again**

---

## 📥 Data Export Issues

### Problem: Export Downloads Empty File

**Cause**: No data or query error

**Solutions**:
1. **Verify data exists**:
   ```sql
   SELECT COUNT(*) FROM users WHERE status != 'deleted';
   SELECT COUNT(*) FROM activity_logs;
   ```

2. **Check `/api/admin/export` route**:
   - Review Render logs
   - Look for query errors

3. **Try different export type**:
   - If Users fails, try Activity Logs
   - Helps identify specific vs. global issue

---

### Problem: Export Shows 403 Forbidden

**Cause**: Insufficient permissions

**Solutions**:
1. **Verify you're super_admin or admin**:
   - Check session in browser DevTools
   - Review dashboard header for role

2. **Database backup requires super_admin**:
   - Only super_admin can export full database
   - Regular admin can only export users/activity

3. **Login again** to refresh session

---

### Problem: CSV File Won't Open

**Cause**: Browser or file encoding issue

**Solutions**:
1. **Try different application**:
   - Excel
   - Google Sheets
   - Notepad (to check format)

2. **Check file size**:
   - If 0 bytes, export failed
   - Re-export and check browser console

3. **Verify CSV format**:
   - Open in text editor
   - Should see headers and comma-separated values

---

## 🔄 Database Issues

### Problem: "Table does not exist" Error

**Cause**: Database migrations not run

**Solutions**:
1. **Run migration SQL**:
   - Go to Supabase SQL Editor
   - Run `supabase/auth_tables_safe.sql`
   - Verify tables created

2. **Check Supabase project**:
   - Make sure you're in correct project
   - Verify project is active

3. **Review Table Editor**:
   - Should see: users, activity_logs, permissions, etc.

---

### Problem: "RLS policy violation" Error

**Cause**: Row Level Security blocking access

**Solutions**:
1. **Verify service key** (not anon key):
   - `SUPABASE_SERVICE_KEY` should start with `eyJ...`
   - Service key bypasses RLS

2. **Check RLS policies**:
   ```sql
   SELECT * FROM pg_policies
   WHERE tablename = 'users';
   ```

3. **Temporarily disable RLS** (testing only):
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ```
   - ⚠️ Re-enable after testing!

---

### Problem: Duplicate Key Error When Creating User

**Cause**: Email or access code already exists

**Solutions**:
1. **Check for existing user**:
   ```sql
   SELECT * FROM users
   WHERE email = 'user@example.com'
   OR access_code = 'DR-US-ACME-001';
   ```

2. **Use different email** or access code

3. **Delete duplicate** if it's an error:
   ```sql
   DELETE FROM users
   WHERE email = 'user@example.com'
   AND status = 'deleted';
   ```

---

## 🌐 Production Deployment Issues

### Problem: Build Fails in Render

**Cause**: Dependencies or TypeScript errors

**Solutions**:
1. **Check Render build logs**:
   - Look for "npm install" errors
   - Check for TypeScript compilation errors

2. **Clear build cache**:
   - Render dashboard → Manual Deploy
   - Check "Clear build cache"
   - Redeploy

3. **Verify package.json**:
   - All dependencies listed
   - No version conflicts

4. **Test build locally**:
   ```bash
   npm run build
   ```

---

### Problem: Environment Variables Not Loading

**Cause**: Not saved or typo in name

**Solutions**:
1. **Check Render Environment tab**:
   - Verify all variables present
   - Check for typos in names
   - Click "Save Changes"

2. **Restart service**:
   - Render dashboard → Manual Deploy
   - Or wait for auto-deploy

3. **Verify variable names** match code:
   - `NEXTAUTH_SECRET` not `NEXT_AUTH_SECRET`
   - `NEXTAUTH_URL` not `NEXT_AUTH_URL`

---

### Problem: NEXTAUTH_URL Still Shows Localhost

**Cause**: Environment variable not updated for production

**Solutions**:
1. **Update in Render**:
   - Environment tab
   - `NEXTAUTH_URL=https://your-actual-domain.com`
   - No trailing slash!
   - Save and redeploy

2. **Verify in code**:
   - Should NOT be hardcoded
   - Must come from env var

---

## 🔍 Debugging Tips

### Use Browser DevTools

**Console Tab** (F12):
- See JavaScript errors
- Check API responses
- View console.log outputs

**Network Tab**:
- See all API requests
- Check status codes (200, 401, 500)
- View request/response payloads

**Application Tab**:
- View cookies (session tokens)
- Check LocalStorage
- Inspect SessionStorage

---

### Check Render Logs

1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. Look for:
   - Error messages
   - API route errors
   - Database connection issues
   - Missing environment variables

---

### Check Supabase Logs

1. Go to Supabase dashboard
2. Select your project
3. Click "Logs" → "Postgres Logs"
4. Look for:
   - Failed queries
   - RLS violations
   - Connection errors

---

## 🆘 Emergency Procedures

### Platform Completely Down

**Steps**:
1. **Check Render status**:
   - Is service running?
   - Check for deployment errors

2. **Rollback to previous version**:
   - Render → Manual Deploy
   - Select last working deploy

3. **Check Supabase status**:
   - https://status.supabase.com
   - Verify no outage

4. **Test in different browser/incognito**:
   - Rules out browser cache issues

---

### Data Corruption Suspected

**Steps**:
1. **Stop all operations immediately**
2. **Don't make changes until verified**
3. **Export current state**:
   ```bash
   # From Supabase SQL Editor
   COPY users TO STDOUT WITH CSV HEADER;
   ```
4. **Restore from backup**:
   - Use most recent good backup
   - See [Admin Operations](./ADMIN_OPERATIONS.md#restore-from-backup)

---

### Security Breach

**Steps**:
1. **Immediately suspend affected accounts**
2. **Rotate all API keys**:
   - NEXTAUTH_SECRET
   - SUPABASE_SERVICE_KEY
   - OPENAI_API_KEY
3. **Export activity logs**:
   - Review all actions by suspected user
4. **Change admin passwords**
5. **Contact development team**

---

## 📞 When to Get Help

### Contact Development Team If:
- Problem persists after trying all solutions
- Database corruption suspected
- Security breach confirmed
- Build failures you can't resolve
- Data loss that backup can't fix

### Provide This Information:
1. What you were trying to do
2. What happened instead
3. Error messages (screenshots)
4. Steps to reproduce
5. Recent changes (deployments, config)
6. Browser console errors
7. Render/Supabase logs

---

## 🔗 Helpful Links

- **Render Dashboard**: https://dashboard.render.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub Repository**: [Your repo URL]
- **Admin Operations**: [ADMIN_OPERATIONS.md](./ADMIN_OPERATIONS.md)
- **Deployment Guide**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Environment Variables**: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)

---

**Last Updated**: October 1, 2025
**Need more help?** Check the full documentation in `/docs`
