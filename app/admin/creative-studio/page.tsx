'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Upload, Image as ImageIcon, MessageSquare, Sparkles, FileText, Eye, Download, Trash2, Tag, Send, Bot, User, Search, Globe, TrendingUp, BookOpen, ExternalLink, MapPin, Satellite, Layers } from 'lucide-react'
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

interface SearchResult {
  id: string
  title: string
  snippet: string
  url: string
  source: string
  publishedDate?: string
  relevanceScore: number
  searchProvider: 'perplexity' | 'tavily' | 'google' | 'bing'
}

interface ResearchQuery {
  id: string
  query: string
  category: 'industry-trends' | 'competitive-analysis' | 'technical-research' | 'content-ideas' | 'market-analysis'
  aiProvider: string
  results: SearchResult[]
  synthesis?: string
  createdAt: string
  status: 'searching' | 'analyzing' | 'complete'
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
  const [activeTab, setActiveTab] = useState<'assets' | 'chat' | 'content' | 'research' | 'planner'>('assets')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Research Assistant State
  const [researchQueries, setResearchQueries] = useState<ResearchQuery[]>([])
  const [currentQuery, setCurrentQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ResearchQuery['category']>('industry-trends')
  const [selectedProvider, setSelectedProvider] = useState('anthropic')
  const [isSearching, setIsSearching] = useState(false)
  const [availableProviders, setAvailableProviders] = useState(['anthropic', 'openai', 'google'])

  // Site Planner State
  const [siteAddress, setSiteAddress] = useState('')
  const [isLoadingMap, setIsLoadingMap] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedDeviceType, setSelectedDeviceType] = useState<'camera' | 'sensor' | 'access' | 'network'>('camera')
  const [placedDevices, setPlacedDevices] = useState<Array<{
    id: string
    type: 'camera' | 'sensor' | 'access' | 'network'
    lat: number
    lng: number
    name: string
    specs?: string
  }>>([])
  const [activeLayers, setActiveLayers] = useState<string[]>(['cameras', 'sensors', 'access', 'network'])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Site Planner Functions
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapLoaded) return

    // Get click position relative to the map container
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convert to mock lat/lng (would be real coordinates with Google Maps)
    const lat = 40.7128 + (y / rect.height - 0.5) * 0.01
    const lng = -74.0060 + (x / rect.width - 0.5) * 0.01

    // Generate device name
    const deviceCount = placedDevices.filter(d => d.type === selectedDeviceType).length + 1
    const deviceName = `${selectedDeviceType.charAt(0).toUpperCase() + selectedDeviceType.slice(1)} ${deviceCount}`

    // Add new device
    const newDevice = {
      id: Date.now().toString(),
      type: selectedDeviceType,
      lat,
      lng,
      name: deviceName,
      specs: getDeviceSpecs(selectedDeviceType)
    }

    setPlacedDevices(prev => [...prev, newDevice])
  }

  const getDeviceSpecs = (deviceType: string): string => {
    const specs = {
      camera: '4K Ultra HD, Night Vision, 30m Range',
      sensor: 'PIR Motion Detection, 12m Range, Pet Immune',
      access: 'RFID/PIN, Biometric, Network Connected',
      network: 'PoE Switch, 24-Port, Managed, 1Gbps'
    }
    return specs[deviceType as keyof typeof specs] || 'Standard Device'
  }

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

  const performResearch = async () => {
    if (!currentQuery.trim()) return

    setIsSearching(true)

    const newQuery: ResearchQuery = {
      id: `research_${Date.now()}`,
      query: currentQuery,
      category: selectedCategory,
      aiProvider: selectedProvider,
      results: [],
      createdAt: new Date().toISOString(),
      status: 'searching'
    }

    setResearchQueries(prev => [newQuery, ...prev])
    setCurrentQuery('')

    // Simulate external search API call
    setTimeout(async () => {
      const mockResults: SearchResult[] = generateMockSearchResults(currentQuery, selectedCategory)

      // Update with search results
      setResearchQueries(prev => prev.map(q =>
        q.id === newQuery.id
          ? { ...q, results: mockResults, status: 'analyzing' }
          : q
      ))

      // Simulate AI synthesis
      setTimeout(() => {
        const synthesis = generateAISynthesis(mockResults, selectedCategory, selectedProvider)
        setResearchQueries(prev => prev.map(q =>
          q.id === newQuery.id
            ? { ...q, synthesis, status: 'complete' }
            : q
        ))
        setIsSearching(false)
      }, 3000)
    }, 2000)
  }

  const generateMockSearchResults = (query: string, category: string): SearchResult[] => {
    const baseResults = [
      {
        id: '1',
        title: 'AI Revolution in Physical Security: 2024 Trends Report',
        snippet: 'Comprehensive analysis of how artificial intelligence is transforming physical security systems, including smart cameras, access control, and predictive analytics.',
        url: 'https://securityindustry.org/ai-trends-2024',
        source: 'Security Industry Association',
        publishedDate: '2024-01-15',
        relevanceScore: 0.95,
        searchProvider: 'perplexity' as const
      },
      {
        id: '2',
        title: 'Smart Building Security Integration: Best Practices',
        snippet: 'Expert insights on integrating security systems with smart building technologies, IoT sensors, and centralized management platforms.',
        url: 'https://smartbuildings.com/security-integration',
        source: 'Smart Buildings Magazine',
        publishedDate: '2024-01-10',
        relevanceScore: 0.88,
        searchProvider: 'google' as const
      },
      {
        id: '3',
        title: 'Competitive Analysis: Top Security System Providers 2024',
        snippet: 'Market analysis comparing leading security system providers, their technology offerings, pricing strategies, and market positioning.',
        url: 'https://marketresearch.com/security-providers-2024',
        source: 'Market Research Inc',
        publishedDate: '2024-01-08',
        relevanceScore: 0.82,
        searchProvider: 'tavily' as const
      }
    ]

    // Customize results based on category
    if (category === 'competitive-analysis') {
      return baseResults.map(r => ({
        ...r,
        title: r.title.replace('AI Revolution', 'Competitive Landscape'),
        snippet: r.snippet.replace('artificial intelligence', 'competitor strategies')
      }))
    }

    if (category === 'technical-research') {
      return baseResults.map(r => ({
        ...r,
        title: r.title.replace('Trends Report', 'Technical Specifications'),
        snippet: r.snippet.replace('transforming', 'technical implementation of')
      }))
    }

    return baseResults
  }

  const generateAISynthesis = (results: SearchResult[], category: string, provider: string): string => {
    const providerStyles = {
      anthropic: `🧠 **Claude Analysis** | Based on ${results.length} sources, here's what I found:

**Key Insights:**
• AI-powered security systems are becoming mainstream, with 67% of enterprises planning implementation
• Smart camera technology now includes real-time behavioral analysis and threat prediction
• Integration with IoT ecosystems is creating comprehensive security orchestration platforms

**Strategic Implications for Design-Rite:**
• **Opportunity**: Position as AI-native security design platform
• **Competitive Edge**: Emphasize intelligent system design vs. traditional approaches
• **Market Trend**: Customers increasingly expect AI-powered recommendations

**Content Opportunities:**
• "Why Traditional Security Design is Dead: The AI Revolution"
• Customer case studies featuring AI-enhanced installations
• Technical deep-dives on intelligent camera placement algorithms

**Next Steps:**
Ready to turn these insights into compelling content? I can help you create targeted materials that position Design-Rite at the forefront of this trend!`,

      openai: `✨ **GPT Creative Synthesis** | Transforming research into creative opportunities:

**Narrative Threads Discovered:**
• The "Security Renaissance" - old systems being reimagined with AI
• "From Reactive to Predictive" - shift in security thinking
• "The Connected Building" - everything talks to everything

**Content Angles:**
🎯 **Blog Series**: "The Future is Now: AI Security Stories"
🎯 **Social Campaign**: Before/After AI implementation showcases
🎯 **Case Studies**: "How [Company] Went from Blind Spots to Total Awareness"

**Messaging Framework:**
- **Problem**: Traditional security = playing catch-up with threats
- **Solution**: AI-powered design = staying ahead of threats
- **Proof**: Real customer transformations and ROI data

**Creative Hooks:**
• "What if your security system could think?"
• "The day our cameras started predicting break-ins"
• "From 20/20 hindsight to 20/20 foresight"

Ready to craft some breakthrough content around these themes?`,

      google: `📊 **Bard Research Summary** | Data-driven insights from multiple sources:

**Market Data Points:**
• 73% increase in AI security system deployments (2023-2024)
• $2.8B projected market size by 2025
• ROI averages 340% within 18 months of implementation

**Technology Trends:**
• Edge AI processing reducing cloud dependencies
• Behavioral analytics becoming standard in enterprise
• Integration APIs enabling security ecosystem orchestration

**Competitive Landscape:**
• Traditional players adding AI as feature bolt-ons
• New entrants building AI-first platforms
• Design-Rite opportunity: AI-powered design process differentiation

**Customer Pain Points Identified:**
• Complexity of integrating multiple AI-enabled systems
• Lack of expertise in optimal AI camera/sensor placement
• Difficulty quantifying AI security ROI before implementation

**Actionable Intelligence:**
Focus content on solving the "AI integration complexity" problem. Position Design-Rite as the expert guide that makes AI security simple and effective.`
    }

    return providerStyles[provider as keyof typeof providerStyles] || providerStyles.anthropic
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
          <button
            onClick={() => setActiveTab('research')}
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'research'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            Research Assistant ({researchQueries.length})
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'planner'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Site Planner ({placedDevices.length})
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

        {activeTab === 'research' && (
          <div className="space-y-6">

            {/* Research Control Panel */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-6 h-6 text-purple-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Research Assistant</h2>
                  <p className="text-gray-400">Search external sources and get AI-powered insights</p>
                </div>
              </div>

              {/* Search Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Research Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as ResearchQuery['category'])}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="industry-trends">🔥 Industry Trends</option>
                      <option value="competitive-analysis">🏢 Competitive Analysis</option>
                      <option value="technical-research">⚙️ Technical Research</option>
                      <option value="content-ideas">💡 Content Ideas</option>
                      <option value="market-analysis">📊 Market Analysis</option>
                    </select>
                  </div>

                  {/* AI Provider Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">AI Analysis Provider</label>
                    <select
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="anthropic">🧠 Claude (Deep Analysis)</option>
                      <option value="openai">✨ GPT (Creative Synthesis)</option>
                      <option value="google">📊 Bard (Data-Driven)</option>
                    </select>
                  </div>
                </div>

                {/* Search Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && performResearch()}
                    placeholder="What would you like to research? (e.g., 'latest AI camera technologies', 'competitor pricing strategies')"
                    className="flex-1 p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={isSearching}
                  />
                  <button
                    onClick={performResearch}
                    disabled={!currentQuery.trim() || isSearching}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Researching...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        Research
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Search Suggestions */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-400">Quick searches:</span>
                  {[
                    'AI security trends 2024',
                    'smart building integration',
                    'competitor analysis',
                    'IoT sensor technologies',
                    'cybersecurity in physical access'
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setCurrentQuery(suggestion)}
                      className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded hover:bg-purple-600/30 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Research Results */}
            <div className="space-y-4">
              {researchQueries.map((query) => (
                <div key={query.id} className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">

                  {/* Query Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{query.query}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {query.category.replace('-', ' ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          {query.aiProvider}
                        </span>
                        <span>{new Date(query.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      query.status === 'searching' ? 'bg-yellow-600/20 text-yellow-300' :
                      query.status === 'analyzing' ? 'bg-blue-600/20 text-blue-300' :
                      'bg-green-600/20 text-green-300'
                    }`}>
                      {query.status === 'searching' && '🔍 Searching...'}
                      {query.status === 'analyzing' && '🧠 Analyzing...'}
                      {query.status === 'complete' && '✅ Complete'}
                    </div>
                  </div>

                  {/* Search Results */}
                  {query.results.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        External Sources ({query.results.length})
                      </h4>
                      <div className="space-y-2">
                        {query.results.map((result) => (
                          <div key={result.id} className="bg-gray-700/30 rounded-lg p-3 hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="text-white font-medium mb-1">{result.title}</h5>
                                <p className="text-gray-300 text-sm mb-2">{result.snippet}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                  <span>{result.source}</span>
                                  <span>•</span>
                                  <span>{result.publishedDate}</span>
                                  <span>•</span>
                                  <span className={`px-2 py-0.5 rounded ${
                                    result.searchProvider === 'perplexity' ? 'bg-orange-600/20 text-orange-300' :
                                    result.searchProvider === 'google' ? 'bg-blue-600/20 text-blue-300' :
                                    result.searchProvider === 'tavily' ? 'bg-green-600/20 text-green-300' :
                                    'bg-purple-600/20 text-purple-300'
                                  }`}>
                                    {result.searchProvider}
                                  </span>
                                </div>
                              </div>
                              <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 transition-colors ml-3"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Synthesis */}
                  {query.synthesis && (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        AI-Powered Synthesis
                      </h4>
                      <div className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                        {query.synthesis}
                      </div>
                    </div>
                  )}

                  {query.status === 'searching' && (
                    <div className="bg-gray-700/30 rounded-lg p-4 flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-300">Searching external sources...</span>
                    </div>
                  )}

                  {query.status === 'analyzing' && (
                    <div className="bg-gray-700/30 rounded-lg p-4 flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                      <span className="text-gray-300">AI is analyzing research findings...</span>
                    </div>
                  )}
                </div>
              ))}

              {researchQueries.length === 0 && (
                <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-12 text-center">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No research queries yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start exploring external content to enhance your creative projects!
                  </p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>💡 <strong>Pro tip:</strong> Different AI providers excel at different analysis types:</p>
                    <p>🧠 <strong>Claude:</strong> Deep analysis, strategic insights, detailed summaries</p>
                    <p>✨ <strong>GPT:</strong> Creative angles, storytelling opportunities, content ideas</p>
                    <p>📊 <strong>Bard:</strong> Data-driven insights, market trends, technical specifications</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Site Planner Content */}
        {activeTab === 'planner' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-purple-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Site Planner</h2>
                <p className="text-gray-400">Satellite view with security device planning</p>
              </div>
            </div>

            {/* Address Input Section */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Site Location</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder="Enter site address..."
                  className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setIsLoadingMap(true)
                    // Simulate map loading
                    setTimeout(() => {
                      setIsLoadingMap(false)
                      setMapLoaded(true)
                    }, 1500)
                  }}
                  disabled={!siteAddress || isLoadingMap}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoadingMap ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Satellite className="w-4 h-4" />
                      Load Satellite View
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Technology Layer Controls */}
            {mapLoaded && (
              <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Technology Layers
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'cameras', name: 'Cameras', icon: '📹', color: 'bg-blue-600' },
                    { id: 'sensors', name: 'Sensors', icon: '🔍', color: 'bg-green-600' },
                    { id: 'access', name: 'Access Control', icon: '🚪', color: 'bg-orange-600' },
                    { id: 'network', name: 'Network', icon: '📡', color: 'bg-purple-600' }
                  ].map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => {
                        setActiveLayers(prev =>
                          prev.includes(layer.id)
                            ? prev.filter(l => l !== layer.id)
                            : [...prev, layer.id]
                        )
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        activeLayers.includes(layer.id)
                          ? `${layer.color} border-white text-white`
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-2xl mb-2">{layer.icon}</div>
                      <div className="text-sm font-medium">{layer.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Device Placement Tools */}
            {mapLoaded && (
              <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Device Placement</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { type: 'camera', name: 'Security Camera', icon: '📹' },
                    { type: 'sensor', name: 'Motion Sensor', icon: '🔍' },
                    { type: 'access', name: 'Access Point', icon: '🚪' },
                    { type: 'network', name: 'Network Hub', icon: '📡' }
                  ].map((device) => (
                    <button
                      key={device.type}
                      onClick={() => setSelectedDeviceType(device.type as any)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedDeviceType === device.type
                          ? 'bg-purple-600 border-white text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-2xl mb-2">{device.icon}</div>
                      <div className="text-sm font-medium">{device.name}</div>
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">
                  Select a device type, then click on the map to place it at that location.
                </p>
              </div>
            )}

            {/* Satellite Map Placeholder */}
            {mapLoaded ? (
              <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Satellite View: {siteAddress}
                </h3>
                <div
                  className="bg-gray-900 rounded-lg aspect-video relative border-2 border-dashed border-gray-600 cursor-crosshair overflow-hidden"
                  onClick={handleMapClick}
                >
                  {/* Simulated Satellite Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-gray-800 to-blue-900/20"></div>

                  {/* Grid overlay for satellite view feel */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Placed Devices on Map */}
                  {placedDevices.map((device) => {
                    const x = ((device.lng + 74.0060) / 0.01 + 0.5) * 100; // Convert back to percentage
                    const y = ((device.lat - 40.7128) / 0.01 + 0.5) * 100;

                    return (
                      <div
                        key={device.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                          activeLayers.includes(device.type + 's') ? 'visible' : 'hidden'
                        }`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <div className="group">
                          <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs ${
                            device.type === 'camera' ? 'bg-blue-600' :
                            device.type === 'sensor' ? 'bg-green-600' :
                            device.type === 'access' ? 'bg-orange-600' :
                            'bg-purple-600'
                          }`}>
                            {device.type === 'camera' && '📹'}
                            {device.type === 'sensor' && '🔍'}
                            {device.type === 'access' && '🚪'}
                            {device.type === 'network' && '📡'}
                          </div>

                          {/* Device tooltip */}
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="font-medium">{device.name}</div>
                            <div className="text-gray-400">{device.specs}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Center info when no devices */}
                  {placedDevices.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Satellite className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-gray-300 mb-2">Interactive Satellite Map</h4>
                        <p className="text-gray-400 mb-4">
                          Click anywhere to place {selectedDeviceType} devices
                        </p>
                        <div className="bg-gray-800/80 rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-sm text-gray-300 mb-2">
                            🗺️ Simulated satellite view
                          </p>
                          <p className="text-sm text-gray-300 mb-2">
                            📍 Click to place {selectedDeviceType} devices
                          </p>
                          <p className="text-sm text-gray-300">
                            🔄 Use layer controls to filter device types
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Map coordinates indicator */}
                  <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs px-2 py-1 rounded">
                    {siteAddress || 'Satellite View'}
                  </div>

                  {/* Selected device type indicator */}
                  <div className="absolute top-2 right-2 bg-purple-600/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <span>Placing:</span>
                    <span className="font-medium">
                      {selectedDeviceType === 'camera' && '📹 Camera'}
                      {selectedDeviceType === 'sensor' && '🔍 Sensor'}
                      {selectedDeviceType === 'access' && '🚪 Access'}
                      {selectedDeviceType === 'network' && '📡 Network'}
                    </span>
                  </div>
                </div>

                {/* Placed Devices List */}
                {placedDevices.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-white mb-3">Placed Devices ({placedDevices.length})</h4>
                    <div className="space-y-2">
                      {placedDevices.map((device) => (
                        <div key={device.id} className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">
                              {device.type === 'camera' && '📹'}
                              {device.type === 'sensor' && '🔍'}
                              {device.type === 'access' && '🚪'}
                              {device.type === 'network' && '📡'}
                            </span>
                            <div>
                              <p className="text-white font-medium">{device.name}</p>
                              <p className="text-gray-400 text-sm">{device.specs}</p>
                              <p className="text-gray-500 text-xs">
                                Lat: {device.lat.toFixed(6)}, Lng: {device.lng.toFixed(6)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setPlacedDevices(prev => prev.filter(d => d.id !== device.id))
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Ready to Plan Your Site</h3>
                <p className="text-gray-400 mb-6">
                  Enter a site address above to load the satellite view and start planning your security installation.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>🛰️ <strong>High-resolution satellite imagery</strong> for precise planning</p>
                  <p>📍 <strong>Drag-and-drop device placement</strong> with GPS coordinates</p>
                  <p>🔧 <strong>Technology-specific layers</strong> for organized planning</p>
                  <p>📊 <strong>Export to assessment engine</strong> for automated proposals</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}