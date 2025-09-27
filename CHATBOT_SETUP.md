# Design-Rite Chat Assistant Setup

## 🤖 OpenAI Assistant Configuration

To use your specific OpenAI Assistant, add these environment variables to your `.env.local` file:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=your_assistant_id_here
```

## 📋 Assistant Instructions

Based on your files, your assistant should be configured with instructions about:

1. **Design-Rite Platform Navigation**
   - Security Estimate tool (5-minute quick estimates)
   - AI Discovery Assistant (15-20 minute comprehensive assessments)
   - AI Assistant Refinement (chat-based improvements)

2. **Security System Expertise**
   - Video surveillance systems
   - Access control solutions
   - Intrusion detection
   - Fire safety systems

3. **Pricing Intelligence**
   - Real-time CDW pricing data
   - NDAA compliance (excludes banned manufacturers)
   - Professional markup and installation costs

4. **Company Information**
   - Design-Rite mission and values
   - Built by sales engineers for sales engineers
   - Focus on turning chaos into organized proposals

## 🔧 How It Works

1. **Thread Management**: Each chat session gets a unique OpenAI thread
2. **Fallback System**: If OpenAI fails, falls back to pattern-matching responses
3. **Smart Routing**: Uses `/api/chat/init` and `/api/chat/message` endpoints
4. **Error Handling**: Graceful degradation with helpful error messages

## 🚀 Testing

The chatbot is now live at **http://localhost:3007** and appears on every page:

1. Click the purple floating button in bottom-right corner
2. Start chatting with your Design-Rite assistant
3. Test both OpenAI Assistant responses and fallback responses

## 🛠 API Endpoints

- `GET /api/chat/init` - Health check and configuration status
- `POST /api/chat/init` - Create new OpenAI thread
- `GET /api/chat/message` - Health check for message handler
- `POST /api/chat/message` - Send message to OpenAI Assistant
- `GET /api/help-assistant` - Health check for fallback system
- `POST /api/help-assistant` - Fallback response system

## 🎯 Component Features

- **Clean UI**: Matches your original design exactly
- **Minimize/Maximize**: Full window management
- **Thread Persistence**: Conversations maintained per session
- **Typing Indicators**: Animated loading states
- **Error Recovery**: Automatic fallback to help system
- **Mobile Responsive**: Works on all devices

Your OpenAI Assistant should now be fully integrated and ready to help users with Design-Rite platform questions!