# AI Chat Logging Implementation Guide

**Status**: ✅ ALL 8 ENDPOINTS COMPLETE! 🎉

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

### ✅ 1. `/api/discovery-assistant` - COMPLETE
- **Status**: Logging added
- **Provider**: Multi-AI Engine (automatic failover)
- **Feature**: discovery-assistant

### ✅ 2. `/api/help-assistant` - COMPLETE
- **Status**: Logging added (line 80-93)
- **File**: `app/api/help-assistant/route.ts`
- **Providers**: Claude Haiku OR OpenAI GPT-3.5-turbo
- **Feature**: help-assistant

### ✅ 3. `/api/creative-studio/chat` - COMPLETE
- **Status**: Logging added (line 152-167) - only logs assistant messages
- **File**: `app/api/creative-studio/chat/route.ts`
- **Provider**: Creative Studio provider
- **Feature**: creative-studio-chat

### ✅ 4. `/api/ai-chat` - COMPLETE
- **Status**: Logging added (line 234-249)
- **File**: `app/api/ai-chat/route.ts`
- **Provider**: Simulated anthropic/openai/google
- **Feature**: ai-chat

### ✅ 5. `/api/general-ai-chat` - COMPLETE
- **Status**: Logging added (line 37-51)
- **File**: `app/api/general-ai-chat/route.ts`
- **Provider**: Smart selection (Claude/OpenAI)
- **Feature**: general-ai-chat

### ✅ 6. `/api/ai/chat` - SKIPPED
- **File**: `app/api/ai/chat/route.ts`
- **Note**: Database management endpoint only - does NOT generate AI responses
- **Feature**: N/A (not an AI chat endpoint)

### ✅ 7. `/api/ai/assistant` - COMPLETE
- **Status**: Logging added (line 175-191)
- **File**: `app/api/ai/assistant/route.ts`
- **Provider**: OpenAI Assistant API
- **Feature**: ai-assistant

### ✅ 8. `/api/chat` - COMPLETE
- **Status**: Logging added (line 80-94)
- **File**: `app/api/chat/route.ts`
- **Provider**: Lead capture chatbot
- **Feature**: chat-widget

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
3. ✅ Add logging to all 7 AI endpoints (help-assistant, creative-studio/chat, ai-chat, general-ai-chat, ai/assistant, chat)
4. ⏳ Build admin dashboard (`/admin/ai-sessions/page.tsx`)
5. ⏳ Test all endpoints with real conversations
6. ⏳ Verify Supabase data capture in `ai_sessions` and `ai_conversations` tables
7. ⏳ Document for team

---

## Success Metrics

After implementation:
- ✅ All 7 AI chat endpoints logging to Supabase
- ⏳ Admin dashboard showing real-time usage data
- ⏳ Design-Rite employees can view user conversations
- ⏳ Lead qualification insights from AI interactions
- ⏳ Usage analytics for each AI tool
