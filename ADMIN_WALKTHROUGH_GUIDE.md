# 🎛️ Design-Rite Admin Dashboard - Complete Walkthrough
**Last Updated:** October 5, 2025
**For:** Super Admins & Admin Team Members
**Purpose:** Comprehensive guide to managing the Design-Rite platform

---

## 🔐 Step 1: Accessing the Admin Dashboard

### **Login Process:**
1. Navigate to: `https://www.design-rite.com/admin` or `http://localhost:3000/admin`
2. You'll be redirected to `/admin/login` if not authenticated
3. Enter your credentials:
   - Email: Your admin email
   - Password: Your admin password
4. Click "Sign In"

### **Role-Based Access:**
```
Super Admin  → Full access to all modules
Admin        → Access based on assigned module permissions
Manager      → Limited admin access
User         → No admin access (redirected)
Guest        → No admin access (redirected)
```

### **After Login:**
- Successful login redirects to `/admin` dashboard
- Dashboard displays based on your role and module permissions
- Top navigation shows available dropdown menus based on permissions

---

## 📊 Step 2: Dashboard Overview

### **Main Navigation Bar:**
The admin dashboard has 7 main sections organized by color-coded dropdowns:

1. **📊 Operations Dashboard** (Orange) - Featured button
2. **📈 Analytics** (Blue) - Quick access button
3. **🤖 AI Tools** (Purple) - Dropdown menu
4. **🗄️ Data Tools** (Cyan) - Dropdown menu
5. **✍️ Content Tools** (Green) - Dropdown menu
6. **💼 Business Tools** (Yellow) - Dropdown menu
7. **ℹ️ About Us** (Indigo) - Dropdown menu

### **Role-Based Visibility:**
- **Super Admin:** Sees all 7 sections
- **Admin:** Sees sections based on `modulePermissions` in database
- Module permissions include:
  - `operations_dashboard`
  - `ai_management`
  - `data_harvesting`
  - `marketing_content`
  - `about_us`
  - `team_management`
  - `logo_management`
  - `video_management`
  - `blog_management`

---

## 🔥 Step 3: Operations Dashboard (Featured)

### **Path:** `/admin/operations`
### **Purpose:** Real-time operational metrics and monitoring

### **Features:**
1. **Platform Health Monitoring**
   - API uptime status
   - Error rate tracking
   - Response time metrics

2. **User Activity Metrics**
   - Active users (daily/weekly/monthly)
   - Session duration averages
   - Feature usage heatmap

3. **Business Metrics**
   - Assessments generated (daily/weekly/monthly)
   - Quote conversion rates
   - Revenue analytics (if Stripe integration active)

4. **System Alerts**
   - API failures
   - Database connection issues
   - Rate limit warnings

### **How to Use:**
1. Click **"📊 Operations Dashboard"** (orange button, top right)
2. View real-time metrics on dashboard
3. Use filters to adjust date ranges
4. Export reports as needed

---

## 📈 Step 4: Analytics Dashboard

### **Path:** `/admin` (Analytics Tab)
### **Purpose:** Spatial Studio and platform-wide analytics

### **Features:**
1. **Spatial Studio Metrics:**
   - Total projects created
   - AI analysis success rate
   - Average processing time
   - Floor plan uploads by date

2. **Platform Analytics:**
   - Page views by route
   - User journey tracking
   - Conversion funnel analysis

3. **Performance Metrics:**
   - API response times
   - Database query performance
   - Cache hit rates

### **How to Use:**
1. Click **"📈 Analytics"** (blue button, top right)
2. View Spatial Studio metrics
3. Download reports
4. Share insights with team

---

## 🤖 Step 5: AI Tools Management

### **5a. AI Providers** (`/admin/ai-providers`)
**Purpose:** Manage all AI provider configurations and failover priorities

#### **Features:**
- **Provider Management:**
  - Claude (Anthropic)
  - OpenAI (GPT-4, Assistants API)
  - Google Gemini
  - X.AI (Grok)

- **Configuration Options:**
  - Enable/disable providers
  - Set priority (1 = highest priority for failover)
  - Configure API keys
  - Set max tokens and timeout
  - Assign use cases (general, chatbot, assessment, creative, etc.)

