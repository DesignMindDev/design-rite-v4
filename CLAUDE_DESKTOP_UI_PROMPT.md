# 🎨 Claude Desktop UI Build Prompt
## For Creating Document AI Frontend Pages

**Copy this entire prompt to Claude Desktop (Opus) to build the UI:**

---

## CONTEXT

I have a Next.js 14 App Router project (Design-Rite v3) with a fully functional Document AI backend that needs frontend UI pages built.

### What's Already Working (Backend):

1. **API Routes (Tested & Functional):**
   - `POST /api/doc-ai-chat` - AI chat with document context
   - `POST /api/doc-ai/generate-document` - Generate security assessments/proposals
   - `POST /api/doc-ai/create-checkout` - Stripe subscription checkout

2. **Database Schema:**
   - `chat_conversations` - Stores conversations with metadata
   - `chat_messages` - Stores individual messages
   - `generated_documents` - Stores AI-generated documents
   - `user_documents` - Stores uploaded documents
   - `profiles` - User profiles with subscription info

3. **Authentication:**
   - Currently: Next-Auth (session-based)
   - Migrating to: Supabase Auth
   - Hook available: `useUnifiedAuth` (can use either)

4. **Tech Stack:**
   - Next.js 14 (App Router)
   - TypeScript
   - Tailwind CSS (already configured)
   - Supabase (PostgreSQL + Storage)
   - Stripe (payments)

### What I Need You to Build:

**4 Core UI Pages** that connect to the existing backend APIs:

1. `/app/doc-ai/chat/page.tsx` - AI Chat Interface
2. `/app/doc-ai/documents/page.tsx` - Document Upload & Library
3. `/app/doc-ai/library/page.tsx` - Generated Documents Library
4. `/app/doc-ai/subscription/page.tsx` - Subscription Management

---

## DESIGN REQUIREMENTS

### Design System (Already in Place):

**Colors:**
- Primary: `#8b5cf6` (purple)
- Secondary: `#a855f7`
- Accent: `#ec4899` (pink)
- Success: `#10b981`
- Background: `#1f2937` (dark)
- Text: `#f9fafb` (light)

**Design-Rite CSS Utilities (Use these!):**
- `.dr-card` - Card container
- `.dr-button` - Primary button
- `.dr-input` - Form input
- `.dr-badge` - Status badge

**Existing Components:**
- Use standard Next.js components
- Leverage Tailwind utilities
- Keep consistent with Design-Rite theme

---

## PAGE 1: AI CHAT INTERFACE

### Location: `/app/doc-ai/chat/page.tsx`

### Requirements:

**Layout:**
```
┌─────────────────────────────────────────┐
│ Header: "Document AI Chat" + Back Btn  │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │    Chat Messages Area        │
│          │                              │
│ - New    │    [User Message]            │
│   Chat   │    [AI Response]             │
│          │    [User Message]            │
│ - Conv 1 │    [AI Response]             │
│ - Conv 2 │                              │
│ - Conv 3 │    ───────────────           │
│          │    Input Box + Send Button   │
└──────────┴──────────────────────────────┘
```

**Features Needed:**

1. **Chat Interface:**
   - Message bubbles (user = right/blue, AI = left/white)
   - Auto-scroll to bottom on new message
   - Timestamp on each message
   - Markdown rendering for AI responses

2. **Sidebar:**
   - List of recent conversations (last 10)
   - "New Chat" button at top
   - Click conversation to load messages
   - Show conversation title/date

3. **Input Area:**
   - Textarea that grows with content (max 4 lines)
   - Send button (disabled when empty/loading)
   - "AI is typing..." indicator
   - Character count (optional)

4. **State Management:**
   ```typescript
   const [messages, setMessages] = useState<Message[]>([])
   const [conversationId, setConversationId] = useState<string | null>(null)
   const [conversations, setConversations] = useState<Conversation[]>([])
   const [loading, setLoading] = useState(false)
   const [input, setInput] = useState('')
   ```

5. **API Integration:**
   ```typescript
   // Send message
   async function sendMessage() {
     const response = await fetch('/api/doc-ai-chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         message: input,
         conversation_id: conversationId,
         use_documents: true
       })
     })
     const data = await response.json()
     // Update messages with response
   }

   // Load conversation
   async function loadConversation(convId: string) {
     // Fetch from database: chat_messages table
     const { data } = await supabase
       .from('chat_messages')
       .select('*')
       .eq('conversation_id', convId)
       .order('created_at')
   }

   // Load conversations list
   async function loadConversations() {
     const { data } = await supabase
       .from('chat_conversations')
       .select('*')
       .order('created_at', { ascending: false })
       .limit(10)
   }
   ```

**Bonus Features (if time):**
- Copy message button
- Regenerate response button
- Delete conversation
- Export conversation as PDF

---

## PAGE 2: DOCUMENT UPLOAD & LIBRARY

