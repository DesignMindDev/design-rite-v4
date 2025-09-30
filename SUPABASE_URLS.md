# Supabase URL Configuration for Design-Rite

## 🔧 Step-by-Step Supabase Setup

### 1. Go to Supabase Dashboard
- Navigate to: `https://supabase.com/dashboard`
- Select your Design-Rite project
- Go to **Authentication** → **URL Configuration**

### 2. Site URL (Main Domain)
```
https://www.design-rite.com
```

### 3. Redirect URLs (Add ALL of these)

#### 🎯 **Primary Authentication & Platform URLs:**
```
https://www.design-rite.com/platform-access
https://www.design-rite.com/estimate-options
https://www.design-rite.com/dashboard
https://www.design-rite.com/login
https://www.design-rite.com/auth/error
```

#### 🚀 **AI Platform & Assessment URLs:**
```
https://www.design-rite.com/security-estimate
https://www.design-rite.com/ai-assessment
https://www.design-rite.com/ai-assistant
https://www.design-rite.com/ai-discovery
https://www.design-rite.com/ai-discovery-results
https://www.design-rite.com/ai-security-assessment
https://www.design-rite.com/ai-powered-analyst
```

#### 💳 **Subscription & Business URLs:**
```
https://www.design-rite.com/pricing
https://www.design-rite.com/upgrade
https://www.design-rite.com/subscribe
https://www.design-rite.com/waitlist
https://www.design-rite.com/solutions
```

#### 🏢 **Industry & Solution URLs:**
```
https://www.design-rite.com/integrators
https://www.design-rite.com/enterprise
https://www.design-rite.com/education
https://www.design-rite.com/healthcare
https://www.design-rite.com/consultants
```

#### 📋 **Compliance & Tools URLs:**
```
https://www.design-rite.com/compliance
https://www.design-rite.com/compliance/ferpa
https://www.design-rite.com/compliance/hipaa
https://www.design-rite.com/compliance/general-security
https://www.design-rite.com/compliance-check
https://www.design-rite.com/compliance-analyst
https://www.design-rite.com/compliance-analysis
```

#### 🛠️ **Admin & Management URLs:**
```
https://www.design-rite.com/admin
https://www.design-rite.com/admin/ai-providers
https://www.design-rite.com/admin/assessments
https://www.design-rite.com/admin/user-activity
https://www.design-rite.com/admin/session-debug
https://www.design-rite.com/admin/ai-assistant
https://www.design-rite.com/admin/chatbot
https://www.design-rite.com/admin/careers
https://www.design-rite.com/admin/harvester
https://www.design-rite.com/admin/creative-studio
https://www.design-rite.com/auth-debug
```

#### 📚 **Content & Support URLs:**
```
https://www.design-rite.com/about
https://www.design-rite.com/blog
https://www.design-rite.com/careers
https://www.design-rite.com/contact
https://www.design-rite.com/docs
https://www.design-rite.com/support
https://www.design-rite.com/api
https://www.design-rite.com/partners
https://www.design-rite.com/watch-demo
```

#### 🔐 **Additional Platform URLs:**
```
https://www.design-rite.com/cost-estimator
https://www.design-rite.com/enterprise-roi
https://www.design-rite.com/pricing-intelligence
https://www.design-rite.com/professional-proposals
https://www.design-rite.com/project-management
https://www.design-rite.com/white-label
https://www.design-rite.com/nda
```

### 4. For Development & Render Deployment

#### If using Render.com, also add:
```
https://your-app-name.onrender.com/platform-access
https://your-app-name.onrender.com/estimate-options
https://your-app-name.onrender.com/dashboard
https://your-app-name.onrender.com/auth/error
```

#### For localhost development:
```
http://localhost:3000/platform-access
http://localhost:3000/estimate-options
http://localhost:3000/dashboard
http://localhost:3001/platform-access
http://localhost:3001/estimate-options
http://localhost:3001/dashboard
http://localhost:3004/platform-access
http://localhost:3004/estimate-options
http://localhost:3004/dashboard
```

## 📋 Quick Copy-Paste List for Supabase

Copy this entire list and paste into Supabase redirect URLs (one per line):

```
https://www.design-rite.com/platform-access
https://www.design-rite.com/estimate-options
https://www.design-rite.com/dashboard
https://www.design-rite.com/login
https://www.design-rite.com/auth/error
https://www.design-rite.com/security-estimate
https://www.design-rite.com/ai-assessment
https://www.design-rite.com/ai-assistant
https://www.design-rite.com/ai-discovery
https://www.design-rite.com/ai-discovery-results
https://www.design-rite.com/pricing
https://www.design-rite.com/upgrade
https://www.design-rite.com/subscribe
https://www.design-rite.com/admin
https://www.design-rite.com/admin/ai-providers
https://www.design-rite.com/solutions
https://www.design-rite.com/integrators
https://www.design-rite.com/enterprise
https://www.design-rite.com/education
https://www.design-rite.com/healthcare
https://www.design-rite.com/compliance
https://www.design-rite.com/compliance/ferpa
https://www.design-rite.com/compliance/hipaa
https://www.design-rite.com/auth-debug
http://localhost:3000/platform-access
http://localhost:3000/estimate-options
http://localhost:3000/dashboard
http://localhost:3001/platform-access
http://localhost:3001/estimate-options
http://localhost:3001/dashboard
http://localhost:3004/platform-access
http://localhost:3004/estimate-options
http://localhost:3004/dashboard
```

## 🎯 Priority Order for Implementation

If you need to add these gradually, start with:

1. **Critical Auth URLs:**
   - `/platform-access`
   - `/estimate-options`
   - `/dashboard`
   - `/auth/error`

2. **Core Platform URLs:**
   - `/security-estimate`
   - `/ai-assessment`
   - `/ai-assistant`

3. **Business URLs:**
   - `/pricing`
   - `/upgrade`
   - `/subscribe`

4. **Admin URLs:**
   - `/admin`
   - `/admin/ai-providers`

## ✅ After Configuration

Once added to Supabase:
1. Test magic link authentication
2. Verify redirects work correctly
3. Check that all platform pages are accessible after auth
4. Test on both development and production domains