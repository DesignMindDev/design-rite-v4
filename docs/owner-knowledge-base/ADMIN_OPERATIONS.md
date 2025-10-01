# Admin Operations Guide - Design-Rite v3
**Daily Platform Management for Dan Kozich**

---

## 🎯 Quick Access

**Dashboard**: `https://your-domain.com/admin/super`
**Login**: `dan@design-rite.com` / `Pl@tformbuilder2025`

---

## 👥 User Management Operations

### Creating a New User

**When to do this**:
- New team member joining
- Customer requesting platform access
- Partner needing access

**Steps**:
1. Login to `/admin/super`
2. Click "+ Create New User" button
3. Fill in required fields:
   - **Email**: User's login email
   - **Password**: Temporary password (minimum 8 chars)
   - **Full Name**: Display name
   - **Role**: Select appropriate level
4. Optional fields:
   - **Company**: User's organization
   - **Phone**: Contact number
   - **Access Code**: Unique identifier (e.g., `DR-US-ACME-001`)
   - **Notes**: Internal notes about user
5. Click "Create User"
6. Share credentials with user securely (not via email)

**Role Selection Guide**:
- **super_admin**: Only for you (platform owner)
- **admin**: Trusted team members (Phil, senior devs)
- **manager**: Sales engineers, ops team (unlimited features)
- **user**: Standard customers (rate limited)
- **guest**: Trial/demo accounts (very limited)

---

### Suspending a User

**When to do this**:
- Account security concern
- Payment issues
- Terms of service violation
- Temporary access removal

**Steps**:
1. Find user in dashboard table
2. Click "Suspend" button (yellow)
3. Confirm suspension
4. User immediately cannot login
5. Status changes to "suspended"
6. Activity logged automatically

**What happens**:
- User's existing sessions terminated
- Cannot login until reactivated
- Data preserved (not deleted)
- Can be unsuspended later (Phase 3 feature)

---

### Deleting a User

**⚠️ Super Admin Only**

**When to do this**:
- User requests account deletion (GDPR/CCPA)
- Cleaning up old test accounts
- Removing duplicate accounts
- Data retention policy compliance

**Steps**:
1. Find user in dashboard table
2. Click "Delete" button (red)
3. Read warning dialog carefully
4. Confirm deletion
5. User disappears from table
6. Status set to "deleted" (soft delete)

**What happens**:
- User removed from active list
- Cannot login ever again
- Data marked as deleted (not purged)
- Activity logged for audit trail
- Can query deleted users in database if needed

