'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import UnifiedNavigation from '../../components/UnifiedNavigation'
import Footer from '../../components/Footer'

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

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null

  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/ |.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadBlogPost(params.id as string)
    }
  }, [params.id])

  const loadBlogPost = async (postId: string) => {
    try {
      // Load all posts and find the specific one
      const response = await fetch('/api/blog')
      if (response.ok) {
        const posts = await response.json()
        const foundPost = posts.find((p: BlogPost) => p.id === postId)

        if (foundPost) {
          setPost(foundPost)

          // Get related posts (posts with similar tags, excluding current post)
          const related = posts
            .filter((p: BlogPost) =>
              p.id !== postId &&
              p.tags.some(tag => foundPost.tags.includes(tag))
            )
            .slice(0, 3)
          setRelatedPosts(related)
        } else {
          setNotFound(true)
        }
      }
    } catch (error) {
      console.error('Failed to load blog post:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const redirectToApp = () => {
    window.location.href = '/waitlist'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content: string) => {
    // Basic HTML rendering - you might want to use a proper markdown/HTML renderer
    return content.replace(/\n/g, '<br />')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
        <UnifiedNavigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-xl text-gray-400">Loading blog post...</p>
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
        <UnifiedNavigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-xl text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/blog"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      <UnifiedNavigation />

      {/* Breadcrumb */}
      <div className="pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-8">
          <nav className="flex items-center text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-500">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="pb-16">
        <div className="max-w-4xl mx-auto px-8">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-600/30 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-400 text-lg mb-8">
              <span>By <span className="font-semibold text-white">{post.author}</span></span>
              <span className="mx-4">•</span>
              <span>{formatDate(post.publishedDate)}</span>
            </div>

            {post.excerpt && (
              <p className="text-xl text-gray-300 leading-relaxed mb-8 font-medium">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Featured Media */}
          {post.featuredImage && (
            <div className="mb-8">
              <div className="aspect-video relative overflow-hidden rounded-xl">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {post.videoUrl && getYouTubeEmbedUrl(post.videoUrl) && (
            <div className="mb-8">
              <div className="aspect-video relative overflow-hidden rounded-xl">
                <iframe
                  src={getYouTubeEmbedUrl(post.videoUrl) || ''}
                  title={post.title}
                  className="w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="bg-gray-800/30 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8">
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300 prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-black/30">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Related Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all"
                >
                  {relatedPost.featuredImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      {relatedPost.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                    <div className="text-xs text-gray-500">
                      By {relatedPost.author} • {formatDate(relatedPost.publishedDate)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600/10 to-purple-700/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Ready to Transform Your Security Design?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join our waitlist for early access to the most advanced AI-powered security design platform launching Q4 2025.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={redirectToApp} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all">
              Join Waitlist - Free Early Access
            </button>
            <Link href="/blog" className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all">
              Back to Blog
            </Link>
          </div>
        </div>
      </section>

      <Footer redirectToApp={redirectToApp} />

      {/* Chat Button */}
      <div className="fixed bottom-5 right-5 z-[999999]">
        <button className="w-15 h-15 bg-purple-600 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all">
          <div className="text-white text-2xl font-bold">💬</div>
        </button>
      </div>
    </div>
  )
}