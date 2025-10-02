/**
 * Document AI - Generate Document API Route
 * Migrated from Supabase Edge Function to Next.js API Route
 * Generates security assessment reports, invoices, proposals using AI
 * Auth: Supabase Auth (migrated from Next-Auth 2025-10-02)
 * Original: Designalmostright/supabase/functions/generate-document
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { incrementUsage, logActivity } from '@/lib/permissions';

// Supabase admin client for database operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface GenerateDocumentRequest {
  document_type: 'security_assessment' | 'proposal' | 'invoice';
  assessment_data?: any; // Security assessment data
  conversation_id?: string; // Link to chat conversation
  title?: string; // Custom document title
}

export async function POST(req: NextRequest) {
  try {
    // ============================================
    // AUTHENTICATION - Supabase Auth
    // ============================================
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    console.log('[Doc AI Generate] Processing request for user:', userId);

    // ============================================
    // PARSE REQUEST BODY
    // ============================================
    const body: GenerateDocumentRequest = await req.json();
    const { document_type, assessment_data, conversation_id, title } = body;

    if (!document_type) {
      return NextResponse.json(
        { error: 'document_type is required' },
        { status: 400 }
      );
    }

    console.log('[Doc AI Generate] Document type:', document_type);

    // ============================================
    // FETCH USER PROFILE & BRANDING
    // ============================================
    const { data: user } = await supabaseAdmin
      .from('profiles')
      .select('company, full_name, email')
      .eq('id', userId)
      .single();

    // Get user theme for branding (logo, colors)
    const { data: theme } = await supabaseAdmin
      .from('user_themes')
      .select('logo_url, primary_color, company_tagline')
      .eq('user_id', userId)
      .single();

    const companyName = user?.company || 'Your Company';
    const contactName = user?.full_name || 'Contact Name';
    const logoUrl = theme?.logo_url || '';
    const primaryColor = theme?.primary_color || '#8b5cf6';
    const tagline = theme?.company_tagline || '';

    const reportTitle = title || `${companyName} Security Assessment Report`;

    console.log('[Doc AI Generate] Company:', companyName);

    // ============================================
    // BUILD AI PROMPT
    // ============================================
    let prompt = '';

    if (document_type === 'security_assessment') {
      prompt = `Generate a professional security assessment report titled "${reportTitle}" based on the following assessment data. Use the company name "${companyName}" throughout the document. Structure it with sections: Executive Summary, Assessment Findings, Recommendations, Implementation Plan, and Pricing.

Assessment Data:
${JSON.stringify(assessment_data, null, 2)}

Key Requirements:
- Replace any placeholders like {{company_name}} with "${companyName}"
- Make recommendations specific to the provided data (budget, priorities, site layout, etc.)
- Include realistic pricing tiers based on the assessment
- Format as clean Markdown that can be converted to PDF
- Keep it professional and actionable
- Title the report "${reportTitle}"

Company Information:
- Company: ${companyName}
- Contact: ${contactName}
${logoUrl ? `- Logo URL: ${logoUrl}` : ''}
${tagline ? `- Tagline: ${tagline}` : ''}

Output only the Markdown content, no additional explanations.`;
    } else if (document_type === 'proposal') {
      prompt = `Generate a professional business proposal for "${companyName}". Include sections: Executive Summary, Scope of Work, Deliverables, Timeline, and Pricing. Format as Markdown. Use company branding: ${companyName}, ${contactName}.`;
    } else if (document_type === 'invoice') {
      prompt = `Generate a professional invoice for "${companyName}". Include: Invoice number, date, client details, line items, subtotal, tax, and total. Format as Markdown table.`;
    } else {
      return NextResponse.json(
        { error: `Unsupported document type: ${document_type}` },
        { status: 400 }
      );
    }

    // ============================================
    // CALL AI API (Gemini or OpenAI)
    // ============================================
    let generatedContent = '';

    // Option 1: Use Google Gemini (original implementation)
    if (process.env.GEMINI_API_KEY) {
      console.log('[Doc AI Generate] Using Google Gemini');

      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

      const geminiResponse = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096
          }
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('[Doc AI Generate] Gemini API error:', geminiResponse.status, errorText);
        throw new Error(`AI generation failed: ${geminiResponse.status}`);
      }

      const geminiData = await geminiResponse.json();
      generatedContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to generate content';

    }
    // Option 2: Use OpenAI (fallback)
    else if (process.env.OPENAI_API_KEY) {
      console.log('[Doc AI Generate] Using OpenAI');

      // Get AI model from admin_settings
      const { data: adminSettings } = await supabaseAdmin
        .from('admin_settings')
        .select('ai_model, api_key_encrypted')
        .limit(1)
        .single();

      const OPENAI_API_KEY = adminSettings?.api_key_encrypted || process.env.OPENAI_API_KEY;
      const model = adminSettings?.ai_model || 'gpt-4o-mini';

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional document generator. Generate clean Markdown documents based on the provided data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.text();
        console.error('[Doc AI Generate] OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      generatedContent = openaiData.choices[0]?.message?.content || 'Failed to generate content';

    } else {
      throw new Error('No AI API key configured (GEMINI_API_KEY or OPENAI_API_KEY)');
    }

    // ============================================
    // POST-PROCESS CONTENT
    // ============================================
    // Replace any remaining placeholders
    generatedContent = generatedContent
      .replace(/\{\{company_name\}\}/g, companyName)
      .replace(/\{\{contact_name\}\}/g, contactName)
      .replace(/\{\{logo_url\}\}/g, logoUrl)
      .replace(/```markdown\n?/g, '') // Remove markdown code fences if present
      .replace(/\n?```$/g, '')
      .trim();

    console.log('[Doc AI Generate] Content generated, length:', generatedContent.length);

    // ============================================
    // SAVE TO DATABASE
    // ============================================
    const insertData: any = {
      user_id: userId,
      document_type,
      document_category: document_type === 'security_assessment' ? 'security_reports' : 'business_documents',
      title: reportTitle,
      content: generatedContent,
      client_name: companyName
    };

    if (conversation_id) {
      insertData.conversation_id = conversation_id;
    }

    const { data: savedDoc, error: saveError } = await supabaseAdmin
      .from('generated_documents')
      .insert(insertData)
      .select()
      .single();

    if (saveError) {
      console.error('[Doc AI Generate] Save error:', saveError);
      // Don't fail the whole request if saving fails
    }

    console.log('[Doc AI Generate] ✅ Document saved:', savedDoc?.id);

    // ============================================
    // LOG ACTIVITY & INCREMENT USAGE
    // ============================================
    await logActivity(userId, 'document_generated', {
      success: true,
      details: {
        document_type,
        document_id: savedDoc?.id,
        content_length: generatedContent.length
      }
    });

    await incrementUsage(userId, 'generated_documents');

    // ============================================
    // RETURN RESPONSE
    // ============================================
    return NextResponse.json({
      success: true,
      content: generatedContent,
      document_id: savedDoc?.id || null,
      title: reportTitle,
      metadata: {
        company: companyName,
        contact: contactName,
        logo_url: logoUrl,
        primary_color: primaryColor
      }
    });

  } catch (error) {
    console.error('[Doc AI Generate] Error:', error);

    // Log failed activity
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      await logActivity(session.user.id, 'document_generated', {
        success: false,
        errorMessage: (error as Error).message
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
    }
  });
}