- **Dynamic Tabs:**
  - Demo AI Estimator
  - Chatbot
  - Auto-generated tabs for each use case
  - Health monitoring
  - Settings

#### **How to Use:**
1. Click **"🤖 AI Tools"** dropdown → **"🧠 AI Providers"**
2. Select a tab (Demo AI Estimator, Chatbot, etc.)
3. View existing providers or click **"+ Add New Provider"**
4. Fill in provider details:
   ```
   Name: Descriptive name (e.g., "Claude Primary")
   Provider Type: anthropic | openai | google | xai
   API Key: Your API key OR "configured_from_env"
   Model: Model name (e.g., claude-3-5-sonnet-20241022)
   Priority: 1-999 (1 = highest)
   Max Tokens: 1500 (recommended)
   Timeout: 25-30 seconds
   Use Case: general | chatbot | assessment | creative | etc.
   ```
5. Click **"Save Provider"**
6. Test provider with **"Test Connection"** button
7. View health checks in **"Health"** tab

#### **Failover Configuration:**
```
Priority 1: Claude (Primary) → Used first
Priority 2: OpenAI (Backup) → Used if Claude fails
Priority 3: Gemini (Tertiary) → Used if both fail
```

---

### **5b. AI Assistant Config** (`/admin/ai-assistant`)
**Purpose:** Configure the AI Assistant for refinement tools

#### **Features:**
- Assistant-specific settings
- Conversation templates
- Custom instructions
- File upload limits

#### **How to Use:**
1. Click **"🤖 AI Tools"** → **"✨ AI Assistant Config"**
2. Configure assistant behavior
3. Set conversation templates
4. Save changes

---

### **5c. Chatbot Config** (`/admin/chatbot`)
**Purpose:** Configure website chatbot behavior and responses

#### **Features:**
- Chatbot appearance settings
- Pre-programmed responses
- Greeting messages
- Quick reply buttons

#### **How to Use:**
1. Click **"🤖 AI Tools"** → **"💬 Chatbot Config"**
2. Customize chatbot appearance
3. Set greeting message
4. Add quick reply options
5. Test chatbot in preview
6. Save and publish

---

## 🗄️ Step 6: Data Tools

### **6a. Product Harvester** (`/admin/harvester`)
**Purpose:** Manage the LowVolt Spec Harvester integration

#### **Features:**
- **Product Database Management:**
  - 3,000+ security products
  - Real-time CDW pricing
  - Manufacturer specifications

- **Harvester Controls:**
  - Start/stop harvester
  - Schedule harvesting jobs
  - View harvester logs
  - Monitor API status

- **Data Quality:**
  - Product validation rules
  - Duplicate detection
  - Price update frequency

#### **How to Use:**
1. Click **"🗄️ Data Tools"** → **"🔍 Product Harvester"**
2. View current harvester status
3. Click **"Start Harvesting"** to begin data collection
4. Monitor progress in real-time
5. View harvested products in table
6. Export product data as CSV

#### **Harvester API Integration:**
```
API URL: http://localhost:8002 (dev) or production URL
Endpoints:
  - GET /api/v1/products/search
  - GET /api/v1/manufacturers
  - GET /api/v1/categories
  - POST /api/v1/harvest/start
```

---

## ✍️ Step 7: Content Tools

### **7a. Team Management** (In-page tab)
**Purpose:** Manage About Us team member profiles

#### **Features:**
- Add new team members
- Edit existing profiles
- Upload team photos
- Set member roles and descriptions
- Reorder team display

#### **How to Use:**
1. Click **"✍️ Content Tools"** → **"👥 Team Management"**
2. View current team members
3. Click **"+ Add New Team Member"**
4. Fill in details:
   ```
   Name: Full name
   Role: Job title
   Description: Bio/expertise
   Photo: Upload headshot (JPG/PNG)
   LinkedIn URL: (optional)
   ```
5. Click **"Save"**
6. Drag-and-drop to reorder team members
7. Changes reflect immediately on `/about` page

---

### **7b. Creative Studio** (`/admin/creative-studio`)
**Purpose:** Manage Creative Studio microservice (Port 3030)

