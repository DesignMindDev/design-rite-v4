# 🧪 Document AI - Testing Guide
## How to Access and Test the Integrated Features

**Status:** API routes created ✅, Frontend UI needs creation ⏳
**Current State:** Backend-ready, no UI pages yet

---

## 🎯 WHAT WAS CREATED

### **Backend API Routes** ✅ READY

All API endpoints are fully functional and ready to test:

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/doc-ai-chat` | POST | AI chat with document context | ✅ Yes |
| `/api/doc-ai/create-checkout` | POST | Create Stripe subscription checkout | ✅ Yes |
| `/api/doc-ai/generate-document` | POST | Generate security assessments/proposals | ✅ Yes |

### **Frontend UI Pages** ⏳ NOT YET CREATED

The following pages need to be built to access Document AI features:

- ❌ Document AI Chat UI (`/doc-ai/chat` - needs creation)
- ❌ Document Upload UI (`/doc-ai/documents` - needs creation)
- ❌ Generated Documents Library (`/doc-ai/library` - needs creation)
- ❌ Subscription Management (`/doc-ai/subscription` - needs creation)

---

## 🔧 HOW TO TEST (API ROUTES ONLY)

Since we don't have UI pages yet, you can test the API routes directly:

### **Option 1: Using cURL (Command Line)**

#### **Test 1: AI Chat**
```bash
# First, log in via browser and copy session cookie
# Then use curl:

curl -X POST http://localhost:3010/api/doc-ai-chat \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "message": "What security cameras do you recommend for a small office?",
    "use_documents": true
  }'

# Expected Response:
{
  "success": true,
  "message": "I recommend...",
  "conversation_id": "uuid-here",
  "token_estimate": 150
}
```

#### **Test 2: Generate Document**
```bash
curl -X POST http://localhost:3010/api/doc-ai/generate-document \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "document_type": "security_assessment",
    "title": "Test Security Assessment",
    "assessment_data": {
      "company": "Test Company",
      "budget": "$50,000",
      "location": "123 Main St"
    }
  }'

# Expected Response:
{
  "success": true,
  "content": "# Test Security Assessment\n\n...",
  "document_id": "uuid-here",
  "title": "Test Security Assessment"
}
```

#### **Test 3: Stripe Checkout**
```bash
curl -X POST http://localhost:3010/api/doc-ai/create-checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "tier": "pro"
  }'

# Expected Response:
{
  "success": true,
  "checkout_url": "https://checkout.stripe.com/..."
}
```

---

### **Option 2: Using Postman/Insomnia**

1. **Install Postman** (https://www.postman.com/downloads/)

2. **Import Collection:**
   - Create new request
   - Method: POST
   - URL: `http://localhost:3010/api/doc-ai-chat`
   - Headers: `Content-Type: application/json`
   - Body: Raw JSON

3. **Get Session Cookie:**
   - Log in via browser at `http://localhost:3010/admin/login`
   - Open DevTools → Application → Cookies
   - Copy `next-auth.session-token` value
   - Add to Postman headers: `Cookie: next-auth.session-token=VALUE`

4. **Test Each Endpoint** using the JSON bodies from cURL examples above

---

### **Option 3: Using Browser DevTools Console**

1. **Log in to your app** at `http://localhost:3010/admin/login`

2. **Open DevTools Console** (F12)

3. **Run JavaScript:**

```javascript
// Test AI Chat
fetch('/api/doc-ai-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What cameras do you recommend?',
    use_documents: true
  })
})
.then(r => r.json())
.then(console.log)

// Test Generate Document
fetch('/api/doc-ai/generate-document', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    document_type: 'security_assessment',
    title: 'Test Assessment',
    assessment_data: {
      company: 'Test Co',
      budget: '$50K'
    }
  })
})
.then(r => r.json())
.then(console.log)
```

---

## 🎨 CREATING THE UI PAGES (NEXT STEP)

To make Document AI accessible via browser, we need to create these pages:

### **1. AI Chat Page** (`app/doc-ai/chat/page.tsx`)

**Features needed:**
- Chat interface (like ChatGPT)
- Message history
- Document context toggle
- Conversation list sidebar
- Real-time typing indicator

**Template:**
```typescript
'use client'
import { useState } from 'react'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'

export default function DocAIChatPage() {
  const { user } = useSupabaseAuth()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    setLoading(true)
    const response = await fetch('/api/doc-ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    const data = await response.json()
    setMessages([...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: data.message }
    ])
    setMessage('')
    setLoading(false)
  }

  // UI components here...
}
```

---

### **2. Document Upload Page** (`app/doc-ai/documents/page.tsx`)

**Features needed:**
- Drag-and-drop file upload
- File list with status
- Delete/rename files
- Processing status indicator

**API route needed:**
```typescript
// app/api/doc-ai/upload-document/route.ts
// Not yet created - need to build this
```

---

### **3. Generated Documents Library** (`app/doc-ai/library/page.tsx`)

**Features needed:**
- List of generated documents
- Search/filter by type
- Preview document
- Download as PDF
- Regenerate document