### Location: `/app/doc-ai/documents/page.tsx`

### Requirements:

**Layout:**
```
┌─────────────────────────────────────────┐
│ Header: "My Documents" + Upload Button │
├─────────────────────────────────────────┤
│                                         │
│  Drag & Drop Upload Area                │
│  "Drop files here or click to browse"  │
│                                         │
├─────────────────────────────────────────┤
│  Document List:                         │
│  ┌─────────────────────────────────┐   │
│  │ 📄 Document 1.pdf    [Delete]   │   │
│  │ Size: 2.5 MB | Uploaded: 2d ago │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ 📄 Document 2.pdf    [Delete]   │   │
│  │ Size: 1.2 MB | Uploaded: 5d ago │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Features Needed:**

1. **Upload Component:**
   - Drag and drop zone
   - Click to browse file picker
   - Accept: `.pdf`, `.txt`, `.docx`
   - Max size: 10MB
   - Show upload progress
   - Error handling (file too large, wrong type)

2. **Document List:**
   - Fetch from `user_documents` table
   - Show filename, size, upload date
   - Delete button (with confirmation)
   - Download button
   - Processing status badge (pending/completed/failed)

3. **State Management:**
   ```typescript
   const [documents, setDocuments] = useState<Document[]>([])
   const [uploading, setUploading] = useState(false)
   const [uploadProgress, setUploadProgress] = useState(0)
   ```

4. **Upload Function:**
   ```typescript
   async function uploadDocument(file: File) {
     // 1. Upload to Supabase Storage
     const { data: uploadData } = await supabase.storage
       .from('documents')
       .upload(`${userId}/${file.name}`, file)

     // 2. Create database record
     const { data } = await supabase
       .from('user_documents')
       .insert({
         user_id: userId,
         filename: file.name,
         file_path: uploadData.path,
         file_size: file.size,
         mime_type: file.type
       })
   }
   ```

5. **Delete Function:**
   ```typescript
   async function deleteDocument(docId: string) {
     if (!confirm('Delete this document?')) return

     // 1. Delete from storage
     await supabase.storage.from('documents').remove([filePath])

     // 2. Delete from database
     await supabase.from('user_documents').delete().eq('id', docId)
   }
   ```

---

## PAGE 3: GENERATED DOCUMENTS LIBRARY

### Location: `/app/doc-ai/library/page.tsx`

### Requirements:

**Layout:**
```
┌─────────────────────────────────────────┐
│ Header: "Generated Documents"           │
├─────────────────────────────────────────┤
│ Filters: [All] [Assessments] [Proposals]│
├─────────────────────────────────────────┤
│  Document Cards Grid:                   │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ 📝 Security  │  │ 📝 Proposal  │    │
│  │ Assessment   │  │ for Client X │    │
│  │              │  │              │    │
│  │ Created: 2d  │  │ Created: 5d  │    │
│  │ [View][Down] │  │ [View][Down] │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
```

**Features Needed:**

1. **Document Grid:**
   - Card-based layout (responsive grid)
   - Show document type badge
   - Show title
   - Show creation date
   - Preview snippet (first 150 chars)
   - View and Download buttons

2. **Filters:**
   - All documents
   - Security assessments
   - Proposals
   - Invoices

3. **Document Viewer Modal:**
   - Click "View" opens modal
   - Markdown preview (use `react-markdown`)
   - Download as PDF button
   - Regenerate button
   - Close button

4. **State Management:**
   ```typescript
   const [documents, setDocuments] = useState<GeneratedDoc[]>([])
   const [filter, setFilter] = useState<'all' | 'security_assessment' | 'proposal' | 'invoice'>('all')
   const [selectedDoc, setSelectedDoc] = useState<GeneratedDoc | null>(null)
   ```

5. **Load Documents:**
   ```typescript
   async function loadDocuments() {
     let query = supabase
       .from('generated_documents')
       .select('*')
       .eq('user_id', userId)
       .order('created_at', { ascending: false })

     if (filter !== 'all') {
       query = query.eq('document_type', filter)
     }

     const { data } = await query
     setDocuments(data)
   }
   ```

6. **Download as PDF:**
   ```typescript
   async function downloadAsPDF(docId: string) {
     // Use existing file_path if exists
     // OR generate PDF from markdown content
     const doc = documents.find(d => d.id === docId)
     // Trigger download
   }
   ```

---

## PAGE 4: SUBSCRIPTION MANAGEMENT

### Location: `/app/doc-ai/subscription/page.tsx`

### Requirements:

**Layout:**
```
┌─────────────────────────────────────────┐
│ Header: "Subscription Management"       │
├─────────────────────────────────────────┤
│ Current Plan:                           │
│ ┌─────────────────────────────────────┐ │
│ │ 💎 Pro Plan                         │ │
│ │ $49/month                           │ │
│ │ Status: Active                      │ │
│ │ Next billing: Oct 15, 2025          │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Usage This Month:                       │
│ • AI Chats: 45/200                      │
│ • Documents Generated: 8/40             │
│ • Document Uploads: 3/20                │
├─────────────────────────────────────────┤
│ Available Plans:                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Base     │ │ Pro      │ │Enterprise│ │
│ │ Free     │ │ $49/mo   │ │ $199/mo  │ │
│ │ [Current]│ │ [Upgrade]│ │ [Upgrade]│ │
│ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────┘
```

**Features Needed:**

1. **Current Plan Card:**
   - Show tier (Base/Pro/Enterprise)
   - Show price
   - Show status (active/cancelled/past_due)
   - Show next billing date
   - Cancel subscription button

2. **Usage Dashboard:**
   - Fetch from `usage_tracking` table
   - Show current usage vs limits
   - Progress bars for each feature
   - Warning if approaching limit

3. **Pricing Cards:**
   - 3 tiers (Base, Pro, Enterprise)
   - Feature comparison
   - Upgrade/Downgrade buttons
   - Highlight current plan

4. **State Management:**
   ```typescript
   const [currentPlan, setCurrentPlan] = useState<'base' | 'pro' | 'enterprise'>('base')
   const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive')
   const [usage, setUsage] = useState<Usage>({})
   ```

5. **Load Subscription:**
   ```typescript
   async function loadSubscription() {
     const { data } = await supabase
       .from('profiles')
       .select('subscription_tier, subscription_status, stripe_subscription_id')
       .eq('id', userId)
       .single()

     setCurrentPlan(data.subscription_tier)
     setSubscriptionStatus(data.subscription_status)
   }
   ```

6. **Upgrade/Downgrade:**
   ```typescript
   async function upgradeSubscription(tier: 'pro' | 'enterprise') {
     const response = await fetch('/api/doc-ai/create-checkout', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ tier })
     })
     const { checkout_url } = await response.json()
     window.location.href = checkout_url
   }
   ```

---

## IMPLEMENTATION GUIDELINES

### File Structure:
```
app/
  doc-ai/
    chat/
      page.tsx
    documents/
      page.tsx
    library/
      page.tsx
    subscription/
      page.tsx
    layout.tsx (optional - shared layout for all doc-ai pages)