#### **Features:**
- **Asset Management:**
  - Upload images for AI analysis
  - Organize creative assets
  - Tag and categorize

- **Content Generation:**
  - Blog post generation
  - Social media content
  - Case studies
  - Marketing copy

- **Publishing Pipeline:**
  - Draft → Review → Publish workflow
  - Schedule posts
  - Auto-publish to channels

#### **How to Use:**
1. Click **"✍️ Content Tools"** → **"🎨 Creative Studio"**
2. **Upload Asset:**
   - Click "Upload Image"
   - Select image file
   - AI analyzes image
3. **Generate Content:**
   - Select content type (blog, social, case study)
   - AI generates draft
   - Review and edit
4. **Publish:**
   - Preview final content
   - Schedule or publish immediately
   - Share to social channels

---

### **7c. Spatial Studio** (`/admin/spatial-studio-dev`)
**Purpose:** Manage Spatial Studio microservice (Port 3020)

#### **Features:**
- **Project Management:**
  - View all floor plan projects
  - Monitor AI analysis status
  - Review 3D models

- **Analytics:**
  - Total uploads
  - Success/failure rates
  - Average processing time
  - User activity

- **Debug Tools:**
  - View AI analysis logs
  - Replay failed analyses
  - Export debug data

#### **How to Use:**
1. Click **"✍️ Content Tools"** → **"🏗️ Spatial Studio"**
2. **View Projects:**
   - See all uploaded floor plans
   - Check analysis status (pending/processing/completed/failed)
   - View 3D models
3. **Troubleshoot:**
   - Click project to see details
   - View AI analysis logs
   - Retry failed analyses
4. **Export:**
   - Download 3D model data
   - Export equipment BOM
   - Generate reports

#### **Project Statuses:**
```
pending     → Uploaded, waiting for AI analysis
processing  → AI analyzing floor plan
completed   → Analysis successful, 3D model ready
failed      → Analysis failed (see logs)
```

---

### **7d. Logo Management** (In-page tab)
**Purpose:** Update site logos

#### **Features:**
- Header logo upload
- Footer logo upload
- Logo preview
- Automatic optimization

#### **How to Use:**
1. Click **"✍️ Content Tools"** → **"🖼️ Logo Management"**
2. **Upload Header Logo:**
   - Click "Choose File" under "Header Logo"
   - Select PNG/SVG (transparent background recommended)
   - Preview appears
   - Click "Upload"
3. **Upload Footer Logo:**
   - Same process as header
   - Can be different from header logo
4. Changes reflect immediately sitewide

---

### **7e. Video Management** (In-page tab)
**Purpose:** Manage demo and marketing videos

#### **Features:**
- Add YouTube/Vimeo videos
- Set video as primary demo
- Categorize videos (demo, testimonial, tutorial)
- Enable/disable videos

#### **How to Use:**
1. Click **"✍️ Content Tools"** → **"🎥 Video Management"**
2. **Add New Video:**
   - Title: Video name
   - Description: What it covers
   - YouTube URL: Full URL or video ID
   - Type: Demo | Testimonial | Tutorial | Company
   - Active: Toggle on/off
3. Click **"Save Video"**
4. **Set Primary Demo:**
   - Select video
   - Click "Set as Primary Demo"
   - This video shows on homepage

---

### **7f. Blog Posts** (In-page tab)
**Purpose:** Manage company blog

#### **Features:**
- Create blog posts
- Rich text editor
- Featured image upload
- Publish/draft status
- Video embedding

#### **How to Use:**
1. Click **"✍️ Content Tools"** → **"📝 Blog Posts"**
2. **Create New Post:**
   - Click "+ New Blog Post"
   - Fill in:
     ```
     Title: Post title
     Excerpt: Short summary (SEO meta description)
     Content: Full post content (Markdown supported)
     Author: Your name
     Featured Image: Upload image
     Video URL: (optional) YouTube embed
     Tags: Comma-separated tags
     ```
3. **Save Draft or Publish:**
   - Toggle "Published" switch
   - Click "Save"
4. **Edit Existing:**
   - Click post title
   - Make changes
   - Save