**Uses existing API:**
- GET from `generated_documents` table
- POST to `/api/doc-ai/generate-document`

---

### **4. Subscription Management** (`app/doc-ai/subscription/page.tsx`)

**Features needed:**
- Current plan display
- Upgrade/downgrade buttons
- Usage statistics
- Billing history

**Uses existing API:**
- POST to `/api/doc-ai/create-checkout`
- GET from Stripe via `/api/stripe/customer-portal`

---

## 🚀 QUICK WIN: Add to Existing Admin Panel

**Fastest way to test:** Add Document AI links to existing admin pages

### **Update Admin Navigation** (`app/admin/page.tsx`)

Add Document AI section:

```typescript
// In app/admin/page.tsx, add new section:

<div className="admin-section">
  <h2>📄 Document AI</h2>
  <div className="admin-cards">
    {/* AI Chat Card */}
    <div className="admin-card" onClick={() => window.open('/api/doc-ai-chat')}>
      <div className="admin-card-icon">💬</div>
      <h3>AI Chat</h3>
      <p>Chat with AI assistant (API only - test via Postman)</p>
    </div>

    {/* Generate Document Card */}
    <div className="admin-card" onClick={() => window.open('/api/doc-ai/generate-document')}>
      <div className="admin-card-icon">📝</div>
      <h3>Generate Documents</h3>
      <p>AI document generation (API only)</p>
    </div>

    {/* Subscription Card */}
    <div className="admin-card" onClick={() => router.push('/doc-ai/subscription')}>
      <div className="admin-card-icon">💳</div>
      <h3>Subscription</h3>
      <p>Manage Pro/Enterprise tier</p>
    </div>
  </div>
</div>
```

---

## 📊 TESTING CHECKLIST

### **Phase 1: API Testing** (Can do now!)
- [ ] Test `/api/doc-ai-chat` with Postman
- [ ] Test `/api/doc-ai/generate-document` with Postman
- [ ] Test `/api/doc-ai/create-checkout` with Postman
- [ ] Verify database records created
- [ ] Check activity logs populated
- [ ] Verify rate limiting works

### **Phase 2: UI Creation** (Next step)
- [ ] Create `/doc-ai/chat/page.tsx`
- [ ] Create `/doc-ai/documents/page.tsx`
- [ ] Create `/doc-ai/library/page.tsx`
- [ ] Create `/doc-ai/subscription/page.tsx`
- [ ] Add navigation to admin panel
- [ ] Style components with Design-Rite theme

### **Phase 3: Integration Testing**
- [ ] Test full user flow: Login → Chat → Generate → Subscribe
- [ ] Test document upload and processing
- [ ] Test PDF generation and download
- [ ] Test Stripe checkout flow
- [ ] Verify webhooks update database

---

## 🎯 RECOMMENDED NEXT STEPS

### **Option A: Test APIs Only** (5 minutes)
1. Start dev server: `npm run dev`
2. Log in at `/admin/login`
3. Get session cookie from DevTools
4. Test APIs with Postman/cURL

### **Option B: Create Minimal UI** (1-2 hours)
1. Create `/app/doc-ai/chat/page.tsx` with basic chat interface
2. Add link to admin dashboard
3. Test end-to-end flow

### **Option C: Full UI Build** (4-6 hours)
1. Create all 4 pages (chat, documents, library, subscription)
2. Add navigation menu
3. Style with Design-Rite theme
4. Add loading states, error handling
5. Full integration testing

---

## 💡 EXAMPLE: Minimal Chat UI (Copy-Paste Ready)

Want to see it working in the browser? Here's a minimal chat page you can create now:

**File:** `app/doc-ai/chat/page.tsx`

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DocAIChatPage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function sendMessage() {
    if (!message.trim()) return

    setLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: message }])

    try {
      const response = await fetch('/api/doc-ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Failed to send message')
    }

    setMessage('')
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Document AI Chat</h1>
      <button onClick={() => router.push('/admin')}>← Back to Admin</button>

      <div style={{
        border: '1px solid #ccc',
        padding: '20px',
        minHeight: '400px',
        marginTop: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#fff',
            borderRadius: '8px'
          }}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
            <p style={{ margin: '5px 0 0 0' }}>{msg.content}</p>
          </div>
        ))}
        {loading && <p>AI is typing...</p>}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about security systems..."
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !message.trim()}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
```

**Then access it at:** `http://localhost:3010/doc-ai/chat`

---

## ✅ SUMMARY

**What's Working Now:**
- ✅ All 3 API routes functional
- ✅ Database schema ready
- ✅ Authentication integrated
- ✅ Rate limiting active
- ✅ Activity logging working

**What Needs Building:**
- ⏳ Chat UI page
- ⏳ Document upload UI
- ⏳ Document library UI
- ⏳ Subscription management UI

**Fastest Way to Test:**
1. Use Postman/cURL to test APIs (5 min)
2. Create minimal chat page above (10 min)
3. Access at `/doc-ai/chat`

**Want me to create the UI pages?** Let me know which page to build first! 🚀