**Cannot delete**:
- Yourself (self-deletion prevented)
- Other super admins (unless you're super admin)

---

### Editing User Details & Permissions

**NEW in Phase 3**: Complete user editing with granular permission control

**When to do this**:
- User changes company or contact info
- Assign specific admin capabilities to team members
- Adjust permissions after role changes
- Fix incorrect user details

**Steps**:
1. Find user in dashboard table
2. Click "Edit" button (purple)
3. Navigate to edit page - you'll see:
   - User details form (email, name, role, status, company, phone)
   - Permission checkboxes organized by category
4. **Update user details** as needed
5. **Assign permissions** by checking/unchecking boxes:
   - 🟣 **Content Management**: Team, blog, videos, settings
   - 🔵 **User Management**: Create, edit, delete users, assign permissions
   - 🟢 **Data & Analytics**: Activity logs, exports, analytics
   - 🟡 **System Access**: Admin panel access, integrations
6. Click "Save Changes"
7. User's permissions take effect immediately

**Permission Guidelines**:
- **Content Editors**: Give content management permissions only
- **Sales Team Leaders**: Can create users, edit users (but not delete/assign)
- **Operations Managers**: View activity, export data, view analytics
- **Full Admins**: All user management + data/analytics permissions
- **Super Admins**: All permissions automatically (cannot be restricted)

**Important notes**:
- Super admins always have all permissions (checkboxes don't apply)
- Admins can only edit users they created (not other admins' users)
- Admins need `can_assign_permissions` to change permissions
- All permission changes are logged in activity logs

---

### Viewing User Activity

**NEW in Phase 3**: Complete admin access audit trail

**When to do this**:
- Security audit or compliance check
- Investigate suspicious behavior
- Verify permission enforcement
- Track who accessed what admin pages

**Steps**:
1. **From dashboard**: Click "Activity" button next to any user
2. **Or navigate directly**: `/admin/super/activity`
3. **View complete access logs** showing:
   - Every admin page access attempt (allowed and denied)
   - Which permissions were checked
   - Timestamps, IP addresses, user agents
   - Success/failure status

**Filtering & Search**:
- **Filter by status**: All / Allowed / Denied access
- **Search by email**: Find specific user's attempts
- **Review statistics**: Total attempts, successful, denied

**Security monitoring**:
```
Multiple denied attempts from same user
→ User may need permissions adjusted

Denied attempts from unexpected IPs
→ Potential security concern - investigate

Unusual after-hours access
→ Verify legitimate business need
```

**Use cases**:
- **Compliance audits**: Export access logs for regulators
- **Security incidents**: Track unauthorized access attempts
- **Permission tuning**: See what users actually need access to
- **User training**: Identify confusion about access levels

---

## 📊 Monitoring & Analytics

### Dashboard Statistics

**Quick Stats Cards** (top of dashboard):

1. **Total Users**:
   - Active user count
   - Excludes deleted users
   - Click to filter user table

2. **Active Now** (24h):
   - Users logged in last 24 hours
   - Platform engagement indicator
   - Green = healthy engagement

3. **Quotes Today**:
   - Number of quotes generated today
   - Business activity metric
   - Resets at midnight

4. **AI Sessions Today**:
   - Completed AI assessments
   - Feature adoption indicator
   - Value delivery metric

---

### Activity Feed Monitoring

**What to watch for**:

**Normal Activity**:
- ✅ Regular logins throughout day
- ✅ Quote generation activity
- ✅ AI assessments completing
- ✅ User creation by admins

**Suspicious Activity**:
- 🚨 Multiple failed logins (same user)
- 🚨 Failed logins from unusual IPs
- 🚨 User creation outside business hours
- 🚨 Rapid quote generation (potential abuse)
- 🚨 Unexpected admin actions

**How to investigate**:
1. Note the suspicious activity
2. Check user details in table
3. Review their recent activity
4. Suspend user if necessary
5. Export activity logs for analysis
6. Contact security team if serious

---

## 💾 Data Export Operations

### Exporting User List

**When to do this**:
- Monthly user audit
- Reporting to stakeholders
- Integration with external systems
- Backup purposes

**Steps**:
1. Go to Data Exports section (bottom of dashboard)
2. Click "📥 Export All Users"
3. File downloads: `users_export_2025-10-01.csv`
4. Open in Excel or Google Sheets

**File contains**:
- User ID, Email, Full Name
- Role, Company, Phone
- Status, Created At
- Last Login, Login Count

**Use cases**:
- Create mailing lists
- Generate user reports
- Audit access levels
- Backup user database

---

### Exporting Activity Logs

**When to do this**:
- Security audit required
- Compliance reporting (SOC 2, etc.)
- Investigating user behavior
- Troubleshooting issues

**Steps**:
1. Click "📥 Export Activity Logs"
2. File downloads: `activity_logs_export_2025-10-01.csv`
3. Contains last 90 days of activity

**File contains**:
- Timestamp, User Email, User Name
- Action, Resource Type, Resource ID
- Success status, IP Address

**Use cases**:
- Security investigations
- Compliance audits
- User behavior analysis
- Issue troubleshooting

---

### Exporting Database Backup

**⚠️ Super Admin Only - Handle with Extreme Care**

**When to do this**:
- Weekly full backup (recommended)
- Before major deployments
- Before database migrations
- Disaster recovery preparation

**Steps**:
1. Click "📥 Export Database Backup"
2. File downloads: `database_backup_2025-10-01.json`
3. **Encrypt immediately**: 7-Zip with AES-256
4. Store in secure location (not cloud without encryption)
5. Delete old backups after 90 days

**File contains**:
- All users (including deleted)
- All activity logs (last 10,000)
- All permissions
- All active sessions
- All usage tracking data

**⚠️ Security Warnings**:
- Contains password hashes
- Contains sensitive user data
- **Never commit to git**
- **Never share unencrypted**
- **Never store on shared drives**
- **Always encrypt before storing**

---

## 🔐 Security Best Practices

### Password Management

**Your Super Admin Password**:
- Change every 90 days minimum
- Use password manager (1Password, Bitwarden)
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Never reuse from other accounts

**User Password Policies**:
- Minimum 8 characters required
- Force strong passwords for admin/manager roles
- Users can reset via future feature (Phase 3)
- Never share passwords via email/Slack

---

### Access Control

**Admin Account Creation**:
- Only create admin accounts for trusted team
- Use `manager` role for sales engineers (not admin)
- Document who has admin access
- Review admin list monthly

**Regular Audits**:
- Weekly: Review new user signups
- Monthly: Audit all admin accounts
- Quarterly: Full permission review
- Suspend inactive users (>90 days)

---

### Activity Monitoring

**Daily Checks**:
- Review activity feed for suspicious actions
- Check for multiple failed login attempts
- Monitor for unusual IP addresses
- Watch for unexpected admin actions

**Weekly Reviews**:
- Export activity logs for analysis
- Look for patterns of abuse
- Check quote generation rates
- Review user suspension reasons

**Monthly Analysis**:
- User growth trends
- Feature usage patterns
- Security incident summary
- Platform performance metrics

---

## 📋 Common Admin Tasks

### Task: Onboard New Team Member

1. **Create user account**:
   - Role: `admin` or `manager` depending on responsibilities
   - Use company email
   - Generate strong temporary password

2. **Configure access**:
   - Set appropriate role
   - Add company name
   - Add internal notes

3. **Share credentials**:
   - Use secure method (password manager share)
   - Instruct to change password on first login (Phase 3)
   - Provide link to user guide

4. **Verify access**:
   - Ask them to login and confirm
   - Check activity log for their login
   - Ensure they can access needed features

---

### Task: Monthly User Audit

1. **Export user list**:
   - Click "Export All Users"
   - Open CSV in spreadsheet

2. **Review each user**:
   - Verify role is still appropriate
   - Check last login date
   - Identify inactive users (>90 days)
   - Look for duplicate accounts

3. **Take action**:
   - Suspend inactive users
   - Delete duplicate accounts
   - Update roles if needed
   - Document changes in activity log

4. **Report findings**:
   - Total active users
   - New users this month
   - Suspended/deleted accounts
   - Any security concerns

---

### Task: Security Incident Response

**If you suspect unauthorized access**:

1. **Immediate Actions**:
   - Suspend affected user account
   - Export activity logs for that user
   - Review their recent actions
   - Check for data exports

2. **Investigation**:
   - Review login IPs and timestamps
   - Check what actions were taken
   - Identify scope of access
   - Determine if data was compromised

3. **Containment**:
   - Suspend all related accounts
   - Rotate API keys if needed
   - Change admin passwords
   - Block suspicious IP addresses (if possible)

4. **Recovery**:
   - Restore from backup if data deleted
   - Unsuspend legitimate users
   - Update security measures
   - Document incident

5. **Post-Incident**:
   - Notify affected users
   - Update security policies
   - Implement additional safeguards
   - Schedule security audit

---

## 🔄 Backup & Recovery

### Regular Backup Schedule

**Daily** (Automated by Supabase):
- Database snapshots
- Point-in-time recovery available
- 7-day retention

**Weekly** (Manual - Your Responsibility):
- Full database export (JSON)
- Encrypt with 7-Zip + AES-256
- Store in secure location
- Test restore process monthly

**Monthly** (Manual):
- Full platform audit
- Comprehensive backup
- Off-site storage
- Verify backup integrity

---

### Restore from Backup

**If data loss occurs**:

1. **Stop all operations**:
   - Prevent further data loss
   - Notify all users of maintenance

2. **Identify backup**:
   - Find most recent good backup
   - Verify file integrity
   - Decrypt backup file

3. **Restore process**:
   - Go to Supabase dashboard
   - Use SQL editor to restore tables
   - Or import from JSON backup
   - Verify data integrity

4. **Test thoroughly**:
   - Login flow works
   - User data intact
   - Activity logs present
   - All features functional

5. **Resume operations**:
   - Notify users system is restored
   - Monitor closely for issues
   - Document what happened

---

## 📞 Getting Help

### Self-Service Resources

1. **Documentation**:
   - [Super Admin Dashboard Guide](../admin-guides/SUPER_ADMIN_DASHBOARD.md)
   - [Troubleshooting Guide](./TROUBLESHOOTING.md)
   - [Environment Variables](./ENVIRONMENT_VARIABLES.md)

2. **System Logs**:
   - Render dashboard: Build and runtime logs
   - Supabase logs: Database queries and errors
   - Browser console: Frontend errors

3. **Diagnostics**:
   - Check Supabase connection
   - Verify environment variables
   - Review recent deployments
   - Test in incognito mode

---

### When to Escalate

**Contact Development Team if**:
- Database corruption suspected
- Security breach confirmed
- Platform-wide outage
- API failures across all users
- Data loss that backup can't fix

**Provide this information**:
- What you were trying to do
- What happened instead
- Error messages (screenshots)
- Recent activity logs
- Steps to reproduce (if known)

---

## 📈 Platform Growth & Scaling

### Monitor These Metrics

**User Growth**:
- New signups per week/month
- Active user percentage
- User retention rate
- Churn rate

**Usage Patterns**:
- Quotes per user per day
- AI assessment adoption
- Peak usage hours
- Feature utilization

**Performance**:
- Page load times
- API response times
- Database query performance
- Error rates

---

### When to Scale Up

**Signs you need more resources**:
- Slow page loads (>3 seconds)
- API timeouts increasing
- Database connection limits hit
- Out of memory errors

**Actions to take**:
1. Review Render dashboard metrics
2. Check Supabase connection pool usage
3. Upgrade Render plan if needed
4. Optimize database queries
5. Contact development team for help

---

**Last Updated**: October 1, 2025
**Owner**: Dan Kozich
**Questions?** See [Troubleshooting Guide](./TROUBLESHOOTING.md)