#### **SEO Features:**
- Auto-generated meta descriptions
- Open Graph image
- Twitter card support
- Schema markup

---

## 💼 Step 8: Business Tools

### **8a. Subscriptions** (`/admin/subscriptions`)
**Purpose:** Manage Stripe subscriptions and billing

#### **Features:**
- View all active subscriptions
- Customer management
- Subscription plan management
- Payment history
- Failed payment tracking

#### **How to Use:**
1. Click **"💼 Business Tools"** → **"💳 Subscriptions"**
2. **View Subscriptions:**
   - Active count
   - Revenue (MRR/ARR)
   - Churn rate
3. **Manage Customers:**
   - Search by email
   - View subscription details
   - Pause/cancel subscriptions
   - Refund payments
4. **Monitor Failed Payments:**
   - Auto-retry settings
   - Customer notifications
   - Dunning management

#### **Subscription Tiers:**
```
Free:       $0/month   → Limited features
Pro:        $99/month  → Full platform access
Enterprise: Custom     → Custom integrations
```

---

### **8b. Demo Dashboard** (`/admin/demo-dashboard`)
**Purpose:** Manage Calendly demo bookings with lead scoring

#### **Features:**
- **Booking Management:**
  - Upcoming demos (next 30 days)
  - Past demos
  - Cancelled bookings

- **Lead Scoring:**
  - Automatic 0-100 point scoring
  - High-value lead highlighting (70+ points)
  - Qualification insights

- **Quick Actions:**
  - Mark demo as completed
  - Mark "Started Trial"
  - Mark "Converted to Customer"
  - Add internal notes

#### **How to Use:**
1. Click **"💼 Business Tools"** → **"📅 Demo Dashboard"**
2. **View Upcoming Demos:**
   - Sorted by date (soonest first)
   - Lead score displayed
   - Contact information visible
3. **High-Value Leads:**
   - Highlighted with yellow border
   - Score ≥ 70 points
   - Prioritize these bookings
4. **After Demo:**
   - Click booking row to expand
   - Add notes about demo
   - Click action button:
     - "Mark Complete" → Demo conducted
     - "Started Trial" → Signed up for trial
     - "Converted" → Became paying customer
5. **View Details:**
   - Custom question responses
   - Company size
   - Urgency level
   - Current process challenges

#### **Lead Scoring Algorithm:**
```
Base Score: 50 points

Challenge Keywords:
  + "slow" → +15 points
  + "time consuming" → +20 points
  + "compliance" → +25 points
  + "losing bids" → +25 points

Proposal Volume:
  + 5-9/month → +10 points
  + 10-19/month → +20 points
  + 20+/month → +25 points

Urgency:
  + "ASAP" → +20 points
  + "this week" → +25 points
  + "next week" → +20 points
  + "this month" → +15 points

High Value: Score ≥ 70 → Auto-flagged
```

---

### **8c. Testing Dashboard** (`/admin/testing`)
**Purpose:** AI agent collaboration testing platform

#### **Features:**
- **Test Scheduling:**
  - Schedule automated test runs
  - Set test frequency (hourly, daily, weekly)
  - Define test suites

- **Agent Collaboration:**
  - ChatGPT runs tests
  - Reports results
  - Claude Code fixes bugs
  - Full workflow automation

- **Test Results:**
  - Pass/fail rates
  - Performance metrics
  - Error logs
  - Auto-fix attempts

#### **How to Use:**
1. Click **"💼 Business Tools"** → **"🧪 Testing Dashboard"**
2. **Schedule Tests:**
   - Select test suite
   - Choose frequency
   - Enable auto-fix
   - Save schedule
3. **View Results:**
   - Real-time test execution
   - Pass/fail indicators
   - Error details
   - Fix attempts

#### **Test Workflow:**
```
1. ChatGPT Agent runs test suite
2. Reports results to testing dashboard
3. If failures detected:
   - Claude Code analyzes error
   - Attempts automatic fix
   - Re-runs test
   - Reports success/failure
4. Dashboard logs all activity
```

---

## ℹ️ Step 9: About Us Management

### **Features:**
- Team member management (covered in 7a)
- Company history
- Mission statement
- Contact information

