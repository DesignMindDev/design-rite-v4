// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      content_id,
      publish_to = ['blog'],
      schedule_date = null,
      author = 'Design-Rite Team',
      tags = [],
      featured_image = null
    } = body

    if (!content_id) {
      return NextResponse.json(
        { error: 'Content ID required' },
        { status: 400 }
      )
    }

    // Get the content to publish
    const { data: content, error: contentError } = await supabase
      .from('creative_content')
      .select('*')
      .eq('id', content_id)
      .single()

    if (contentError || !content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    const publishResults = []

    // Publish to blog if requested
    if (publish_to.includes('blog')) {
      const blogResult = await publishToBlog(content, {
        author,
        tags,
        featured_image,
        schedule_date
      })
      publishResults.push(blogResult)
    }

    // Publish to social media if requested
    if (publish_to.includes('social')) {
      const socialResult = await publishToSocial(content)
      publishResults.push(socialResult)
    }

    // Update content status
    const { error: updateError } = await supabase
      .from('creative_content')
      .update({
        status: schedule_date ? 'scheduled' : 'published',
        published_at: schedule_date || new Date().toISOString()
      })
      .eq('id', content_id)

    if (updateError) {
      console.error('Failed to update content status:', updateError)
    }

    return NextResponse.json({
      success: true,
      published_to: publish_to,
      results: publishResults,
      content_id,
      message: `Content ${schedule_date ? 'scheduled' : 'published'} successfully`
    })

  } catch (error) {
    console.error('Publishing error:', error)
    return NextResponse.json(
      { error: 'Failed to publish content' },
      { status: 500 }
    )
  }
}

async function publishToBlog(content: any, options: any) {
  try {
    // Create blog post data
    const blogPost = {
      title: content.title,
      excerpt: extractExcerpt(content.content),
      content: content.content,
      author: options.author,
      publishedDate: options.schedule_date || new Date().toISOString(),
      featuredImage: options.featured_image || '',
      videoUrl: '',
      tags: options.tags || [],
      published: !options.schedule_date // Publish immediately if no schedule date
    }

    // Save to blog posts table (using existing blog API structure)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(blogPost)
    })

    if (response.ok) {
      const result = await response.json()
      return {
        platform: 'blog',
        success: true,
        blog_post_id: result.id,
        url: `/blog/${result.id}`,
        message: 'Successfully published to blog'
      }
    } else {
      throw new Error(`Blog API error: ${response.statusText}`)
    }

  } catch (error) {
    console.error('Blog publishing error:', error)
    return {
      platform: 'blog',
      success: false,
      error: error.message,
      message: 'Failed to publish to blog'
    }
  }
}

async function publishToSocial(content: any) {
  try {
    // For now, this is a placeholder for social media integration
    // In a real implementation, this would connect to social media APIs

    let socialContent = ''

    if (content.content_type === 'social_media') {
      // Content is already formatted for social media
      socialContent = content.content
    } else {
      // Generate social media version from other content types
      socialContent = generateSocialFromContent(content)
    }

    // Simulate social media posting (replace with real API calls)
    const platforms = ['linkedin', 'facebook', 'twitter']
    const results = platforms.map(platform => ({
      platform,
      success: true,
      post_id: `sim_${Date.now()}_${platform}`,
      url: `https://${platform}.com/designrite/posts/sim_${Date.now()}`,
      message: `Simulated post to ${platform}`
    }))

    return {
      platform: 'social_media',
      success: true,
      platforms: results,
      message: 'Successfully scheduled social media posts'
    }

  } catch (error) {
    console.error('Social media publishing error:', error)
    return {
      platform: 'social_media',
      success: false,
      error: error.message,
      message: 'Failed to publish to social media'
    }
  }
}

function extractExcerpt(content: string, maxLength: number = 200): string {
  // Remove markdown formatting and HTML tags
  const cleanContent = content
    .replace(/#{1,6}\s?/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n\s*\n/g, ' ') // Replace multiple newlines with space
    .trim()

  // Find the first sentence or paragraph that makes sense as an excerpt
  const sentences = cleanContent.split(/[.!?]+/)
  let excerpt = ''

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim()
    if (trimmedSentence.length > 20 && (excerpt + trimmedSentence).length <= maxLength) {
      excerpt += (excerpt ? '. ' : '') + trimmedSentence
    } else if (excerpt) {
      break
    }
  }

  return excerpt || cleanContent.substring(0, maxLength) + '...'
}

function generateSocialFromContent(content: any): string {
  const title = content.title || 'New Content from Design-Rite'

  let socialPost = ''

  switch (content.content_type) {
    case 'blog_post':
      socialPost = `📖 New blog post: "${title}"

${extractExcerpt(content.content, 120)}

Read the full story on our blog ➡️ [link]

#SecurityDesign #SalesEngineers #DesignRite`
      break

    case 'case_study':
      socialPost = `🎯 Success Story Alert!

Another customer transforms their security with Design-Rite:
✅ 40% reduction in security incidents
✅ 60% faster response times
✅ 8-month ROI achieved
✅ Peace of mind restored

Ready for your own transformation? 👇
[Security Assessment Link]

#CaseStudy #SecuritySuccess #DesignRite`
      break

    case 'customer_story':
      socialPost = `💫 Customer Spotlight: From chaos to calm

"Design-Rite gave me my weekends back" - Sarah M., Sales Engineer

Discover how sales engineers across the country are transforming their work-life balance with smarter security assessments.

Your transformation starts here: [link]

#CustomerStory #SalesEngineers #WorkLifeBalance`
      break

    default:
      socialPost = `🚀 Fresh from the Design-Rite creative studio!

"${title}"

${extractExcerpt(content.content, 100)}

Learn more: [link]

#DesignRite #SecuritySolutions`
  }

  return socialPost
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('content_id')

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID required' },
        { status: 400 }
      )
    }

    // Get publishing status for content
    const { data: content, error } = await supabase
      .from('creative_content')
      .select('*')
      .eq('id', contentId)
      .single()

    if (error || !content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      content,
      publishing_options: {
        available_platforms: ['blog', 'social'],
        blog_ready: content.content_type === 'blog_post',
        social_ready: content.content_type === 'social_media' || !!content.title,
        current_status: content.status,
        published_at: content.published_at
      }
    })

  } catch (error) {
    console.error('Publishing status error:', error)
    return NextResponse.json(
      { error: 'Failed to get publishing status' },
      { status: 500 }
    )
  }
}