# Owner's Knowledge Base - Design-Rite v3
**Quick Reference for Dan Kozich - Platform Owner**

This folder contains all critical information for managing, deploying, and troubleshooting the Design-Rite v3 platform.

---

## 📚 Table of Contents

### Essential Guides
1. **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** ⭐ **Start here for production deployments**
   - Pre-deployment preparation
   - Environment variable verification
   - Post-deployment testing
   - Rollback procedures

2. **[Admin Operations Guide](./ADMIN_OPERATIONS.md)** ⭐ **Daily platform management**
   - User management workflows
   - Common admin tasks
   - Data exports and backups
   - Security best practices

3. **[Troubleshooting Guide](./TROUBLESHOOTING.md)** ⭐ **When things go wrong**
   - Login issues
   - Database problems
   - API errors
   - Quick fixes

4. **[Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)** ⭐ **All config in one place**
   - Required variables
   - Optional settings
   - Production vs development
   - Secret management

---

## 🚀 Quick Start

### First Time Platform Setup
1. Read: [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
2. Configure: [Environment Variables](./ENVIRONMENT_VARIABLES.md)
3. Run: Database migration scripts
4. Create: Your super admin account
5. Test: All features per checklist

### Regular Operations
1. Check: [Admin Operations Guide](./ADMIN_OPERATIONS.md)
2. Monitor: User activity and platform usage
3. Backup: Export data regularly
4. Review: Activity logs weekly

### When Issues Occur
1. Start: [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Check: Environment variables
3. Verify: Database connectivity
4. Contact: Development team if needed

---

## 🔑 Critical Account Information

### Super Admin Access
- **Email**: dan@design-rite.com
- **Role**: super_admin
- **Access**: Full platform control
- **Dashboard**: `/admin/super`

### Database Access
- **Platform**: Supabase
- **URL**: https://ickwrbdpuorzdpzqbqpf.supabase.co
- **Tables**: users, activity_logs, permissions, user_sessions, usage_tracking

### Deployment
- **Platform**: Render.com
- **Repository**: GitHub (main branch)
- **Auto-deploy**: Enabled on push to main

---

## 📊 Platform Architecture Overview

### Authentication Systems

**Primary (Next-Auth)** - User Management
- Location: `/admin/login` → `/admin/super`
- Database: Supabase `users` table
- Features: Role-based access, activity logging, rate limiting

**Legacy (Password Auth)** - Content Management
- Location: `/admin`
- Password: `ADMIN_PASSWORD` env var
- Features: Team management, blog posts, site settings

### User Roles Hierarchy
```
super_admin (You)
    └── Full platform control
    └── Create any user type
    └── Access all data

admin (Trusted Team)
    └── Create User/Manager only
    └── View team activity
    └── Limited exports

manager (Sales/Ops)
    └── Unlimited quotes
    └── AI features
    └── Own projects only

user (Customers)
    └── Rate limited
    └── Standard access
    └── Own data only

guest (Public)
    └── Quick estimates
    └── Trial access
    └── Very limited
```

---

## 🛡️ Security Essentials

### Passwords & Secrets
- **Never commit** `.env.local` to git
- **Rotate secrets** every 90 days
- **Use strong passwords**: 12+ chars, mixed case, numbers, symbols
- **Store backups** encrypted and offline

### Access Control
- **Super admin**: Only you (Dan Kozich)
- **Admin accounts**: Trusted team only
- **Review access**: Monthly audit of all admin accounts
- **Suspend inactive**: Users inactive >90 days

### Data Protection
- **Export backups**: Weekly database exports
- **Activity logs**: Retain 90 days minimum
- **User data**: GDPR/CCPA compliant deletion
- **Encryption**: All exports should be encrypted

---

## 📞 Support & Resources

### Internal Documentation
- **Technical Docs**: `/docs/README.md`
- **Admin Guide**: `/docs/admin-guides/SUPER_ADMIN_DASHBOARD.md`
- **API Reference**: `/docs/api-reference/` (coming Phase 3)
- **Setup Guide**: `/ADMIN_AUTH_SETUP.md`

### External Resources
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repository**: [Your repo URL]
- **Next-Auth Docs**: https://next-auth.js.org

### Emergency Contacts
- **Development Team**: [Contact info]
- **Database Issues**: Supabase Support
- **Hosting Issues**: Render Support
- **Security Issues**: [Security contact]

---

## 🔄 Regular Maintenance Schedule

### Daily
- [ ] Check activity logs for suspicious behavior
- [ ] Monitor platform performance (Render dashboard)
- [ ] Respond to user support requests

### Weekly
- [ ] Export database backup
- [ ] Review new user accounts
- [ ] Check error logs in Render
- [ ] Test critical features

### Monthly
- [ ] Full platform audit
- [ ] Review and update user permissions
- [ ] Database cleanup (soft-deleted users)
- [ ] Security patch updates

### Quarterly
- [ ] Rotate API keys and secrets
- [ ] Comprehensive security review
- [ ] Performance optimization
- [ ] Feature usage analysis

---

## 📈 Platform Metrics to Monitor

### User Metrics
- Total active users
- New signups this week/month
- User retention rate
- Role distribution

### Usage Metrics
- Quotes generated per day
- AI assessments completed
- System Surveyor uploads
- Data exports requested

### Performance Metrics
- Page load times
- API response times
- Database query performance
- Error rates

### Security Metrics
- Failed login attempts
- Suspended accounts
- Password reset requests
- Unusual activity alerts

---

## 🚨 Emergency Procedures

### Platform Down
1. Check Render dashboard for build/deploy status
2. Verify environment variables are set
3. Check Supabase database connectivity
4. Review recent commits for breaking changes
5. Rollback to last known good deploy if needed

### Security Breach
1. **Immediate**: Suspend all affected accounts
2. **Rotate**: All API keys and secrets
3. **Review**: Activity logs for unauthorized access
4. **Notify**: All affected users
5. **Document**: Incident details for future prevention

### Data Loss
1. **Stop**: All write operations immediately
2. **Restore**: From most recent backup
3. **Verify**: Data integrity
4. **Test**: All features post-restore
5. **Document**: What was lost and recovery steps

---

## 📝 Change Log

### Phase 2 Complete (2025-10-01)
- ✅ Super Admin Dashboard
- ✅ User management (create, suspend, delete)
- ✅ Activity logging and monitoring
- ✅ Data exports (users, logs, database)
- ✅ Role-based access control

### Phase 1 Complete (2025-10-01)
- ✅ Next-Auth authentication
- ✅ Supabase database tables
- ✅ Login system
- ✅ Permission checking
- ✅ Rate limiting infrastructure

### Upcoming
- ⏳ Phase 3: Enhanced activity monitoring
- ⏳ Phase 4: Advanced data exports
- ⏳ User edit functionality
- ⏳ Activity viewer per user

---

**Last Updated**: October 1, 2025
**Owner**: Dan Kozich
**Platform Version**: v3.0 - Phase 2
**Status**: Production Ready