### **How to Use:**
1. Click **"ℹ️ About Us"** dropdown
2. Manage company information
3. Update mission/vision statements
4. Save changes

---

## 👑 Step 10: Super Admin Functions

### **10a. Super Admin Dashboard** (`/admin/super`)
**Purpose:** Platform-wide administrative controls (SUPER ADMIN ONLY)

#### **Features:**
- **User Management:**
  - Create new users
  - Edit user roles
  - Assign permissions
  - View activity logs

- **Platform Settings:**
  - Environment configuration
  - Feature flags
  - Maintenance mode
  - Database backups

#### **How to Use:**
1. Navigate to `/admin/super`
2. **Create New User:**
   - Click "Create User"
   - Fill in:
     ```
     Email: user@example.com
     Password: Secure password
     Role: super_admin | admin | manager | user
     Access Code: DR-SA-DK-2025 (or assign new code)
     ```
   - Assign module permissions
   - Save

3. **Manage Existing Users:**
   - Search for user by email
   - Edit role or permissions
   - View activity logs
   - Suspend/activate accounts

---

### **10b. User Activity Logs** (`/admin/super/activity`)
**Purpose:** Monitor all user actions for security and auditing

#### **Features:**
- Complete audit trail
- Login attempts (successful and failed)
- Admin actions (user creation, role changes)
- API usage logs
- Rate limit violations

#### **How to Use:**
1. Navigate to `/admin/super/activity`
2. Filter logs by:
   - User email
   - Date range
   - Action type
   - IP address
3. Export logs for compliance
4. Investigate suspicious activity

---

### **10c. Permissions Management** (`/admin/super/permissions`)
**Purpose:** Configure role-based access control

#### **Features:**
- Define role permissions
- Module access matrix
- Custom permission groups
- Permission inheritance

#### **How to Use:**
1. Navigate to `/admin/super/permissions`
2. Select role (Super Admin, Admin, Manager, User, Guest)
3. Toggle module permissions:
   ```
   ✓ Operations Dashboard
   ✓ AI Management
   ✓ Data Harvesting
   ✓ Marketing Content
   ✓ Team Management
   ✓ Blog Management
   ```
4. Save permission changes
5. Changes apply immediately to all users with that role

---

## 🔑 User Roles & Access Codes

### **Access Code Format:**
```
DR-[ROLE]-[INITIALS]-[YEAR]

Examples:
DR-SA-DK-2025   → Super Admin (Owner)
DR-AD-JD-2025   → Admin (Team Member)
DR-MG-SM-2025   → Manager (Sales Manager)
DR-US-ACME-001  → User (Customer)
```

### **Role Hierarchy:**
```
Super Admin (Owner)
  ↓
Admin (Trusted Team)
  ↓
Manager (Sales/Ops)
  ↓
User (Standard Customer)
  ↓
Guest (Public/Trial)
```

### **Permission Matrix:**
| Feature | Super Admin | Admin | Manager | User | Guest |
|---------|-------------|-------|---------|------|-------|
| Create Users | ✅ | ✅* | ❌ | ❌ | ❌ |
| Manage AI Providers | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ❌ | ❌ |
| Unlimited Quotes | ✅ | ✅ | ✅ | ❌ | ❌ |
| Rate Limits | None | None | None | 10/day | 3/week |
| Access Admin Panel | ✅ | ✅ | ❌ | ❌ | ❌ |

*Admins can only create User/Manager roles, not other Admins

---

## 🚨 Common Admin Tasks

### **Task 1: Add a New Admin Team Member**
```
1. Go to /admin/super
2. Click "Create User"
3. Enter email and temporary password
4. Select role: "Admin"
5. Assign access code: DR-AD-[INITIALS]-2025
6. Enable relevant module permissions
7. Click "Create User"
8. Send login credentials to team member
```

### **Task 2: Configure AI Failover**
```
1. Go to /admin/ai-providers
2. Ensure 3 providers are enabled:
   - Claude (Priority 1)
   - OpenAI (Priority 2)
   - Gemini (Priority 3)
3. Test each provider
4. Monitor health checks
```

