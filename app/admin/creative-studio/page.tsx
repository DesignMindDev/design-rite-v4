'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Upload, Image as ImageIcon, MessageSquare, Sparkles, FileText, Eye, Download, Trash2, Tag, Send, Bot, User } from 'lucide-react'
import * as auth from '../../lib/auth'

interface Asset {
  id: string
  filename: string
  filePath: string
  fileType: string
  aiAnalysis?: string
  tags: string[]
  uploadedAt: string
  projectId?: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  assetId?: string
}

interface ContentDraft {
  id: string
  type: 'blog' | 'social' | 'script' | 'case-study'
  title: string
  content: string
  assetIds: string[]
  status: 'draft' | 'review' | 'approved'
  createdAt: string
}

export default function CreativeStudioPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [password, setPassword] = useState('')

  // Creative Studio State
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `🎨 Welcome to the AI Creative Studio!

I'm your creative assistant, ready to help you transform your visual assets into compelling stories.

**What I can help with:**
• Analyze uploaded photos and suggest content ideas
• Generate blog posts, case studies, and social media content
• Create scripts for product demos and customer stories
• Develop engaging narratives from installation photos

**Getting Started:**
1. Upload some photos or artwork
2. Let me analyze them and suggest creative directions
3. Chat with me about what story you want to tell
4. I'll help generate the perfect content!

Ready to create something amazing? Upload your first asset! 📸✨`,
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [contentDrafts, setContentDrafts] = useState<ContentDraft[]>([])
  const [activeTab, setActiveTab] = useState<'assets' | 'chat' | 'content'>('assets')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    if (auth.isAuthenticated()) {
      setIsAuthenticated(true)
      loadAssets()
      loadContentDrafts()
    }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleLogin = async () => {
    if (auth.authenticate(password)) {
      setIsAuthenticated(true)
      loadAssets()
      loadContentDrafts()
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    auth.logout()
  }

  const loadAssets = async () => {
    try {
      // For now, we'll simulate loading assets
      // Later this will connect to the real API
      setAssets([])
    } catch (error) {
      console.error('Failed to load assets:', error)
    }
  }

  const loadContentDrafts = async () => {
    try {
      // For now, we'll simulate loading content drafts
      setContentDrafts([])
    } catch (error) {
      console.error('Failed to load content drafts:', error)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    setIsAnalyzing(true)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Create temporary asset object
      const newAsset: Asset = {
        id: `temp_${Date.now()}_${i}`,
        filename: file.name,
        filePath: URL.createObjectURL(file), // Temporary URL for preview
        fileType: file.type,
        tags: [],
        uploadedAt: new Date().toISOString()
      }

      setAssets(prev => [...prev, newAsset])

      // Simulate AI analysis
      setTimeout(() => {
        const analysis = generateAIAnalysis(file.name, file.type)
        setAssets(prev => prev.map(asset =>
          asset.id === newAsset.id
            ? { ...asset, aiAnalysis: analysis.analysis, tags: analysis.tags }
            : asset
        ))

        // Add AI message about the uploaded asset
        const aiMessage: ChatMessage = {
          id: `analysis_${Date.now()}`,
          role: 'assistant',
          content: analysis.chatMessage,
          timestamp: new Date(),
          assetId: newAsset.id
        }
        setChatMessages(prev => [...prev, aiMessage])
      }, 2000)
    }

    setIsAnalyzing(false)
    setActiveTab('chat') // Switch to chat to show AI analysis
  }

  const generateAIAnalysis = (filename: string, fileType: string) => {
    // Simulate AI analysis based on filename and type
    const name = filename.toLowerCase()

    if (name.includes('camera') || name.includes('surveillance')) {
      return {
        analysis: 'Professional security camera equipment with advanced features',
        tags: ['equipment', 'camera', 'surveillance', 'security'],
        chatMessage: `🎥 I can see this appears to be security camera equipment! This could be perfect for:

• **Product showcase blog post** - highlighting technical capabilities
• **Before/after installation story** - showing upgrade benefits
• **Social media content** - "New tech alert!" style posts
• **Customer education content** - explaining camera features

What type of story would you like to tell with this image? I can help you create engaging content that showcases both the technical excellence and real-world benefits!`
      }
    }

    if (name.includes('installation') || name.includes('site') || name.includes('building')) {
      return {
        analysis: 'Installation or site photo showing security system deployment',
        tags: ['installation', 'site', 'project', 'customer'],
        chatMessage: `🏢 This looks like a great installation shot! Perfect for creating:

• **Customer success story** - showcasing the completed project
• **Case study content** - before/after transformation
• **Social proof posts** - "Another satisfied customer!"
• **Portfolio showcase** - demonstrating your expertise

I can help you craft a compelling narrative around this project. What was special about this installation? Any challenges overcome or unique solutions provided?`
      }
    }

    if (name.includes('team') || name.includes('staff') || name.includes('technician')) {
      return {
        analysis: 'Team or staff photo showing professional service delivery',
        tags: ['team', 'staff', 'professional', 'service'],
        chatMessage: `👥 Great team photo! This is perfect for building trust and showcasing your professional service. I can help create:

• **"Meet the Team" blog series** - highlighting expertise and experience
• **Behind-the-scenes content** - showing the human side of security
• **Recruitment content** - attracting quality technicians
• **Customer confidence building** - "You're in good hands"

What's the story behind this team? Any specializations or achievements worth highlighting?`
      }
    }

    // Default analysis
    return {
      analysis: 'Visual asset with creative potential for content generation',
      tags: ['visual', 'content', 'marketing'],
      chatMessage: `📸 I've analyzed your uploaded image! While I need a bit more context to provide specific suggestions, this asset has great potential for:

• **Custom content creation** based on your goals
• **Multi-format storytelling** (blog, social, scripts)
• **Visual storytelling** to engage your audience

Tell me more about this image and what you'd like to accomplish with it. What story do you want to tell?`
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsGenerating(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentMessage)
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, aiMessage])
      setIsGenerating(false)
    }, 2000)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('blog post') || input.includes('blog')) {
      return `📰 Perfect! I'll help you create a compelling blog post. Here's what I suggest:

**Blog Post Structure:**
1. **Engaging headline** that captures attention
2. **Problem/solution narrative** that resonates with customers
3. **Technical details** that showcase expertise
4. **Customer benefits** that drive action
5. **Strong call-to-action** to generate leads

Based on your uploaded assets, I can see several strong angles. Would you like me to:
• Generate 3 different headline options?
• Create a full blog post draft?
• Focus on a specific aspect (technical, customer story, etc.)?

What's your primary goal with this blog post?`
    }

    if (input.includes('social media') || input.includes('social')) {
      return `📱 Great choice! Social media content should be punchy and engaging. For security industry content, I recommend:

**Platform-Specific Approaches:**
• **LinkedIn**: Professional case studies, industry insights
• **Facebook**: Customer stories, behind-the-scenes content
• **Instagram**: Visual before/after, team highlights
• **Twitter**: Quick tips, industry news, company updates

I can create:
✨ **Multiple post variations** for different platforms
✨ **Engaging captions** with relevant hashtags
✨ **Call-to-action suggestions** to drive engagement
✨ **Content series ideas** for ongoing engagement

Which platform are you focusing on, and what's your main message?`
    }

    if (input.includes('case study') || input.includes('customer story')) {
      return `📊 Excellent! Case studies are incredibly powerful for building trust. Here's my approach:

**Winning Case Study Formula:**
1. **The Challenge** - What problem did the customer face?
2. **The Solution** - How did Design-Rite solve it?
3. **The Process** - What made the implementation smooth?
4. **The Results** - Quantifiable benefits and satisfaction
5. **The Testimonial** - Customer words that sell

I can help you:
🎯 **Structure the narrative** for maximum impact
🎯 **Highlight technical excellence** without overwhelming
🎯 **Focus on business benefits** that resonate
🎯 **Create multiple versions** (short/long, technical/business)

What was special about this project? Any specific results or challenges worth highlighting?`
    }

    return `I'd love to help you create amazing content! Based on what you've shared, I can assist with:

🎨 **Content Creation Options:**
• Blog posts that showcase expertise
• Social media content that engages
• Case studies that build trust
• Product demos that educate
• Customer stories that inspire

💡 **Creative Suggestions:**
• Use your uploaded assets as visual anchors
• Focus on customer benefits over features
• Tell stories that humanize security technology
• Create content that establishes thought leadership

What type of content would be most valuable for your goals right now? I'm here to help bring your vision to life! ✨`
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files) {
      handleFileUpload(files)
    }
  }

  if (!isMounted) {
    return <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 max-w-md w-full mx-4">
          <h1 className="text-3xl font-black text-white mb-6 text-center">Creative Studio Login</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-600"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Admin
            </Link>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
                🎨 AI Creative Studio
              </h1>
              <p className="text-gray-400 mt-1">Transform your visuals into compelling stories</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Assets
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 bg-gray-800/30 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'assets'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Assets ({assets.length})
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'chat'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            AI Creative Chat
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'content'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Content Drafts ({contentDrafts.length})
          </button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          multiple
          accept="image/*"
          className="hidden"
        />

        {/* Tab Content */}
        {activeTab === 'assets' && (
          <div className="space-y-6">

            {/* Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-600/30 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-600/60 hover:bg-purple-600/5 transition-all"
            >
              <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload Your Creative Assets</h3>
              <p className="text-gray-400 mb-4">
                Drag and drop images here, or click to browse
              </p>
              <p className="text-sm text-purple-400">
                📸 Photos • 🎨 Artwork • 🏢 Installations • 👥 Team Photos • 📱 Equipment Shots
              </p>
            </div>

            {/* Assets Grid */}
            {assets.length > 0 && (
              <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-6">Your Creative Assets</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {assets.map((asset) => (
                    <div key={asset.id} className="bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700/70 transition-colors">
                      <div className="aspect-square bg-gray-600 rounded mb-2 overflow-hidden">
                        <Image
                          src={asset.filePath}
                          alt={asset.filename}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-white truncate">{asset.filename}</p>
                      {asset.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {asset.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="bg-purple-600/20 text-purple-300 px-1 py-0.5 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {asset.aiAnalysis && (
                        <div className="mt-2">
                          <Sparkles className="w-3 h-3 text-purple-400 inline" />
                          <span className="text-xs text-purple-400 ml-1">AI Analyzed</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  <span className="text-white">AI is analyzing your assets...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 h-[600px] flex flex-col">

            {/* Chat Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-600/30">
              <Bot className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">AI Creative Assistant</h3>
                <p className="text-sm text-gray-400">Ready to help you create amazing content</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-xl ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/60 text-white border border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {message.role === 'assistant' ? (
                        <Bot className="w-4 h-4 mt-0.5 text-purple-400" />
                      ) : (
                        <User className="w-4 h-4 mt-0.5" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-700/60 text-white border border-gray-600/30 max-w-[80%] p-4 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <div className="pt-4 border-t border-gray-600/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about your assets, request content generation, or brainstorm ideas..."
                  className="flex-1 p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isGenerating}
                />
                <button
                  onClick={sendMessage}
                  disabled={!currentMessage.trim() || isGenerating}
                  className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">Content Drafts</h2>

              {contentDrafts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No content drafts yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start chatting with the AI assistant to generate your first piece of content!
                  </p>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Start Creating Content
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {contentDrafts.map((draft) => (
                    <div key={draft.id} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{draft.title}</h4>
                          <p className="text-sm text-gray-400">
                            {draft.type} • {new Date(draft.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          draft.status === 'draft' ? 'bg-yellow-600/20 text-yellow-300' :
                          draft.status === 'review' ? 'bg-blue-600/20 text-blue-300' :
                          'bg-green-600/20 text-green-300'
                        }`}>
                          {draft.status}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3">{draft.content}</p>
                      <div className="flex gap-2">
                        <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors">
                          <Eye className="w-3 h-3 inline mr-1" />
                          Preview
                        </button>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                          Edit
                        </button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                          <Download className="w-3 h-3 inline mr-1" />
                          Export
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}