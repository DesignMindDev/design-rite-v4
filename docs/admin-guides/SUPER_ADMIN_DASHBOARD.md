# Super Admin Dashboard - User Guide
**Design-Rite v3 - Admin Access Control System**

---

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [User Management](#user-management)
4. [Activity Monitoring](#activity-monitoring)
5. [Data Exports](#data-exports)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Accessing the Dashboard

1. **Login URL**: `http://localhost:3010/admin/login` (Development) or `https://yourdomain.com/admin/login` (Production)
2. **Credentials**: Use your super admin email and password
3. **Dashboard URL**: After login, navigate to `/admin/super`

### First Time Setup

If you're setting up for the first time:

1. **Create Your Super Admin Account**:
   ```bash
   # Run the admin creation script
   node scripts/create-admin-simple.mjs
   ```

2. **Default Credentials** (if using the script):
   - Email: `dan@design-rite.com`
   - Password: `Pl@tformbuilder2025`
   - **⚠️ Change this password immediately in production!**

3. **Login and Access Dashboard**:
   - Go to `/admin/login`
   - Enter credentials
   - You'll be redirected to `/admin/super`

---

## 📊 Dashboard Overview

### Quick Statistics

When you open the dashboard, you'll see four key metrics at the top:

#### 1. **Total Users** (Purple Card)
- Shows total number of active users in the system
- Excludes deleted users
- Click to filter user list below

#### 2. **Active Now** (Green Card)
- Users who logged in within the last 24 hours
- Real-time activity indicator
- Helps identify platform engagement

#### 3. **Quotes Today** (Blue Card)
- Number of quotes generated today
- Tracks platform usage
- Resets at midnight

#### 4. **AI Sessions Today** (Yellow Card)
- Completed AI Discovery Assistant sessions
- Shows AI feature adoption
- Useful for tracking value delivered

### Navigation

- **Back to Platform**: Returns to main Design-Rite app
- **Logout**: Ends your admin session

---

## 👥 User Management

### User List Table

The main user table shows all users with the following columns:

| Column | Description |
|--------|-------------|
| **Name** | User's full name |
| **Email** | Login email address |
| **Company** | User's organization |
| **Role** | User access level (see roles below) |
| **Status** | Account status (active/suspended/pending) |
| **Last Login** | Most recent login timestamp |
| **Actions** | Quick action buttons |

### User Roles

#### 🔴 Super Admin
- **Who**: Platform owner (you)
- **Access**: Unlimited - can do everything
- **Restrictions**: None

#### 🟣 Admin
- **Who**: Trusted team members
- **Access**: Can create/manage User and Manager accounts
- **Restrictions**: Cannot create other Admins or Super Admins

#### 🔵 Manager
- **Who**: Sales engineers, project managers
- **Access**: Unlimited quotes and AI features
- **Restrictions**: Cannot manage users

#### 🟢 User
- **Who**: Standard customers
- **Access**: 10 quotes/day, 5 AI sessions/day
- **Restrictions**: Rate limited features

#### ⚪ Guest
- **Who**: Public/trial users
- **Access**: 3 quick estimates per week
- **Restrictions**: Very limited access

### Creating a New User

1. **Click "+ Create New User"** button (top right of User Management section)

2. **Fill in the form**:
   - **Email Address** * (required): User's login email
   - **Password** * (required): Minimum 8 characters
   - **Full Name** * (required): User's display name
   - **Role** * (required): Select appropriate role
     - ⚠️ **Admins can only create User or Manager roles**
     - Super Admins can create any role
   - **Company** (optional): User's organization
   - **Phone** (optional): Contact number
   - **Access Code** (optional): Unique code like `DR-US-ACME-001`
   - **Notes** (optional): Internal notes about this user

3. **Click "Create User"** or "Cancel"

4. **Success**: You'll see a confirmation message with the new user ID, then auto-redirect to the dashboard

### User Actions

For each user in the table, you can:

- **Edit**: Modify user details (coming soon)
- **Activity**: View user's activity logs (coming soon)
- **Suspend**: Temporarily disable account (for active users)

---

## 📈 Activity Monitoring

### Recent Activity Feed

The live activity feed shows the last 50 actions across all users:

#### What's Logged:
- ✅ **Login** - Successful login
- ❌ **Failed Login** - Wrong password or suspended account
- 📝 **Quote Generated** - User created a quote
- 🤖 **AI Assessment Completed** - Finished AI Discovery session
- 👤 **User Created** - Admin created a new user
- 📥 **Data Exported** - User downloaded data
- 🔒 **User Suspended** - Account suspended

#### Activity Details:

Each activity entry shows:
- **Timestamp**: When the action occurred
- **Status Badge**: Success (green) or Failed (red)
- **User Name**: Who performed the action
- **Action**: What they did
- **Resource Type**: What they acted on (if applicable)
- **IP Address**: Where the action came from

#### Using the Activity Feed:

**Monitor Platform Usage**:
```
Recent logins → Platform engagement
Quote generation → Business activity
Failed logins → Potential security issues
```

**Security Monitoring**:
- Multiple failed logins from same user → Possible attack
- Unusual IP addresses → Investigate further
- Unexpected admin actions → Audit user permissions

---

## 📥 Data Exports

The dashboard provides four export options:

### 1. Export All Users (CSV)

**What It Includes**:
- User ID, Email, Full Name
- Role, Company, Phone
- Status, Created At
- Last Login, Login Count

**How to Export**:
1. Click "📥 Export All Users" button
2. File downloads automatically as `users_export_2025-10-01.csv`
3. Open in Excel, Google Sheets, or any spreadsheet software

**Use Cases**:
- User audits
- Reporting to stakeholders
- Backup user list
- Integration with other systems

---

### 2. Export All Quotes (Coming Soon)

**Status**: Not yet implemented

**Planned Features**:
- All quotes from current month
- Complete BOM data
- CSV format
- Customer details included

---

### 3. Export Activity Logs (CSV)

**What It Includes**:
- Last 90 days of activity
- User email and name
- Action, Resource Type, Resource ID
- Timestamp, Success status
- IP Address

**How to Export**:
1. Click "📥 Export Activity Logs" button
2. File downloads as `activity_logs_export_2025-10-01.csv`
3. Open in spreadsheet software

**Use Cases**:
- Security audits
- Compliance reporting
- Troubleshooting user issues
- Platform usage analytics

**Example Data**:
```csv
ID,User Email,User Name,Action,Timestamp,Success,IP Address
abc123,user@company.com,John Doe,login,2025-10-01 10:30:00,true,192.168.1.100
def456,user@company.com,John Doe,quote_generated,2025-10-01 10:45:00,true,192.168.1.100
```

---

### 4. Export Database Backup (JSON)

**⚠️ Super Admin Only** - Regular admins cannot access this export

**What It Includes**:
- **Complete database snapshot**:
  - All users (including deleted)
  - All activity logs (last 10,000 records)
  - All permissions
  - All active sessions
  - All usage tracking data

**How to Export**:
1. Click "📥 Export Database Backup" button
2. File downloads as `database_backup_2025-10-01.json`
3. Store securely - contains sensitive data

**File Structure**:
```json
{
  "export_date": "2025-10-01T14:30:00.000Z",
  "exported_by": "dan@design-rite.com",
  "data": {
    "users": [...],
    "activity_logs": [...],
    "permissions": [...],
    "user_sessions": [...],
    "usage_tracking": [...]
  }
}
```

**Use Cases**:
- Disaster recovery
- Data migration
- Platform audits
- Development/testing data

**⚠️ Security Warning**:
- Contains password hashes and sensitive user data
- Store encrypted in a secure location
- Do not share or commit to version control
- Delete old backups after 90 days (or per your compliance policy)

---

## 🔧 Troubleshooting

### Problem: Can't Access Dashboard After Login

**Symptoms**: Redirected to `/admin/login` even after successful login

**Solutions**:
1. **Check Your Role**: Only `super_admin` and `admin` roles can access `/admin/super`
2. **Clear Browser Cookies**: Session might be corrupted
   - Chrome: Settings → Privacy → Clear browsing data → Cookies
   - Firefox: Settings → Privacy → Clear Data → Cookies
3. **Check Session Token**: Open DevTools → Application → Cookies → Look for `next-auth.session-token`
4. **Try Incognito/Private Window**: Rules out browser extension issues

---

### Problem: "Unauthorized" Error on Dashboard

**Symptoms**: 401 Unauthorized error when viewing dashboard

**Solutions**:
1. **Refresh the Page**: Session might need to reload
2. **Log Out and Log Back In**: `/admin/login`
3. **Check Environment Variables**:
   ```bash
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3010
   ```
4. **Verify Database Connection**: Check Supabase is accessible

---

### Problem: Create User Button Does Nothing

**Symptoms**: Clicking "+ Create New User" doesn't navigate

**Solutions**:
1. **Check Browser Console**: Press F12 → Console tab → Look for JavaScript errors
2. **Verify Route Exists**: Navigate manually to `/admin/super/create-user`
3. **Clear Next.js Cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### Problem: User Creation Fails

**Symptoms**: Error message after submitting create user form

**Common Errors & Solutions**:

#### "User with this email already exists"
- Check existing users in the user list
- User might be suspended or deleted (still in database)
- Use a different email address

#### "This access code is already in use"
- Access codes must be unique
- Try a different code or leave blank

#### "Admins can only create User or Manager roles"
- You're logged in as `admin` (not `super_admin`)
- You can only create `user` or `manager` roles
- Super Admin needed to create other admins

#### "Failed to create user: [database error]"
- Check Supabase connection
- Verify `users` table exists in database
- Check `SUPABASE_SERVICE_KEY` environment variable

---

### Problem: Exports Return Empty Files

**Symptoms**: CSV/JSON downloads but has no data

**Solutions**:
1. **Check Database**: Verify data exists in Supabase tables
2. **Check Permissions**: Ensure your role can export (admin or super_admin)
3. **Check API Route**: Verify `/api/admin/export` is accessible
4. **Browser Console**: Look for network errors (F12 → Network tab)

---

### Problem: Activity Feed Shows "No recent activity"

**Symptoms**: Activity feed is empty even with platform usage

**Solutions**:
1. **Check `activity_logs` Table**: Verify logs are being written to database
2. **Check Date Range**: Activity feed shows last 50 actions only
3. **Trigger an Action**: Try logging in/out to generate new activity
4. **Database Permissions**: Verify RLS policies allow reading activity_logs

---

## 🔐 Security Best Practices

### Password Management
- Change default password immediately
- Use minimum 12 characters
- Include uppercase, lowercase, numbers, special characters
- Don't reuse passwords from other systems

### Access Control
- Only create admin accounts for trusted team members
- Use `manager` role for sales engineers (not `admin`)
- Regularly review user list and suspend inactive accounts
- Document who has admin access

### Activity Monitoring
- Review activity logs weekly
- Investigate multiple failed login attempts
- Monitor for unusual IP addresses
- Set up alerts for suspicious activity (Phase 3 feature)

### Data Export Security
- Only export when necessary
- Encrypt exported files
- Store backups in secure, encrypted location
- Delete old exports after retention period
- Never commit exports to version control

---

## 📞 Support & Additional Resources

### Documentation
- **Setup Guide**: See `ADMIN_AUTH_SETUP.md` for initial setup
- **API Reference**: Coming soon in `docs/api-reference/`
- **Developer Guide**: Coming soon in `docs/developer-guides/`

### Common Questions
- **How do I reset a user's password?** - User edit functionality coming in Phase 3
- **Can I bulk import users?** - Not yet, planned for Phase 4
- **How do I delete a user?** - Soft delete via user edit (coming soon)
- **Where are sessions stored?** - `user_sessions` table in Supabase

---

**Last Updated**: October 1, 2025
**Version**: Phase 2 - User Management & Dashboard
**Author**: Design-Rite Development Team
