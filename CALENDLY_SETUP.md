# Calendly Demo Booking System - Setup Guide

## Overview
Complete integration for capturing Calendly demo bookings with lead scoring, tracking, and analytics.

---

## 📋 Step 1: Create Supabase Table

Run the SQL file in your Supabase SQL Editor:
```
supabase/demo_bookings_table.sql
```

This creates:
- `demo_bookings` table with all required fields
- Indexes for performance (email, calendly_id, status, start_time, lead_score)
- Row Level Security policies
- Helpful column comments

---

## 🔧 Step 2: Environment Variables

Add these to your `.env.local` file:

```bash
# Required (already in your .env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# Optional - Calendly Webhook Security (recommended for production)
CALENDLY_WEBHOOK_SECRET=your_webhook_secret_from_calendly

# Optional - Notifications
SLACK_WEBHOOK_URL=your_slack_webhook_url
SENDGRID_API_KEY=your_sendgrid_api_key
```

---

## 📅 Step 3: Configure Calendly Webhook

### 1. Log in to Calendly Account
Go to: https://calendly.com/integrations/webhooks

### 2. Create New Webhook

**Webhook URL:**
```
https://www.design-rite.com/api/webhooks/calendly
```

**Events to Subscribe:**
- ✅ `invitee.created` - When someone books a demo
- ✅ `invitee.canceled` - When someone cancels

### 3. Test Webhook
Calendly will send a test event. Check your server logs to verify it's received.

---

## ❓ Step 4: Configure Calendly Event Questions

In your Calendly event settings, add these custom questions:

### Required Questions:
1. **"What's your company name?"**
   - Type: Text
   - Required: Yes

2. **"What's your biggest challenge with security proposals?"**
   - Type: Textarea
   - Required: Yes

### Optional Questions (for better lead scoring):
3. **"How many proposals do you create per month?"**
   - Type: Text
   - Required: No

4. **"What's your company size?"**
   - Type: Multiple Choice
   - Options: 1-10, 11-50, 51-200, 200+
   - Required: No

5. **"How quickly do you need a solution?"**
   - Type: Multiple Choice
   - Options: ASAP, Within 1 month, Within 3 months, 6+ months
   - Required: No

6. **"What's your current proposal process?"**
   - Type: Textarea
   - Required: No

7. **"Phone number?"**
   - Type: Phone
   - Required: No

---

## 🎯 Step 5: Lead Scoring Algorithm

The system automatically scores leads 0-100 based on responses:

**Base Score:** 50

**Company Name:** +10 points

**Challenge Indicators:**
- Contains "slow" or "time": +15 points
- Contains "compliance": +20 points
- Contains "losing" or "lose": +25 points
- Contains "manual" or "spreadsheet": +15 points

**Volume Indicators:**
- 20+ proposals/month: +25 points
- 10-19 proposals/month: +20 points
- 5-9 proposals/month: +10 points

**Urgency Indicators:**
- "ASAP" or "immediate": +20 points
- "week": +25 points
- "month" or "30 day": +15 points

**High Value Lead:** Score ≥ 70

---

## 📊 Step 6: Access Demo Dashboard

### Admin Navigation:
1. Go to admin panel: `/admin`
2. Click "Marketing & Content" dropdown
3. Select "📅 Demo Dashboard"

### Direct URL:
```
https://www.design-rite.com/admin/demo-dashboard
```

---

## 🔔 Step 7: Notification Setup (Optional)

### Slack Notifications:
1. Create a Slack incoming webhook
2. Add webhook URL to `.env.local` as `SLACK_WEBHOOK_URL`
3. Uncomment the Slack notification code in `/api/webhooks/calendly/route.ts`

### Email Notifications:
1. Sign up for SendGrid (or similar service)
2. Add API key to `.env.local` as `SENDGRID_API_KEY`
3. Implement email sending in the webhook handler

---

## 📈 Dashboard Features

### Statistics Display:
- Total bookings
- Scheduled demos
- Completed demos
- Average lead score
- Conversion rates (trial, customer)
- High value leads count

### Upcoming Demos:
- Shows demos scheduled in next 30 days
- Quick action buttons:
  - Mark Complete
  - Started Trial
  - Converted to Customer

### High Value Leads Section:
- Automatically highlights leads with score ≥ 70
- Yellow border for visual distinction

### Recent Activity Table:
- Last 10 bookings
- Sortable columns
- Click row for detailed view

### Booking Detail Modal:
- Full contact information
- All custom question responses
- Lead score breakdown
- Notes field for internal tracking
- Quick update buttons

---

## 🧪 Step 8: Testing

### Test Booking:
1. Book a demo through your Calendly link
2. Fill out all custom questions
3. Check webhook received: Check server logs for "📅 Calendly webhook received"
4. Verify database: Check `demo_bookings` table in Supabase
5. View dashboard: Go to `/admin/demo-dashboard`

### Test Cancellation:
1. Cancel a test booking through Calendly
2. Check webhook received in logs
3. Verify status updated to "cancelled" in dashboard

---

## 🚀 Step 9: Production Deployment

### Ensure These Are Set:
- ✅ Supabase table created
- ✅ Environment variables configured
- ✅ Calendly webhook pointing to production URL
- ✅ Custom questions added to Calendly event
- ✅ Test booking completed successfully

### Production Checklist:
1. Update webhook URL to production domain
2. Enable Calendly webhook signature verification (optional but recommended)
3. Set up monitoring for webhook failures
4. Configure production notification channels (Slack/email)
5. Train team on using demo dashboard

---

## 📝 Calendly Webhook Signature Verification (Optional)

For added security, verify webhook signatures:

```typescript
// In /api/webhooks/calendly/route.ts
import crypto from 'crypto'

function verifyCalendlySignature(payload: any, signature: string): boolean {
  const secret = process.env.CALENDLY_WEBHOOK_SECRET!
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex')

  return signature === expectedSignature
}

// In POST handler:
const signature = request.headers.get('calendly-webhook-signature')
if (!verifyCalendlySignature(payload, signature)) {
  return NextResponse.json(
    { error: 'Invalid signature' },
    { status: 401 }
  )
}
```

---

## 🔍 Troubleshooting

### Webhook Not Receiving Events:
- Check Calendly webhook status page
- Verify webhook URL is publicly accessible
- Check server logs for incoming requests
- Ensure no firewall blocking requests

### Database Errors:
- Verify Supabase table created correctly
- Check `SUPABASE_SERVICE_KEY` has write permissions
- Review Row Level Security policies

### Dashboard Not Loading:
- Check browser console for errors
- Verify `/api/demo-dashboard` returns data
- Check authentication (may need admin access)

### Lead Score Not Calculating:
- Review custom question responses in Supabase
- Check question text matches keywords in scoring algorithm
- Adjust scoring logic if needed

---

## 📞 Support

For issues:
1. Check server logs: `npm run dev` output
2. Check Supabase logs: Supabase dashboard → Logs
3. Check Calendly webhook logs: Calendly → Integrations → Webhooks
4. Review this setup guide step-by-step

---

## 🎉 Success!

Once configured, your Calendly demo booking system will:
- ✅ Automatically capture all demo bookings
- ✅ Score leads based on responses
- ✅ Track demo completion and conversions
- ✅ Provide real-time analytics
- ✅ Help prioritize high-value leads
- ✅ Streamline sales follow-up process

Happy demo booking! 🚀
