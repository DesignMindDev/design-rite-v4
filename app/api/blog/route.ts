import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const BLOG_PATH = path.join(process.cwd(), 'data', 'blog-posts.json')

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedDate: string
  featuredImage: string
  videoUrl: string
  tags: string[]
  published: boolean
}

function loadBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_PATH)) {
    return []
  }

  const data = fs.readFileSync(BLOG_PATH, 'utf8')
  return JSON.parse(data)
}

export async function GET() {
  try {
    const posts = loadBlogPosts()
    // Only return published posts, sorted by date (newest first)
    const publishedPosts = posts
      .filter(post => post.published)
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())

    return NextResponse.json(publishedPosts)
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return NextResponse.json({ error: 'Failed to load blog posts' }, { status: 500 })
  }
}