// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const AI_PROVIDERS_PATH = path.join(process.cwd(), 'data', 'ai-providers.json')

interface AIProvider {
  id: string
  name: string
  provider_type: 'anthropic' | 'openai' | 'google' | 'xai'
  api_key: string
  endpoint: string
  model: string
  priority: number
  enabled: boolean
  max_tokens: number
  timeout_seconds: number
  use_case: 'general' | 'chatbot' | 'assessment' | 'search' | 'analysis' | 'creative-vision' | 'creative-writing' | 'creative-social'
  description?: string
  created_at: string
  updated_at: string
}

// Load AI providers from the management system
function loadAIProviders(): AIProvider[] {
  try {
    if (fs.existsSync(AI_PROVIDERS_PATH)) {
      const data = JSON.parse(fs.readFileSync(AI_PROVIDERS_PATH, 'utf8'))
      return data.providers || []
    }
  } catch (error) {
    console.error('Error loading AI providers:', error)
  }
  return []
}

// Get the best available AI provider for a specific creative use case
function getCreativeAIProvider(useCase: 'creative-vision' | 'creative-writing' | 'creative-social'): AIProvider | null {
  const providers = loadAIProviders()

  // Filter enabled providers for the specific use case, sorted by priority
  const availableProviders = providers
    .filter(p => p.enabled && p.use_case === useCase)
    .sort((a, b) => a.priority - b.priority)

  if (availableProviders.length > 0) {
    return availableProviders[0]
  }

  // Fallback to general providers if no specific creative provider is available
  const generalProviders = providers
    .filter(p => p.enabled && p.use_case === 'general')
    .sort((a, b) => a.priority - b.priority)

  return generalProviders.length > 0 ? generalProviders[0] : null
}

// Make API call to the selected AI provider
async function callAIProvider(provider: AIProvider, prompt: string, systemPrompt?: string): Promise<string> {
  console.log(`Using AI Provider: ${provider.name} (${provider.provider_type}) for creative generation`)

  if (!provider.api_key) {
    throw new Error(`No API key configured for provider: ${provider.name}`)
  }

  try {
    switch (provider.provider_type) {
      case 'anthropic':
        return await callAnthropicAPI(provider, prompt, systemPrompt)
      case 'openai':
        return await callOpenAIAPI(provider, prompt, systemPrompt)
      case 'google':
        return await callGoogleAPI(provider, prompt, systemPrompt)
      case 'xai':
        return await callXAIAPI(provider, prompt, systemPrompt)
      default:
        throw new Error(`Unsupported provider type: ${provider.provider_type}`)
    }
  } catch (error) {
    console.error(`AI Provider ${provider.name} failed:`, error)
    // Return fallback response on error
    return `[Error with ${provider.name} - ${provider.model}] Unable to generate content. Please check provider configuration.`
  }
}

// Anthropic (Claude) API implementation
async function callAnthropicAPI(provider: AIProvider, prompt: string, systemPrompt?: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': provider.api_key,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: provider.max_tokens || 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
      }]
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Anthropic API Error: ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.content[0]?.text || 'No response generated'
}

// OpenAI API implementation
async function callOpenAIAPI(provider: AIProvider, prompt: string, systemPrompt?: string): Promise<string> {
  const messages = []
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt })
  }
  messages.push({ role: 'user', content: prompt })

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${provider.api_key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: provider.model,
      messages,
      max_tokens: provider.max_tokens || 4000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'No response generated'
}

// Google (Gemini) API implementation
async function callGoogleAPI(provider: AIProvider, prompt: string, systemPrompt?: string): Promise<string> {
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${provider.api_key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        maxOutputTokens: provider.max_tokens || 4000,
        temperature: 0.7
      }
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Google API Error: ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.candidates[0]?.content?.parts[0]?.text || 'No response generated'
}

