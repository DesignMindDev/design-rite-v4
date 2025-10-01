# AI Chat Logging Implementation Guide

**Status**: Discovery Assistant ✅ Complete | Remaining: 7 endpoints

---

## Implementation Pattern

### 1. Add Import (Top of file)
```typescript
import { logAIConversation, generateUserHash, generateSessionId } from '../../../lib/ai-session-logger';
```

### 2. Add Logging After Response (Before return)
```typescript
// Log conversation to Supabase (non-blocking)
const sessionId = body.sessionId || request.json().sessionId || generateSessionId();
const userHash = generateUserHash(request);
logAIConversation({
  sessionId,
  userHash,
  userMessage: message,
  aiResponse: assistantResponse,
  aiProvider: 'provider-name',
  metadata: {
    feature: 'endpoint-name',
    model: 'model-used',
    responseTime: responseTimeMs
  }
}).catch(err => console.error('[Feature Name] Logging error:', err));
```

### 3. Include sessionId in Response
```typescript
return NextResponse.json({
  // ... existing fields
  sessionId // Add this!
});
```

---

## Remaining Endpoints to Update

### ✅ 1. `/api/discovery-assistant` - DONE
- **Status**: Logging added
- **Provider**: Multi-AI Engine (automatic failover)
- **Feature**: discovery-assistant

### 2. `/api/help-assistant` ⏳
- **File**: `app/api/help-assistant/route.ts`
- **Providers**: Claude Haiku OR OpenAI GPT-3.5-turbo
- **Return locations**: Lines 79-83 (Claude), ~120 (OpenAI), ~260 (Fallback)
- **Feature**: help-assistant

**Edit Locations**:
```typescript
// Line 1: Add import
import { logAIConversation, generateUserHash, generateSessionId } from '../../../lib/ai-session-logger';

// Line 77: After Claude response, before return (line 79)
const sessionId = request.json().sessionId || generateSessionId();
const userHash = generateUserHash(request);
logAIConversation({
  sessionId,
  userHash,
  userMessage: message,
  aiResponse: assistantResponse,
  aiProvider: 'claude-haiku',
  metadata: {
    feature: 'help-assistant',
    model: 'claude-3-haiku-20240307'
  }
}).catch(err => console.error('[Help Assistant] Logging error:', err));

// Repeat for OpenAI path (~line 118)
// Repeat for fallback path (~line 258)
```

### 3. `/api/creative-studio/chat` ⏳
- **File**: `app/api/creative-studio/chat/route.ts`
- **Provider**: (Need to check)
- **Feature**: creative-studio-chat

### 4. `/api/ai-chat` ⏳
- **File**: `app/api/ai-chat/route.ts`
- **Provider**: (Need to check)
- **Feature**: ai-chat

### 5. `/api/general-ai-chat` ⏳
- **File**: `app/api/general-ai-chat/route.ts`
- **Provider**: (Need to check)
- **Feature**: general-chat

### 6. `/api/ai/chat` ⏳
- **File**: `app/api/ai/chat/route.ts`
- **Provider**: (Need to check)
- **Feature**: ai-generic-chat

### 7. `/api/ai/assistant` ⏳
- **File**: `app/api/ai/assistant/route.ts`
- **Provider**: (Need to check)
- **Feature**: ai-assistant

### 8. `/api/chat` ⏳
- **File**: `app/api/chat/route.ts`
- **Provider**: (Need to check)
- **Feature**: chat

---

## Testing Checklist

After adding logging to each endpoint:

- [ ] Import statement added
- [ ] Logging call added after each AI response path
- [ ] sessionId included in response
- [ ] Error handling with .catch()
- [ ] Correct feature name in metadata
- [ ] Test endpoint manually
- [ ] Verify data in Supabase `ai_sessions` table

---

## Admin Dashboard Requirements

Once logging is complete, create `/admin/ai-sessions/page.tsx`:

### Dashboard Queries:
```sql
-- Total sessions by provider
SELECT ai_provider, COUNT(*) as session_count
FROM ai_sessions
GROUP BY ai_provider
ORDER BY session_count DESC;

-- Sessions by feature
SELECT
  metadata->>'feature' as feature,
  COUNT(*) as session_count,
  AVG(message_count) as avg_messages
FROM ai_sessions
GROUP BY metadata->>'feature'
ORDER BY session_count DESC;

-- Recent activity
SELECT
  session_id,
  user_hash,
  session_name,
  ai_provider,
  message_count,
  last_activity
FROM ai_sessions
ORDER BY last_activity DESC
LIMIT 50;

-- Daily activity
SELECT
  DATE(created_at) as date,
  COUNT(*) as sessions,
  SUM(message_count) as total_messages
FROM ai_sessions
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
```

### Dashboard Features:
- 📊 Stats cards (total sessions, messages, avg per session)
- 📈 Activity graph (sessions over time)
- 🎯 Provider breakdown (pie chart)
- 📋 Recent sessions table (clickable to view conversation)
- 🔍 Search by user_hash, session_id, or feature
- 💬 Conversation viewer modal

---

## Next Steps

1. ✅ Create logging helper library (`lib/ai-session-logger.ts`)
2. ✅ Add logging to discovery-assistant
3. ⏳ Add logging to remaining 7 endpoints
4. ⏳ Build admin dashboard
5. ⏳ Test all endpoints
6. ⏳ Verify Supabase data capture
7. ⏳ Document for team

---

## Success Metrics

After implementation:
- All 8 AI chat endpoints logging to Supabase
- Admin dashboard showing real-time usage data
- Design-Rite employees can view user conversations
- Lead qualification insights from AI interactions
- Usage analytics for each AI tool