```

### Authentication:
```typescript
// Use this at top of each page:
'use client'
import { useUnifiedAuth } from '@/lib/hooks/useUnifiedAuth'

export default function PageName() {
  const { user, isLoading, isAuthenticated } = useUnifiedAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>

  // Rest of page...
}
```

### Supabase Client:
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()
```

### Error Handling:
```typescript
try {
  const response = await fetch('/api/...')
  if (!response.ok) {
    throw new Error('API request failed')
  }
  const data = await response.json()
} catch (error) {
  console.error('Error:', error)
  alert('Something went wrong. Please try again.')
}
```

---

## DELIVERABLES

Please create:

1. ✅ `/app/doc-ai/chat/page.tsx` - Full chat interface
2. ✅ `/app/doc-ai/documents/page.tsx` - Document upload/management
3. ✅ `/app/doc-ai/library/page.tsx` - Generated documents library
4. ✅ `/app/doc-ai/subscription/page.tsx` - Subscription management

**Bonus (if time):**
- Shared layout (`/app/doc-ai/layout.tsx`)
- Reusable components (`/app/doc-ai/components/`)
- Loading states and skeletons
- Error boundaries
- Mobile-responsive design

---

## TESTING INSTRUCTIONS

After building each page:

1. **Start dev server:** `npm run dev`
2. **Navigate to page:** `http://localhost:3010/doc-ai/chat`
3. **Test functionality:**
   - Chat: Send message, see response
   - Documents: Upload file, see in list
   - Library: View generated docs
   - Subscription: See current plan, test upgrade

---

## QUESTIONS TO ASK IF STUCK

1. **"How do I fetch data from Supabase?"**
   - Use `createClientComponentClient()`
   - Standard PostgreSQL queries

2. **"What's the exact API format?"**
   - See examples above
   - All APIs return `{ success: boolean, ... }`

3. **"How should I handle authentication?"**
   - Use `useUnifiedAuth` hook
   - Check `isAuthenticated` before rendering

4. **"What styling approach should I use?"**
   - Tailwind CSS classes
   - Design-Rite utilities (dr-card, dr-button, etc.)
   - Follow purple/pink color scheme

---

## SUCCESS CRITERIA

✅ All 4 pages created and functional
✅ Can send AI chat messages and see responses
✅ Can upload documents and see them listed
✅ Can view generated documents
✅ Can see current subscription and upgrade
✅ Mobile-responsive design
✅ Proper error handling
✅ Loading states implemented

---

**Ready to build!** Start with the chat page, then move to documents, library, and subscription. Let me know if you need any clarification! 🚀
