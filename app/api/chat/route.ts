import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { logAIConversation, generateUserHash, generateSessionId } from '../../../lib/ai-session-logger';

const supabaseUrl = 'https://ickwrbdpuorzdpzqbqpf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja3dyYmRwdW9yemRwenFicXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk1MDc4MywiZXhwIjoyMDY2NTI2NzgzfQ.LGGTBZF3ADOZv7cW7rEGzUi_0JluWf59yw2jWLuOJHo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simple conversation flow stages
const CHAT_STAGES = {
  INITIAL: 'initial',
  ASK_NAME: 'ask_name',
  ASK_COMPANY: 'ask_company',
  ASK_EMAIL: 'ask_email',
  ASK_NEED: 'ask_need',
  COMPLETE: 'complete'
};

export async function POST(request: Request) {
  try {
    const { message, sessionId, stage, userData } = await request.json();
    
    let nextStage = stage || CHAT_STAGES.INITIAL;
    let botResponse = '';
    let updatedUserData = { ...userData };
    
    // Handle conversation based on current stage
    switch (stage) {
      case CHAT_STAGES.INITIAL:
        botResponse = "Hi! I'm the Design-Rite AI Assistant. I can help you revolutionize your security system design process. What's your name?";
        nextStage = CHAT_STAGES.ASK_NAME;
        break;
        
      case CHAT_STAGES.ASK_NAME:
        updatedUserData.name = message;
        botResponse = `Nice to meet you, ${message}! What company are you with?`;
        nextStage = CHAT_STAGES.ASK_COMPANY;
        break;
        
      case CHAT_STAGES.ASK_COMPANY:
        updatedUserData.company = message;
        botResponse = `${message} sounds like a great company! What's the best email to reach you at?`;
        nextStage = CHAT_STAGES.ASK_EMAIL;
        break;
        
      case CHAT_STAGES.ASK_EMAIL:
        if (message.includes('@')) {
          updatedUserData.email = message;
          botResponse = `Perfect! What specific security challenges are you looking to solve? (e.g., faster proposals, compliance documentation, design automation)`;
          nextStage = CHAT_STAGES.ASK_NEED;
          
          // Save lead immediately when we get email
          await saveLeadToDatabase(sessionId, updatedUserData);
        } else {
          botResponse = "Please provide a valid email address so we can send you helpful information.";
          nextStage = CHAT_STAGES.ASK_EMAIL; // Stay on same stage
        }
        break;
        
      case CHAT_STAGES.ASK_NEED:
        updatedUserData.needs = message;
        botResponse = `That's exactly what Design-Rite can help with! Based on your needs, I recommend:\n\n✅ Start with our FREE trial (3 assessments)\n✅ See how AI can reduce design time by 90%\n✅ Generate professional proposals in minutes\n\nWould you like me to set up your free trial now?`;
        nextStage = CHAT_STAGES.COMPLETE;
        
        // Update with final info
        await updateChatInteraction(sessionId, updatedUserData, message);
        break;
        
      case CHAT_STAGES.COMPLETE:
        // Handle any follow-up questions
        botResponse = handleGeneralQuestion(message);
        break;

      default:
        botResponse = "Hi! Let me help you discover how Design-Rite can transform your security design process. What's your name?";
        nextStage = CHAT_STAGES.ASK_NAME;
    }

    // Log conversation to Supabase (non-blocking)
    const finalSessionId = sessionId || generateSessionId()
    const userHash = generateUserHash()
    logAIConversation({
      sessionId: finalSessionId,
      userHash,
      userMessage: message,
      aiResponse: botResponse,
      aiProvider: 'chatbot-lead-capture',
      metadata: {
        feature: 'chat-widget',
        stage: nextStage,
        userData: updatedUserData
      }
    }).catch(err => console.error('[Chat Widget] Logging error:', err))

    return NextResponse.json({
      response: botResponse,
      nextStage,
      userData: updatedUserData,
      sessionId: finalSessionId
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Chat service error' },
      { status: 500 }
    );
  }
}

async function saveLeadToDatabase(sessionId: string, userData: any) {
  try {
    // Save to chat_interactions table
    const { error: chatError } = await supabase
      .from('chat_interactions')
      .insert([{
        session_id: sessionId,
        visitor_email: userData.email?.toLowerCase(),
        visitor_name: userData.name,
        company: userData.company,
        messages: userData,
        lead_score: 75, // High score for providing contact info
        created_at: new Date().toISOString()
      }]);
    
    if (chatError) {
      console.error('Chat save error:', chatError);
    }
    
    // Also add to waitlist if new email
    const { data: existing } = await supabase
      .from('waitlist_subscribers')
      .select('email')
      .eq('email', userData.email?.toLowerCase())
      .single();
    
    if (!existing) {
      await supabase
        .from('waitlist_subscribers')
        .insert([{
          email: userData.email?.toLowerCase(),
          company_name: userData.company,
          source_page: 'chat-widget',
          created_at: new Date().toISOString(),
          opted_in: true
        }]);
    }
    
    // Update lead score
    await supabase
      .from('lead_scores')
      .upsert({
        email: userData.email?.toLowerCase(),
        total_score: 75,
        engagement_score: 50,
        intent_score: 25,
        last_activity: new Date().toISOString(),
        lead_status: 'hot'
      });
    
    console.log('✅ Chat lead saved:', userData.email);
  } catch (err) {
    console.error('Database error:', err);
  }
}

async function updateChatInteraction(sessionId: string, userData: any, needs: string) {
  try {
    await supabase
      .from('chat_interactions')
      .update({
        messages: { ...userData, needs },
        inquiry_type: extractInquiryType(needs),
        lead_score: 100 // Maximum score for complete interaction
      })
      .eq('session_id', sessionId);
  } catch (err) {
    console.error('Update error:', err);
  }
}

function extractInquiryType(needs: string): string {
  const lower = needs.toLowerCase();
  if (lower.includes('proposal')) return 'proposal_automation';
  if (lower.includes('compliance')) return 'compliance';
  if (lower.includes('design')) return 'system_design';
  if (lower.includes('assessment')) return 'assessments';
  return 'general';
}

function handleGeneralQuestion(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('price') || lower.includes('cost')) {
    return "Our pricing is simple:\n\n💰 FREE Trial: 3 assessments\n💰 Professional: $299/month (unlimited)\n💰 Enterprise: Custom pricing\n💰 White-label available\n\nWant to start with the free trial?";
  }
  
  if (lower.includes('demo')) {
    return "I'd love to show you a demo! You can:\n\n1. Try it yourself with our free trial\n2. Schedule a personalized demo\n3. Watch our 5-minute overview video\n\nWhich would you prefer?";
  }
  
  if (lower.includes('how') || lower.includes('work')) {
    return "Design-Rite works in 3 simple steps:\n\n1️⃣ Input facility details\n2️⃣ AI generates complete security design\n3️⃣ Export professional proposals & BOMs\n\nCuts design time by 90%! Want to try it?";
  }
  
  return "Great question! Our platform helps with:\n\n• AI-powered security assessments\n• Automated proposal generation\n• Compliance documentation\n• Professional BOMs\n\nWhat aspect interests you most?";
}

function generateSessionId(): string {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}