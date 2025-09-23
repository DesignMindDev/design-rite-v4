'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import UnifiedNavigation from '../components/UnifiedNavigation'
import Footer from '../components/Footer'

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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string>('')

  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const redirectToApp = () => {
    window.location.href = '/waitlist'
  }

  // Get all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort()

  // Filter posts by selected tag
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🎓</span>
          <span className="flex-1 text-center">Design-Rite's Revolutionary AI is launching Q4 2025 - Join the waitlist for early access to security design mastery</span>
          <Link className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30" href="/subscribe">
            Join Waitlist
          </Link>
          <button className="text-white text-lg opacity-70 hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center">×</button>
        </div>
      </div>

      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent"></div>
        <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Design-Rite Blog
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Insights & Updates
          </h1>
          <p className="text-xl text-gray-400 mb-16 leading-relaxed max-w-4xl mx-auto">
            Stay up to date with the latest in AI-powered security design, industry trends, and product updates.
          </p>
        </div>
      </section>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <section className="py-8 bg-black/30">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === ''
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60'
                }`}
              >
                All Posts
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-xl text-gray-400">Loading blog posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-3xl font-bold mb-4">
                {selectedTag ? `No posts found for "${selectedTag}"` : 'No Blog Posts Yet'}
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                {selectedTag
                  ? 'Try selecting a different tag or view all posts.'
                  : 'Check back soon for insights on AI-powered security design and industry updates.'}
              </p>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag('')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  View All Posts
                </button>
              )}
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
                  {post.featuredImage && (
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {post.videoUrl && getYouTubeEmbedUrl(post.videoUrl) && (
                    <div className="aspect-video relative overflow-hidden">
                      <iframe
                        src={getYouTubeEmbedUrl(post.videoUrl) || ''}
                        title={post.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-purple-300 text-xs font-medium">+{post.tags.length - 2} more</span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">{post.title}</h2>

                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {post.excerpt || truncateContent(post.content)}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {post.author}</span>
                      <span>{formatDate(post.publishedDate)}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        Read More
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

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
            <Link href="/contact" className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all">
              Contact Us
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