### **Task 3: Review High-Value Demo Leads**
```
1. Go to /admin/demo-dashboard
2. Filter by "High Value Leads" (score ≥ 70)
3. Review upcoming demos
4. Prepare personalized demos for high-value leads
5. Mark demos as complete after conducting
```

### **Task 4: Publish New Blog Post**
```
1. Go to /admin (Content Tools → Blog Posts)
2. Click "+ New Blog Post"
3. Write content
4. Upload featured image
5. Add SEO tags
6. Toggle "Published" ON
7. Save
8. Post automatically appears on /blog
```

### **Task 5: Update Spatial Studio Project**
```
1. Go to /admin/spatial-studio-dev
2. Find project by ID or customer
3. View analysis status
4. If failed:
   - Click "View Logs"
   - Identify error
   - Click "Retry Analysis"
5. Export 3D model when complete
```

---

## 📱 Mobile Access

### **Mobile Compatibility:**
- ✅ All admin pages are responsive
- ✅ Optimized for tablet use
- ⚠️ Some features better on desktop (AI provider config, bulk operations)

### **Recommended Devices:**
- Desktop: Full functionality
- Tablet (iPad): Good for viewing analytics, managing demos
- Mobile: Quick checks, viewing dashboards

---

## 🔐 Security Best Practices

### **For Super Admins:**
1. **Never share Super Admin access code**
2. **Enable 2FA** (when available)
3. **Review activity logs weekly**
4. **Rotate API keys quarterly**
5. **Backup database before major changes**

### **For All Admins:**
1. **Use strong passwords** (12+ characters)
2. **Log out when done**
3. **Don't commit API keys to Git**
4. **Report suspicious activity immediately**
5. **Review your permissions monthly**

---

## 🆘 Troubleshooting

### **Problem: Can't Access Admin Panel**
**Solution:**
1. Verify you're logged in (`/admin/login`)
2. Check your role in database (should be `super_admin` or `admin`)
3. Clear browser cache
4. Try incognito mode
5. Contact super admin to verify permissions

### **Problem: AI Provider Not Working**
**Solution:**
1. Go to `/admin/ai-providers`
2. Select "Health" tab
3. Check last health check status
4. Verify API key is correct
5. Test connection manually
6. Check environment variables

### **Problem: Demo Dashboard Not Showing Bookings**
**Solution:**
1. Verify Calendly webhook is configured
2. Check webhook URL: `/api/webhooks/calendly`
3. Test webhook in Calendly dashboard
4. Verify `demo_bookings` table exists in Supabase
5. Check console logs for errors

### **Problem: Spatial Studio Upload Fails**
**Solution:**
1. Check file size (must be < 10MB)
2. Verify file type (PNG, JPG only)
3. Check storage bucket exists: `spatial-floorplans`
4. Verify OpenAI API key is configured
5. Check async worker logs in `/admin/spatial-studio-dev`

---

## 📞 Getting Help

### **Support Channels:**
- **Super Admin:** Direct database access, full troubleshooting
- **Admin Team:** Slack channel #admin-support
- **Technical Issues:** GitHub issues (private repo)
- **Emergency:** Call super admin directly

### **Documentation:**
- Platform Docs: `/docs`
- API Reference: `/api-docs`
- This Guide: `ADMIN_WALKTHROUGH_GUIDE.md`
- Launch Checklist: `PRE_LAUNCH_30MIN_CHECKLIST.md`

---

## ✅ Admin Checklist (Daily/Weekly Tasks)

### **Daily:**
- [ ] Check Operations Dashboard for errors
- [ ] Review high-value demo leads
- [ ] Monitor AI provider health
- [ ] Check for failed Spatial Studio projects

### **Weekly:**
- [ ] Review user activity logs
- [ ] Analyze platform analytics
- [ ] Update blog posts
- [ ] Review subscription churn

### **Monthly:**
- [ ] Audit user permissions
- [ ] Rotate API keys (if policy requires)
- [ ] Review and optimize AI provider costs
- [ ] Backup critical data
- [ ] Update team member profiles

---

**End of Admin Walkthrough Guide**

**Questions?** Contact the super admin team or refer to platform documentation.

**Created:** October 5, 2025
**Version:** 1.0
**Next Review:** November 5, 2025