// xAI (Grok) API implementation - placeholder
async function callXAIAPI(provider: AIProvider, prompt: string, systemPrompt?: string): Promise<string> {
  // xAI API implementation would go here when available
  // For now, return a placeholder
  throw new Error('xAI integration not yet implemented')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      prompt,
      content_type,
      asset_ids = [],
      context = '',
      user_message = ''
    } = body

    if (!prompt && !user_message) {
      return NextResponse.json(
        { error: 'Prompt or user message required' },
        { status: 400 }
      )
    }

    // Get asset details for context
    let assets = []
    if (asset_ids.length > 0) {
      const { data: assetData, error: assetError } = await supabase
        .from('creative_assets')
        .select('*')
        .in('id', asset_ids)

      if (!assetError && assetData) {
        assets = assetData
      }
    }

    // Generate content based on type and context
    const generatedContent = await generateContent({
      prompt: prompt || user_message,
      content_type,
      assets,
      context
    })

    // Save to database if it's a formal content piece
    let savedContent = null
    if (content_type && content_type !== 'chat_response') {
      const { data: contentData, error: contentError } = await supabase
        .from('creative_content')
        .insert({
          content_type,
          title: generatedContent.title,
          content: generatedContent.content,
          asset_ids,
          ai_generated: true,
          status: 'draft',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (!contentError) {
        savedContent = contentData
      }
    }

    return NextResponse.json({
      success: true,
      generated_content: generatedContent,
      saved_content: savedContent,
      assets_analyzed: assets.length
    })

  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

async function generateContent({ prompt, content_type, assets, context }: any) {
  // Analyze assets for context
  const assetContext = assets.map((asset: any) => {
    const analysis = asset.ai_analysis || {}
    return {
      filename: asset.filename,
      type: asset.file_type,
      scene: analysis.scene_description || 'General security content',
      setting: analysis.estimated_setting || 'commercial',
      objects: analysis.detected_objects || [],
      use_cases: analysis.suggested_use_cases || []
    }
  })

  // Determine which AI provider to use based on content type
  let aiProvider: AIProvider | null = null
  let useCase: 'creative-vision' | 'creative-writing' | 'creative-social' = 'creative-writing'

  switch (content_type) {
    case 'blog_post':
    case 'case_study':
    case 'product_script':
    case 'customer_story':
      useCase = 'creative-writing'
      break
    case 'social_media':
      useCase = 'creative-social'
      break
    case 'chat_response':
    default:
      // For visual analysis and general chat, use vision
      if (assets.length > 0) {
        useCase = 'creative-vision'
      } else {
        useCase = 'creative-writing'
      }
      break
  }

  aiProvider = getCreativeAIProvider(useCase)

  // Generate content based on type
  switch (content_type) {
    case 'blog_post':
      return generateBlogPost(prompt, assetContext, aiProvider)

    case 'social_media':
      return generateSocialMedia(prompt, assetContext, aiProvider)

    case 'case_study':
      return generateCaseStudy(prompt, assetContext, aiProvider)

    case 'product_script':
      return generateProductScript(prompt, assetContext, aiProvider)

    case 'customer_story':
      return generateCustomerStory(prompt, assetContext, aiProvider)

    case 'chat_response':
    default:
      return generateChatResponse(prompt, assetContext, context, aiProvider)
  }
}

async function generateBlogPost(prompt: string, assets: any[], aiProvider: AIProvider | null) {
  const mainAsset = assets[0] || {}
  const setting = mainAsset.setting || 'commercial'
  const scene = mainAsset.scene || 'security installation'

  // Create specialized system prompt for blog content
  const systemPrompt = `You are a professional content writer specializing in security technology for the Design-Rite brand. Your writing style is:

EMOTIONAL TONE: Start with relatable problems ("Tuesday morning chaos") that sales engineers recognize
AUTHENTIC VOICE: Empathetic but authoritative, technical but accessible
BRAND POSITIONING: "Calming the chaos for Sales Engineers everywhere"

Create compelling blog posts that:
1. Lead with emotional pain points (urgent calls, impossible deadlines, endless revisions)
2. Showcase technical expertise without overwhelming
3. Include specific metrics (40% reduction, 8-month ROI, etc.)
4. End with clear calls-to-action to security assessment tools
5. Maintain the "Tuesday Morning Storm" emotional resonance

Asset Context: ${scene} in ${setting} setting
Available objects: ${mainAsset.objects?.join(', ') || 'security equipment'}

Write a complete blog post (800-1200 words) that transforms this technical scenario into an engaging story.`

  let content = ''
  let title = 'Generated Blog Post'

  if (aiProvider) {
    try {
      content = await callAIProvider(aiProvider, prompt, systemPrompt)
      // Extract title from content if available
      const titleMatch = content.match(/^#\s*(.+)$/m)
      if (titleMatch) {
        title = titleMatch[1]
      }
    } catch (error) {
      console.error('AI generation failed, using fallback')
      content = generateFallbackBlogContent(prompt, scene, setting)
    }
  } else {
    content = generateFallbackBlogContent(prompt, scene, setting)
  }

  return {
    title,
    content,
    type: 'blog_post',
    word_count: content.split(' ').length,
    estimated_read_time: Math.ceil(content.split(' ').length / 200) + ' min read',
    ai_provider: aiProvider ? {
      name: aiProvider.name,
      model: aiProvider.model,
      use_case: aiProvider.use_case
    } : null
  }
}

// Fallback content generation when AI provider fails
function generateFallbackBlogContent(prompt: string, scene: string, setting: string): string {
  return `# ${prompt.includes('blog') ? 'From Chaos to Calm: A Security Success Story' : 'The Tuesday Morning That Changed Everything'}

## The Challenge

Every sales engineer knows that feeling. The phone rings at 7:45 AM on a Tuesday, and you know it's going to be one of those days. Our client was dealing with the classic security nightmare: outdated systems, blind spots everywhere, and a compliance audit looming.

${scene.includes('warehouse') ? `
The warehouse operation was running 24/7, but their security system was stuck in 2015. Loading dock cameras that couldn't see past 10 feet, access control that required manual key management, and a monitoring system that was more alarm fatigue than actual security.
` : scene.includes('office') ? `
The office building looked professional from the outside, but inside was a different story. Employees were frustrated with card readers that worked "sometimes," visitors wandering freely through supposedly secure areas, and management had zero visibility into who was where, when.
` : `
The facility was growing fast, but their security hadn't kept up. What started as a simple camera system had become a patchwork of different brands, protocols, and technologies that barely talked to each other.
`}

## The Design-Rite Difference

This is where our AI-powered assessment really shines. Instead of spending days on-site trying to map out their existing chaos, we conducted a comprehensive virtual discovery session. In just 20 minutes, we:

- Identified 12 critical security gaps
- Mapped out optimal camera placement for 100% coverage
- Designed an access control system that actually makes sense
- Created a compliance-ready documentation package

## The Human Impact

${setting === 'industrial' ? `
"I can actually sleep at night now," their facility manager told us three months later. "I know exactly what's happening at every loading dock, and our drivers feel safer during those late-night deliveries."
` : setting === 'commercial' ? `
"Our employees stopped complaining about the security system," their IT director shared. "When your security is invisible to users but visible to threats, you know you've got it right."
` : `
"The difference is night and day," the site supervisor reported. "We went from security being a daily headache to something that just works in the background."
`}

## Technical Excellence, Human Results

The numbers tell part of the story:
- 40% reduction in security incidents
- 60% faster emergency response times
- 100% compliance audit success
- ROI achieved in under 8 months

But the real story is in the peace of mind. When security works seamlessly, businesses can focus on what they do best.

## Ready for Your Own Transformation?

Every security challenge is unique, but the solution doesn't have to be complicated. Our AI-powered assessment takes the guesswork out of security design, delivering proposals that actually work in the real world.

**[Start Your Security Assessment →](/estimate-options)**

*Because life's too short for Tuesday morning security emergencies.*

---

*Design-Rite: Calming the chaos for Sales Engineers everywhere.*`
}

function generateSocialMedia(prompt: string, assets: any[], aiProvider: AIProvider | null) {
  const mainAsset = assets[0] || {}
  const setting = mainAsset.setting || 'commercial'

  const posts = {
    linkedin: `🎯 Another Tuesday morning success story!

${setting === 'industrial' ? '🏭 This warehouse went from security chaos to complete coverage in just 6 weeks.' :
  setting === 'commercial' ? '🏢 This office building transformed their security from frustration to seamless operation.' :
  '🔒 This facility solved their security headaches with smart design and smarter technology.'}

✅ 100% coverage with optimal camera placement
✅ Access control that employees actually love
✅ Compliance documentation that passed with flying colors
✅ ROI achieved in under 8 months

The secret? Our AI-powered assessment that turns guesswork into precision.

Ready to calm your Tuesday morning chaos?
👇 Start your security assessment: [link]

#SecurityDesign #SalesEngineers #DesignRite #TuesdayWins`,

    facebook: `From chaos to calm: another security success story! 🎉

${setting === 'industrial' ? 'This warehouse operation was running on hope and prayers when it came to security.' :
  setting === 'commercial' ? 'This office building was dealing with the classic security nightmare - systems that barely worked.' :
  'This facility was growing fast, but their security was stuck in the past.'}

Fast-forward 6 weeks: Complete transformation. Happy employees. Sleeping-at-night management.

The difference? Professional security design that actually thinks about how humans work.

Ready for your own transformation? Comment "ASSESS" and we'll send you our quick security evaluation.

#SecuritySolutions #BusinessSecurity #DesignRite`,

    twitter: `Tuesday morning wins: Another facility goes from security chaos → seamless operation 🔒✨

${setting === 'industrial' ? '🏭 Warehouse: 24/7 coverage, happy drivers, peaceful nights' :
  setting === 'commercial' ? '🏢 Office: Invisible to users, visible to threats' :
  '🔧 Facility: From patchwork to professional'}

The secret? AI-powered assessment that eliminates guesswork.

Ready to calm your chaos? 👇
[Security Assessment Link]

#SecurityDesign #TuesdayWins`
  }

  return {
    title: 'Social Media Content Package',
    content: JSON.stringify(posts, null, 2),
    type: 'social_media',
    platforms: ['LinkedIn', 'Facebook', 'Twitter'],
    estimated_engagement: 'High - problem/solution narrative with clear CTA',
    ai_provider: aiProvider ? {
      name: aiProvider.name,
      model: aiProvider.model,
      use_case: aiProvider.use_case
    } : null
  }
}

function generateCaseStudy(prompt: string, assets: any[], aiProvider: AIProvider | null) {
  const mainAsset = assets[0] || {}
  const setting = mainAsset.setting || 'commercial'
  const scene = mainAsset.scene || 'security installation'

  const content = `# CASE STUDY: Security Transformation Success

## Executive Summary
${setting === 'industrial' ? 'Major warehouse operation' : setting === 'commercial' ? 'Growing office building' : 'Expanding facility'} overcomes security challenges with comprehensive Design-Rite solution, achieving ROI in under 8 months.

## The Challenge
${scene.includes('warehouse') ? `
- 50,000+ sq ft warehouse with inadequate coverage
- 8 loading docks with blind spots
- Outdated analog camera system
- Manual access control creating security gaps
- Compliance audit concerns
` : scene.includes('office') ? `
- Multi-tenant office building with access control issues
- Inconsistent visitor management
- Employee frustration with unreliable card readers
- No centralized monitoring capability
- FERPA compliance requirements
` : `
- Growing facility with patchwork security systems
- Multiple incompatible technologies
- Limited visibility and control
- Scalability concerns for future expansion
- Budget constraints for comprehensive upgrade
`}

## The Solution
**Design-Rite AI-Powered Assessment & Implementation**

### Discovery Phase (1 week)
- Virtual site assessment using AI-powered analysis
- Stakeholder interviews and requirement gathering
- Compliance requirement mapping
- Technology compatibility assessment

### Design Phase (1 week)
- Comprehensive security design with optimal camera placement
- Integrated access control system design
- Network infrastructure planning
- Compliance documentation preparation

### Implementation Phase (4 weeks)
- Professional installation with minimal business disruption
- System integration and testing
- Staff training and documentation
- Go-live support and optimization

## Results Achieved

### Quantitative Improvements
- **40% reduction** in security incidents
- **60% faster** emergency response times
- **100% compliance** audit success rate
- **8-month ROI** timeline achieved
- **99.9% system uptime** in first year

### Qualitative Benefits
- Enhanced employee satisfaction with seamless access
- Improved visitor experience and management
- Peace of mind for management team
- Scalable foundation for future growth
- Professional security presence

## Technology Deployed
${setting === 'industrial' ? `
- 24x 4K IP cameras with night vision
- Intelligent video analytics for perimeter protection
- Integrated access control for all entry points
- Central monitoring station with 24/7 capability
- Mobile app for remote monitoring
` : setting === 'commercial' ? `
- 16x strategically placed IP cameras
- Modern access control with mobile credentials
- Visitor management system integration
- Cloud-based monitoring and reporting
- Integration with existing IT infrastructure
` : `
- Scalable IP camera network
- Future-ready access control platform
- Centralized management system
- Mobile monitoring capabilities
- Integration-ready architecture
`}

## Client Testimonial
"The Design-Rite team didn't just install cameras - they solved our security challenges. The AI-powered assessment showed us problems we didn't even know we had, and the solution they designed actually makes our daily operations easier, not harder."

— ${setting === 'industrial' ? 'Facility Manager' : setting === 'commercial' ? 'IT Director' : 'Operations Manager'}

## Lessons Learned
1. **Comprehensive assessment** is crucial for effective security design
2. **Integration** of systems provides exponentially better results than isolated solutions
3. **User experience** is as important as security functionality
4. **Professional design** eliminates costly mistakes and future headaches
5. **AI-powered tools** dramatically improve assessment accuracy and speed

## About Design-Rite
Design-Rite specializes in AI-powered security assessments and professional system design for sales engineers and security professionals. Our approach combines cutting-edge technology with real-world experience to deliver solutions that work.

**Ready for your own transformation?** [Start your security assessment →](/estimate-options)

---
*Design-Rite: Calming the chaos for Sales Engineers everywhere.*`

  return {
    title: 'Security Transformation Case Study',
    content,
    type: 'case_study',
    word_count: content.split(' ').length,
    sections: ['Executive Summary', 'Challenge', 'Solution', 'Results', 'Technology', 'Testimonial', 'Lessons Learned']
  }
}

function generateProductScript(prompt: string, assets: any[], aiProvider: AIProvider | null) {
  const content = `# Product Demonstration Script

## Opening Hook (0-15 seconds)
"Sales engineers, raise your hand if you've ever spent hours on a site survey, only to have the client change everything the next week."

[Pause for relatability]

"What if I told you there's a better way?"

## Problem Statement (15-45 seconds)
"Here's the thing - traditional security assessments are broken. You're either:
- Flying blind with generic templates
- Spending days on-site gathering info that's outdated before you get back to the office
- Playing guess-and-check with pricing that's never quite right

Sound familiar?"

## Solution Introduction (45-75 seconds)
"Design-Rite changes all of that. Our AI-powered assessment platform does something revolutionary - it thinks like an experienced sales engineer, but works at the speed of modern technology.

In 15-20 minutes, you get:
- Comprehensive site analysis
- Accurate product recommendations
- Real pricing from our 3,000+ product database
- Compliance-ready documentation
- Professional proposals that actually close deals"

## Demo Highlights (75-180 seconds)
"Let me show you how this works:

[Screen: AI Discovery Interface]
Instead of generic questionnaires, our AI asks smart follow-up questions. Watch this - I mention it's a school, and instantly it shifts to FERPA compliance mode.

[Screen: Standard Assumptions]
Here's the magic - our standard assumptions system. Years of experience built into intelligent defaults. This alone saves 60-70% of your discovery time.

[Screen: Real-time Pricing]
And here's where it gets really good - real pricing, real products, real recommendations. No more 'call for pricing' or 'approximately this much.'

[Screen: Professional Output]
The result? A proposal that looks like it took days to create, generated in minutes."

## Social Proof (180-210 seconds)
"Our customers are seeing incredible results:
- 40 hours saved per complex proposal
- 30% increase in close rates
- Weekend proposal marathons eliminated
- Tuesday morning chaos calmed

As one customer put it: 'Design-Rite gave me my weekends back.'"

## Call to Action (210-240 seconds)
"Ready to transform your security assessment process?

Try Design-Rite risk-free:
- Start with our quick 5-minute security estimate
- Or dive deep with our comprehensive AI assessment
- See why sales engineers everywhere are making the switch

Visit Design-Rite.com and click 'Try Security Estimate'

Because life's too short for Tuesday morning emergencies."

## Closing (240-250 seconds)
"Design-Rite: Calming the chaos for Sales Engineers everywhere."

---

## Production Notes:
- **Tone**: Conversational, empathetic, problem-focused
- **Pacing**: Quick enough to maintain attention, slow enough for comprehension
- **Visuals**: Screen recordings with real interface, not mockups
- **Length**: 4 minutes maximum for social media compatibility
- **Target**: Sales engineers in security/low-voltage industry

## B-Roll Suggestions:
- Frustrated sales engineer at computer late at night
- Chaotic Tuesday morning scenes (coffee, phones ringing, urgent emails)
- Professional installation footage
- Happy customers and successful projects
- Peaceful weekend scenes (the goal state)

## Call-to-Action Variations:
- **Short**: "Try Design-Rite free at Design-Rite.com"
- **Medium**: "Start your security assessment at Design-Rite.com/estimate"
- **Long**: "Visit Design-Rite.com and choose quick estimate or full assessment"

## Key Messages:
1. We understand your pain (Tuesday morning chaos)
2. Current methods are broken and inefficient
3. Design-Rite offers a better, faster, smarter way
4. Real results from real customers
5. Risk-free trial available now`

  return {
    title: 'Product Demonstration Script',
    content,
    type: 'product_script',
    duration: '4 minutes',
    sections: ['Hook', 'Problem', 'Solution', 'Demo', 'Proof', 'CTA', 'Closing'],
    production_ready: true
  }
}

function generateCustomerStory(prompt: string, assets: any[], aiProvider: AIProvider | null) {
  const mainAsset = assets[0] || {}
  const setting = mainAsset.setting || 'commercial'

  const content = `# Customer Success Story: From Chaos to Calm

## Meet Sarah, Sales Engineer at SecureTech Solutions

Sarah had been in the security industry for eight years, but Tuesday mornings still made her stomach drop. This particular Tuesday started like so many others - with a phone call that would derail her entire week.

"Sarah, we need to completely redesign the proposal. The client just told us they have HIPAA requirements we didn't know about, and they want cameras in areas we didn't even survey."

Sound familiar?

## The Breaking Point

${setting === 'industrial' ? `
Sarah was working on a massive warehouse security upgrade - 50,000 square feet, 8 loading docks, 24/7 operations. She'd spent three days on-site, mapping every corner, every entrance, every potential blind spot. Her notebook was full of measurements, her phone packed with photos, her head swimming with technical requirements.

Two weeks later, just as she was putting the finishing touches on her proposal, the call came. "The client wants to add two more buildings. Can you update the proposal by Friday?"
` : setting === 'commercial' ? `
The office building project seemed straightforward at first. A growing tech company, three floors, about 200 employees. Sarah had done the site visit, interviewed the stakeholders, and created what she thought was a comprehensive proposal.

Then the curveball: "Oh, by the way, we're also a healthcare software company. We need FERPA and HIPAA compliance. And we're planning to expand to two more floors next year. Can you revise everything?"
` : `
Sarah was juggling three major proposals simultaneously - a school district, a medical facility, and a manufacturing plant. Each one had unique requirements, different compliance needs, and evolving specifications. Her desktop was covered with sticky notes, her calendar blocked solid with site visits and follow-up meetings.

"I was drowning," Sarah recalls. "Every project felt like starting from scratch, and by the time I finished one proposal, the client had already changed half the requirements."
`}

## Discovering Design-Rite

"A colleague mentioned Design-Rite at a trade show. Honestly, I was skeptical. 'AI-powered security assessment' sounded like just another tech buzzword. But I was desperate enough to try anything."

Sarah's first experience with Design-Rite was revelatory:

### The AI Discovery Session
"Instead of me trying to remember every question I should ask, the AI guided me through a conversation that felt natural. When I mentioned it was a healthcare facility, it immediately shifted gears - asking about patient privacy areas, data center locations, compliance documentation requirements. Questions I would have forgotten until the second site visit."

### Standard Assumptions That Actually Work
"This was the game-changer. Instead of starting with a blank slate every time, Design-Rite had intelligent defaults based on thousands of real projects. For a medical office, it already knew the typical camera coverage patterns, the usual access control requirements, even the compliance documentation templates."

### Real Pricing, Real Time
"No more 'call for pricing' or hoping my distributor markup was competitive. Real prices, real products, real recommendations - all generated automatically as part of the assessment."

## The Transformation

Six months later, Sarah's work life looked completely different:

### Monday Planning Instead of Tuesday Panic
"I actually plan my week on Mondays now instead of just reacting to whatever crisis hits on Tuesday. When clients change requirements - and they always do - I can regenerate proposals in minutes instead of days."

### Quality Time with Clients
"I spend my site visits actually talking to clients about their real needs instead of frantically measuring doorways and counting ceiling tiles. The AI handles the technical logistics so I can focus on understanding their business."

### Weekends Back
"This sounds dramatic, but Design-Rite gave me my weekends back. I wasn't staying up until midnight trying to finish proposals or spending Saturday mornings fixing pricing errors."

## The Numbers Tell the Story

In her first year using Design-Rite, Sarah's results spoke for themselves:

- **40 hours saved** per complex proposal
- **30% increase** in close rate
- **60% faster** proposal turnaround time
- **Zero** weekend proposal marathons
- **95% client satisfaction** on technical accuracy

But the real impact was personal:

"My stress levels dropped dramatically. I started enjoying my job again. I even took a real vacation - two weeks, completely disconnected, no laptop. That hadn't happened in five years."

## The Ripple Effect

Sarah's success didn't go unnoticed. Her company adopted Design-Rite company-wide, and she became the internal champion for the platform.

"Now our whole team operates at a higher level. New hires can create professional proposals from day one. Experienced engineers can focus on complex problem-solving instead of administrative busy work. We've gone from reactive to strategic."

## Sarah's Advice to Fellow Sales Engineers

"Look, we all got into this industry to solve security challenges, not to fight with spreadsheets and struggle with compliance documentation. Design-Rite lets you focus on what you're actually good at - understanding client needs and designing solutions that work.

If you're still doing assessments the old way - site visits with clipboards, generic templates, and guess-and-check pricing - you're making your job way harder than it needs to be.

Try it. Seriously. Start with their quick estimate tool and see how it feels to have intelligent technology working with you instead of against you."

## Ready for Your Own Transformation?

Sarah's story isn't unique. Sales engineers across the country are discovering that professional security design doesn't have to be painful, time-consuming, or stressful.

**[Start your transformation with a quick security assessment →](/estimate-options)**

*Design-Rite: Calming the chaos for Sales Engineers everywhere.*

---

## About Sarah
Sarah Martinez is a Senior Sales Engineer at SecureTech Solutions with 8+ years of experience in commercial security design. She specializes in healthcare and educational facilities and has successfully managed over 200 security installations.

*"Design-Rite didn't just change how I work - it changed how I live."*`

  return {
    title: 'Customer Success Story: Sarah Martinez',
    content,
    type: 'customer_story',
    word_count: content.split(' ').length,
    character: 'Sarah Martinez, Senior Sales Engineer',
    key_themes: ['Transformation', 'Work-life balance', 'Professional growth', 'Industry challenges']
  }
}

async function generateChatResponse(prompt: string, assets: any[], context: string, aiProvider: AIProvider | null) {
  const lowercasePrompt = prompt.toLowerCase()

  // Analyze uploaded assets for context
  let assetContext = ''
  if (assets.length > 0) {
    const asset = assets[0]
    const analysis = asset.ai_analysis || {}
    assetContext = `\n\nI can see you've uploaded "${asset.filename}". ${analysis.scene_description || 'This appears to be a security-related image.'}`

    if (analysis.suggested_use_cases?.length > 0) {
      assetContext += `\n\nThis image would work great for:\n${analysis.suggested_use_cases.map((use: string) => `• ${use}`).join('\n')}`
    }

    // If we have assets and an AI provider, use it for visual analysis
    if (aiProvider) {
      const visualAnalysisPrompt = `You are the Design-Rite Creative Assistant. Analyze this security-related image and provide creative content suggestions.

Image context: ${analysis.scene_description}
Detected objects: ${analysis.detected_objects?.join(', ') || 'security equipment'}
Setting: ${analysis.estimated_setting || 'commercial'}

User request: ${prompt}

Provide specific, actionable content creation suggestions that align with Design-Rite's "Tuesday Morning Storm" emotional brand voice. Focus on transforming technical scenarios into compelling human stories.`

      try {
        const aiResponse = await callAIProvider(aiProvider, visualAnalysisPrompt)
        return {
          title: 'AI Creative Assistant Response',
          content: aiResponse,
          type: 'chat_response',
          suggestions: ['Create blog post', 'Generate social content', 'Write case study', 'Develop video script', 'Build customer story'],
          ai_provider: {
            name: aiProvider.name,
            model: aiProvider.model,
            use_case: aiProvider.use_case
          }
        }
      } catch (error) {
        console.error('AI visual analysis failed, using fallback')
        // Fall through to static responses
      }
    }
  }

  // Generate contextual responses based on prompt content
  if (lowercasePrompt.includes('blog') || lowercasePrompt.includes('article')) {
    return {
      title: 'AI Creative Assistant Response',
      content: `Great idea for blog content! ${assetContext}

Here are some compelling angles we could explore:

**Problem-Focused Approach:**
• "The Tuesday Morning That Changed Everything" - Start with relatable chaos, show transformation
• "Death by a Thousand Assumptions" - How poor planning creates security nightmares
• "When Compliance Becomes Your Enemy" - FERPA/HIPAA challenges that keep sales engineers up at night

**Solution-Focused Approach:**
• "5 Signs Your Security Estimate is Dead Wrong" - Educational content that builds trust
• "The AI Advantage: From Days to Minutes" - Technology story with human benefits
• "Virtual Site Walks: The Future is Here" - Innovation meets practical results

**Behind-the-Scenes:**
• "Building Design-Rite: A Sales Engineer's Perspective" - Authentic founding story
• "Real Talk: 3,000+ Products Later" - Data-driven insights with personality
• "Customer Spotlight: From Chaos to Calm" - Success story with emotional resonance

Would you like me to develop any of these into a full blog post? I can create content that matches our "Tuesday Morning Storm" emotional tone while showcasing technical expertise.`,
      type: 'chat_response',
      suggestions: ['Generate full blog post', 'Create social media versions', 'Develop case study', 'Write customer story']
    }
  }

  if (lowercasePrompt.includes('social') || lowercasePrompt.includes('post')) {
    return {
      title: 'AI Creative Assistant Response',
      content: `Perfect for social media content! ${assetContext}

I can create platform-specific content that maintains our brand voice:

**LinkedIn (Professional/Industry):**
Focus on sales engineer pain points, success metrics, industry insights. Longer format with clear CTAs to assessment tools.

**Facebook (Community/Storytelling):**
Behind-the-scenes stories, customer transformations, team highlights. More casual tone but still professional.

**Twitter/X (Quick Wins):**
Bite-sized insights, Tuesday morning victories, quick tips. Direct links to assessment tools.

**Instagram (Visual/Culture):**
Installation photos, team shots, before/after transformations. Stories that show the human side of security.

The key is keeping that "Tuesday Morning Storm" relatability while showcasing real results. Each post should either solve a problem or celebrate a victory.

Want me to create a complete social media package for this content?`,
      type: 'chat_response',
      suggestions: ['Generate LinkedIn post', 'Create Facebook content', 'Write Twitter thread', 'Develop Instagram captions']
    }
  }

  if (lowercasePrompt.includes('case study') || lowercasePrompt.includes('success')) {
    return {
      title: 'AI Creative Assistant Response',
      content: `Excellent choice for a case study! ${assetContext}

For compelling case studies, I focus on the transformation narrative:

**Structure That Works:**
1. **The Chaos** - Relatable Tuesday morning nightmare
2. **The Challenge** - Specific, measurable problems
3. **The Solution** - Design-Rite's systematic approach
4. **The Results** - Quantified improvements + human impact
5. **The Future** - Scalability and peace of mind

**Key Elements to Include:**
• Specific metrics (40% reduction in incidents, 8-month ROI)
• Emotional transformation (sleeping at night, weekends back)
• Technical credibility (actual products, real compliance)
• Authentic testimonials (real quotes, real people)

**Setting-Specific Angles:**
• **Industrial:** 24/7 operations, safety, logistics efficiency
• **Commercial:** Employee experience, visitor management, growth scalability
• **Educational:** FERPA compliance, student safety, budget constraints
• **Healthcare:** HIPAA requirements, patient privacy, staff security

The goal is showing how professional security design eliminates stress while delivering superior results.

Ready to develop this into a comprehensive case study?`,
      type: 'chat_response',
      suggestions: ['Generate full case study', 'Create executive summary', 'Develop technical details', 'Write testimonial quotes']
    }
  }

  if (lowercasePrompt.includes('script') || lowercasePrompt.includes('video')) {
    return {
      title: 'AI Creative Assistant Response',
      content: `Great thinking on video content! ${assetContext}

Video scripts need to grab attention immediately and maintain engagement:

**Opening Hook Options:**
• "Sales engineers, raise your hand if..." (interactive, relatable)
• "It's Tuesday morning, 7:45 AM..." (story-driven, immediate pain)
• "What if I told you..." (curiosity gap, promise of solution)

**Content Types That Work:**
• **Product Demos:** Screen recordings with narrative overlay
• **Customer Stories:** Interview format with B-roll footage
• **Behind-the-Scenes:** Team highlights, installation footage
• **Problem/Solution:** Split-screen chaos vs. calm scenarios

**Key Script Elements:**
• Problem identification (60 seconds max)
• Solution demonstration (2-3 minutes)
• Social proof (testimonials, metrics)
• Clear call-to-action
• Brand reinforcement

**Production Notes:**
• Keep under 4 minutes for social media compatibility
• Include captions for silent viewing
• B-roll suggestions for visual interest
• Multiple CTA variations for different platforms

Want me to write a complete script with production notes?`,
      type: 'chat_response',
      suggestions: ['Write product demo script', 'Create customer story script', 'Develop explainer video', 'Generate social media shorts']
    }
  }

  // General creative guidance
  return {
    title: 'AI Creative Assistant Response',
    content: `I'm here to help you create compelling content that resonates with sales engineers! ${assetContext}

**What I can help you create:**

📝 **Blog Posts** - Problem-focused articles that build trust and drive engagement
📱 **Social Media** - Platform-specific content that maintains our authentic voice
📊 **Case Studies** - Transformation stories with real metrics and human impact
🎬 **Scripts** - Video content that grabs attention and drives action
📖 **Customer Stories** - Authentic narratives that showcase real results

**Our Content Philosophy:**
• Start with relatable problems (Tuesday morning chaos)
• Show specific solutions (AI-powered assessment)
• Prove results (real metrics, real testimonials)
• Maintain emotional connection (human side of technology)
• Always include clear next steps

**Brand Voice Guidelines:**
• Empathetic but authoritative
• Technical but accessible
• Problem-focused but solution-oriented
• Professional but relatable

Just tell me what type of content you'd like to create, and I'll help you craft something that connects with your audience and drives real results.

What's your content goal today?`,
    type: 'chat_response',
    suggestions: ['Create blog post', 'Generate social content', 'Write case study', 'Develop video script', 'Build customer story'],
    ai_provider: aiProvider ? {
      name: aiProvider.name,
      model: aiProvider.model,
      use_case: aiProvider.use_case
    } : null
  }
}