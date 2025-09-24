# Design-Rite™ AI Security Platform v3.1

> Transform security system design from days to minutes with AI-powered assessments, multi-AI provider failover, and automated proposal generation.

## 🚀 Production Platform

**Live Platform**: https://www.design-rite.com
**Discovery Assistant**: https://www.design-rite.com/ai-assessment
**Admin Interface**: https://www.design-rite.com/admin/ai-providers

## 🌟 Core Features

### 🤖 **Multi-AI Provider System**
- **Automatic Failover**: Claude → OpenAI → Gemini seamless switching
- **Health Monitoring**: Real-time provider status and performance tracking
- **Priority Management**: Configurable provider routing and priority
- **Admin Dashboard**: Complete provider management interface

### 🔐 **Team Member Access**
- **Enhanced AI Capabilities**: Team member access codes (DR-XX-2025 format)
- **Debug Commands**: Advanced system diagnostics and calculations
- **Direct Access**: Bypass normal qualification requirements
- **Activity Tracking**: Complete usage analytics and logging

### 🎯 **Professional Discovery Assistant**
- **7-Step Methodology**: WHO, WHAT, WHEN, WHERE, WHY, HOW, COMPLIANCE
- **Industry Expertise**: Tailored questions for specific verticals
- **Smart Qualification**: Automatic lead scoring and assessment
- **Professional Responses**: Expert-level security consulting guidance

### 📊 **Live Pricing Intelligence**
- **Real-time Distributor Data**: CDW, ADI, ScanSource integration
- **Dynamic Calculations**: ROI, camera counts, bandwidth estimates
- **Compliance Analysis**: Industry-specific requirements (HIPAA, PCI, etc.)
- **Automated BOMs**: Professional proposals with live pricing

## 🌐 Platform Access Points

### **Public Access**
- **Landing Page**: https://www.design-rite.com
- **Discovery Assistant**: https://www.design-rite.com/ai-assessment
- **Team Login**: Enter access codes (DR-DK-2025, DR-PL-2025, DR-MC-2025)

### **Admin Access**
- **AI Provider Management**: https://www.design-rite.com/admin/ai-providers
- **Team Management**: https://www.design-rite.com/admin/team-activity
- **System Health**: Real-time monitoring and diagnostics

## 🛠️ Local Development

```bash
# Clone repository
git clone https://github.com/DesignMindDev/design-rite-v3.git
cd design-rite-v3

# Install dependencies
npm install

# Environment setup
cp .env.example .env

# Required environment variables:
ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_HARVESTER_API_URL=http://localhost:8000

# Start development server
npm run dev
```

## 🔒 Security & Data Protection

### **🚨 CRITICAL SECURITY MEASURES**

#### **API Key Management**
- ❌ **NEVER** commit API keys to repository
- ✅ **ALWAYS** use environment variables (.env files)
- ✅ **ROTATE** API keys regularly (monthly recommended)
- ✅ **MONITOR** API usage and rate limits

#### **Access Control**
- 🔐 **Team Access Codes**: Unique, time-stamped, trackable
- 📊 **Activity Logging**: All team member interactions recorded
- ⏰ **Session Management**: Automatic timeout and cleanup
- 🚫 **Rate Limiting**: Prevent abuse and overuse

#### **Data Handling**
- 🔒 **No Persistent Storage**: Client data not stored long-term
- 🧹 **Automatic Cleanup**: Session data cleared after completion
- 🔄 **Encrypted Transit**: HTTPS/TLS for all communications
- 📝 **Audit Trails**: Complete logging for compliance

#### **Production Security Checklist**
- [ ] HTTPS/SSL certificates active and valid
- [ ] Environment variables configured in hosting platform
- [ ] API keys stored securely (not in code)
- [ ] Database backups scheduled and tested
- [ ] Error logging configured (no sensitive data in logs)
- [ ] CORS policies configured properly
- [ ] Rate limiting enabled on all endpoints
- [ ] Security headers configured (CSP, HSTS, etc.)

### **🔍 Security Monitoring**

Monitor these indicators for security issues:
- **API Response Times**: Unusual delays may indicate attacks
- **Error Rates**: High 401/403 errors suggest unauthorized access attempts
- **Usage Patterns**: Abnormal team member activity or access patterns
- **Health Check Failures**: May indicate system compromise

### **📱 Emergency Procedures**

If security breach suspected:
1. **Immediately rotate all API keys**
2. **Check access logs for unauthorized activity**
3. **Review team member access code usage**
4. **Verify no sensitive data has been compromised**
5. **Update security measures and patches**

## 🏗️ System Architecture

### **Multi-AI Engine** (`lib/ai-engine.ts`)
- Smart provider selection based on health and priority
- Automatic failover with zero user disruption
- Health check recording and analytics
- Environment variable API key support

### **Admin Interface** (`app/admin/ai-providers/`)
- Three-tab interface: Providers | Health | Settings
- Real-time connection testing with visual feedback
- Provider enable/disable controls
- Priority management and configuration

### **Configuration Management** (`data/ai-providers.json`)
- File-based provider configuration
- Health check history (last 100 checks)
- System settings (failover, intervals, etc.)
- Automatic backup and recovery

### **Team Access System**
- Unique access codes with activity tracking
- Enhanced AI capabilities for authenticated users
- Debug commands and system diagnostics
- Complete audit trail for compliance

## 🔧 Technical Specifications

### **Supported AI Providers**
- **Anthropic Claude**: Primary provider (claude-3-5-sonnet-20241022)
- **OpenAI GPT**: Secondary provider (gpt-4o)
- **Google Gemini**: Tertiary provider (gemini-pro)
- **Extensible**: Easy to add new providers

### **Performance Metrics**
- **Response Times**: Tracked per provider
- **Success Rates**: Health monitoring with error logging
- **Failover Speed**: Sub-second provider switching
- **Uptime**: 99.9% availability target

### **Compliance Features**
- **Industry Standards**: HIPAA, PCI, SOC compliance guidance
- **Audit Trails**: Complete interaction logging
- **Data Retention**: Configurable cleanup policies
- **Security Documentation**: This README and inline comments

---

## 📞 Support & Contact

**Design-Rite™ Team Access**:
- Dan Kozich: DR-DK-2025
- Philip Lisk: DR-PL-2025
- Munnyman Communications: DR-MC-2025

For technical support or security concerns, contact the development team immediately.

---

**Design-Rite™ v3.1** - Multi-AI Security Intelligence Platform
🤖 Powered by Claude Code with comprehensive security architecture# Deployment trigger Wed, Sep 24, 2025  3:03:55 PM
