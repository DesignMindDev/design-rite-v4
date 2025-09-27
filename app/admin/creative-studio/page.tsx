'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Upload, Image as ImageIcon, MessageSquare, Sparkles, FileText, Eye, Download, Trash2, Tag, Send, Bot, User, Search, Globe, TrendingUp, BookOpen, ExternalLink, MapPin, Satellite, Layers, PenTool, Square, Circle, Type, Move, Ruler, Grid, Save } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'assets' | 'chat' | 'content' | 'research' | 'planner' | 'designer'>('assets')
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
  const [activeLayers, setActiveLayers] = useState<string[]>([
    'security-cameras',
    'detection-sensors',
    'access-control',
    'intercoms',
    'network-infrastructure',
    'fire-safety'
  ])

  // Floor Plan Designer State
  const [uploadedPDF, setUploadedPDF] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isBlankCanvas, setIsBlankCanvas] = useState(false)
  const [selectedTool, setSelectedTool] = useState<'pen' | 'rectangle' | 'circle' | 'text' | 'move' | 'device'>('pen')
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawings, setDrawings] = useState<Array<{
    id: string
    type: 'pen' | 'rectangle' | 'circle' | 'text' | 'device'
    points?: number[]
    x?: number
    y?: number
    width?: number
    height?: number
    text?: string
    deviceType?: string
    color: string
    strokeWidth: number
  }>>([])
  const [currentColor, setCurrentColor] = useState('#ff0000')
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState(2)

  // Undo/Redo functionality
  const [drawingHistory, setDrawingHistory] = useState<Array<Array<any>>>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [showDeviceTree, setShowDeviceTree] = useState(false)
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 20, y: 100 })
  const [selectedDeviceCategory, setSelectedDeviceCategory] = useState<string | null>(null)

  // Touch and gesture optimization for iPad Pro
  const [canvasScale, setCanvasScale] = useState(1)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 })
  const [isMultiTouch, setIsMultiTouch] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Low Voltage Device Library
  const deviceLibrary = {
    'Security Cameras': {
      icon: '📹',
      color: '#3B82F6',
      devices: [
        { id: 'cam_4k', name: '4K Ultra HD Camera', icon: '🔴', specs: '4K@30fps, Night Vision, 100ft IR' },
        { id: 'cam_ptz', name: 'PTZ Camera', icon: '🔄', specs: '360° Pan/Tilt, 30x Zoom, Auto-Track' },
        { id: 'cam_bullet', name: 'Bullet Camera', icon: '📹', specs: '1080p, Weatherproof IP67, WDR' },
        { id: 'cam_dome', name: 'Dome Camera', icon: '⚪', specs: 'Vandal Resistant, 180° View, IR Cut' },
        { id: 'cam_thermal', name: 'Thermal Camera', icon: '🌡️', specs: 'Heat Detection, 1000ft Range, Analytics' }
      ]
    },
    'Detection Sensors': {
      icon: '🔍',
      color: '#10B981',
      devices: [
        { id: 'pir_motion', name: 'PIR Motion Sensor', icon: '👋', specs: '40ft Range, Pet Immune, Dual Tech' },
        { id: 'glass_break', name: 'Glass Break Sensor', icon: '💥', specs: '25ft Radius, Audio Detection, Wireless' },
        { id: 'smoke_det', name: 'Smoke Detector', icon: '💨', specs: 'Photoelectric, Interconnected, Battery Backup' },
        { id: 'door_mag', name: 'Door/Window Contact', icon: '🚪', specs: 'Magnetic, Wireless, Tamper Detection' },
        { id: 'beam_break', name: 'Beam Break Sensor', icon: '📡', specs: '500ft Range, Dual Beam, Weather Resistant' }
      ]
    },
    'Access Control': {
      icon: '🚪',
      color: '#F59E0B',
      devices: [
        { id: 'card_reader', name: 'Card Reader', icon: '💳', specs: '13.56MHz, Proximity, Multi-Format' },
        { id: 'biometric', name: 'Biometric Scanner', icon: '👆', specs: 'Fingerprint, 1000 Users, IP65' },
        { id: 'keypad', name: 'Keypad', icon: '🔢', specs: '6-Digit Code, Backlit, Weather Resistant' },
        { id: 'electric_lock', name: 'Electric Lock', icon: '🔒', specs: '12/24VDC, Fail Safe/Secure, 1200lbs' },
        { id: 'exit_button', name: 'Exit Button', icon: '🚶', specs: 'Push to Exit, NO/NC, Vandal Resistant' }
      ]
    },
    'Intercoms': {
      icon: '📞',
      color: '#8B5CF6',
      devices: [
        { id: 'video_intercom', name: 'Video Intercom', icon: '📺', specs: '7" Display, 2-Way Audio, Door Release' },
        { id: 'audio_intercom', name: 'Audio Intercom', icon: '🔊', specs: 'Hands-Free, Weather Resistant, PoE' },
        { id: 'call_station', name: 'Call Station', icon: '📱', specs: 'Directory, Speed Dial, Stainless Steel' }
      ]
    },
    'Network Infrastructure': {
      icon: '📡',
      color: '#6366F1',
      devices: [
        { id: 'poe_switch', name: 'PoE Switch', icon: '🔌', specs: '24-Port, 802.3at+, Managed, Rack Mount' },
        { id: 'wireless_ap', name: 'Wireless Access Point', icon: '📶', specs: 'Wi-Fi 6, 2.4/5GHz, PoE+, Indoor/Outdoor' },
        { id: 'nvr', name: 'Network Video Recorder', icon: '💾', specs: '32CH, 4K Recording, 8TB Storage, RAID' },
        { id: 'fiber_convert', name: 'Fiber Converter', icon: '🌐', specs: 'Copper to Fiber, SFP+, Gigabit, DIN Rail' }
      ]
    },
    'Fire Safety': {
      icon: '🔥',
      color: '#EF4444',
      devices: [
        { id: 'fire_panel', name: 'Fire Alarm Panel', icon: '🚨', specs: 'Addressable, 250 Points, Networking' },
        { id: 'pull_station', name: 'Manual Pull Station', icon: '🆘', specs: 'Dual Action, Weather Resistant, ADA' },
        { id: 'horn_strobe', name: 'Horn/Strobe', icon: '🔊', specs: '110dB, Multi-Candela, Weatherproof' },
        { id: 'heat_detector', name: 'Heat Detector', icon: '🌡️', specs: '135°F Fixed, Rate of Rise, Wireless' }
      ]
    }
  }

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

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all drawings
    drawings.forEach(drawing => {
      ctx.strokeStyle = drawing.color
      ctx.lineWidth = drawing.strokeWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (drawing.type === 'pen' && drawing.points && drawing.points.length >= 4) {
        ctx.beginPath()
        ctx.moveTo(drawing.points[0], drawing.points[1])

        for (let i = 2; i < drawing.points.length; i += 2) {
          ctx.lineTo(drawing.points[i], drawing.points[i + 1])
        }

        ctx.stroke()
      } else if (drawing.type === 'device' && drawing.x !== undefined && drawing.y !== undefined) {
        // Check if this device's layer is active
        const deviceCategory = (drawing as any).category
        const layerKey = deviceCategory ? deviceCategory.toLowerCase().replace(/\s+/g, '-') : ''

        if (!activeLayers.includes(layerKey)) {
          return // Skip rendering if layer is not active
        }

        // Render device as a rounded rectangle with icon and label
        const deviceX = drawing.x
        const deviceY = drawing.y
        const deviceWidth = drawing.width || 40
        const deviceHeight = drawing.height || 40

        // Draw device background
        ctx.fillStyle = drawing.color || '#3B82F6'
        ctx.globalAlpha = 0.2
        ctx.beginPath()
        ctx.roundRect(deviceX - deviceWidth/2, deviceY - deviceHeight/2, deviceWidth, deviceHeight, 8)
        ctx.fill()

        // Draw device border
        ctx.globalAlpha = 1
        ctx.strokeStyle = drawing.color || '#3B82F6'
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw device icon (simplified text rendering)
        ctx.fillStyle = drawing.color || '#3B82F6'
        ctx.font = '20px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const deviceIcon = (drawing as any).deviceIcon || '📹'
        ctx.fillText(deviceIcon, deviceX, deviceY)

        // Draw device label below
        ctx.font = '10px Arial'
        ctx.fillStyle = '#333'
        const deviceName = (drawing as any).deviceName || 'Device'
        const truncatedName = deviceName.length > 12 ? deviceName.substring(0, 12) + '...' : deviceName
        ctx.fillText(truncatedName, deviceX, deviceY + deviceHeight/2 + 12)

        // Reset globalAlpha
        ctx.globalAlpha = 1
      }
    })
  }, [drawings, activeLayers])

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

    try {
      // Send to real AI provider API
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          provider: selectedProvider,
          chatHistory: chatMessages.slice(-10) // Send last 10 messages for context
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }

      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI Chat Error:', error)
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please check your AI provider settings and try again.',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
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

  // Canvas-specific drag and drop handlers for device placement
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()

    try {
      const deviceData = JSON.parse(e.dataTransfer.getData('application/json'))

      if (deviceData.type === 'device') {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Add device to drawings as a placed element
        const newDevice = {
          id: Date.now().toString(),
          type: 'device' as const,
          x,
          y,
          width: 40,
          height: 40,
          deviceType: deviceData.deviceId,
          deviceName: deviceData.deviceName,
          deviceIcon: deviceData.deviceIcon,
          deviceSpecs: deviceData.deviceSpecs,
          categoryColor: deviceData.categoryColor,
          category: deviceData.category,
          color: deviceData.categoryColor,
          strokeWidth: 2
        }

        const newDrawings = [...drawings, newDevice]
        setDrawings(newDrawings)
        saveToHistory(newDrawings)

        // Also add to placed devices for layer management
        const placedDevice = {
          id: newDevice.id,
          type: deviceData.deviceId,
          lat: y, // Using canvas coordinates as lat/lng equivalent
          lng: x,
          name: deviceData.deviceName,
          specs: deviceData.deviceSpecs
        }

        setPlacedDevices(prev => [...prev, placedDevice])
      }
    } catch (error) {
      console.error('Error parsing dropped device data:', error)
    }
  }

  // Touch event handlers for iPad Pro optimization
  const getEventPosition = (e: TouchEvent | MouseEvent) => {
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
    } else if ('clientX' in e) {
      return {
        x: e.clientX,
        y: e.clientY
      }
    }
    return { x: 0, y: 0 }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()

    if (e.touches.length === 2) {
      // Two finger gesture - prepare for pinch/zoom or pan
      setIsMultiTouch(true)
      setIsPanning(true)
      setLastPanPosition({
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      })
    } else if (e.touches.length === 1 && selectedTool === 'pen') {
      // Single touch drawing
      setIsDrawing(true)
      const rect = e.currentTarget.getBoundingClientRect()
      const touch = e.touches[0]
      const x = (touch.clientX - rect.left - canvasOffset.x) / canvasScale
      const y = (touch.clientY - rect.top - canvasOffset.y) / canvasScale

      const newDrawing = {
        id: Date.now().toString(),
        type: 'pen' as const,
        points: [x, y],
        color: currentColor,
        strokeWidth: currentStrokeWidth
      }
      setDrawings(prev => [...prev, newDrawing])
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()

    if (e.touches.length === 2 && isMultiTouch) {
      // Handle pinch-to-zoom and two-finger pan
      const currentDistance = Math.sqrt(
        Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) +
        Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)
      )

      // Pan with two fingers
      const currentCenter = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2
      }

      if (isPanning) {
        const deltaX = currentCenter.x - lastPanPosition.x
        const deltaY = currentCenter.y - lastPanPosition.y

        setCanvasOffset(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }))

        setLastPanPosition(currentCenter)
      }
    } else if (e.touches.length === 1 && isDrawing && selectedTool === 'pen') {
      // Continue drawing with single touch
      const rect = e.currentTarget.getBoundingClientRect()
      const touch = e.touches[0]
      const x = (touch.clientX - rect.left - canvasOffset.x) / canvasScale
      const y = (touch.clientY - rect.top - canvasOffset.y) / canvasScale

      setDrawings(prev => {
        const newDrawings = [...prev]
        const lastDrawing = newDrawings[newDrawings.length - 1]
        if (lastDrawing && lastDrawing.points) {
          lastDrawing.points.push(x, y)
        }
        return newDrawings
      })
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()

    if (e.touches.length === 0) {
      // All touches ended
      if (isDrawing) {
        saveToHistory(drawings)
      }
      setIsDrawing(false)
      setIsPanning(false)
      setIsMultiTouch(false)
    } else if (e.touches.length === 1 && isMultiTouch) {
      // Went from multi-touch to single touch
      setIsMultiTouch(false)
      setIsPanning(false)
    }
  }

  // Undo/Redo functions
  const saveToHistory = (newDrawings: any[]) => {
    const newHistory = drawingHistory.slice(0, historyIndex + 1)
    newHistory.push([...newDrawings])
    setDrawingHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setDrawings([...drawingHistory[newIndex]])
    }
  }

  const redo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setDrawings([...drawingHistory[newIndex]])
    }
  }

  const clearCanvas = () => {
    const newDrawings: any[] = []
    setDrawings(newDrawings)
    saveToHistory(newDrawings)
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
          <button
            onClick={() => setActiveTab('designer')}
            className={`flex items-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'designer'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <PenTool className="w-4 h-4" />
            Floor Plan Designer ({drawings.length})
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

        {/* Floor Plan Designer Content */}
        {activeTab === 'designer' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <PenTool className="w-6 h-6 text-purple-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Floor Plan Designer</h2>
                <p className="text-gray-400">Upload PDFs and create annotated floor plans</p>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Start Your Design</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setIsBlankCanvas(false)
                    fileInputRef.current?.click()
                  }}
                  className="p-6 border-2 border-dashed border-gray-600 hover:border-purple-500 rounded-lg transition-colors group"
                >
                  <Upload className="w-12 h-12 text-gray-400 group-hover:text-purple-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">Upload Floor Plan</h4>
                  <p className="text-gray-400 text-sm">
                    Upload existing PDFs, blueprints, or floor plans to annotate
                  </p>
                </button>
                <button
                  onClick={() => {
                    setIsBlankCanvas(true)
                    setUploadedPDF(null)
                    setPdfUrl(null)
                  }}
                  className={`p-6 border-2 rounded-lg transition-colors group ${
                    isBlankCanvas
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-gray-600 hover:border-purple-500'
                  }`}
                >
                  <Grid className="w-12 h-12 text-gray-400 group-hover:text-purple-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">Blank Canvas</h4>
                  <p className="text-gray-400 text-sm">
                    Start from scratch with a blank grid canvas for new designs
                  </p>
                </button>
              </div>
            </div>

            {/* Mobile-First Control Panel */}
            {(uploadedPDF || isBlankCanvas) && (
              <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <PenTool className="w-5 h-5" />
                    CAD Tools
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowFloatingToolbar(!showFloatingToolbar)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        showFloatingToolbar
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      🎯 Floating Tools
                    </button>
                    <button
                      onClick={() => setShowDeviceTree(!showDeviceTree)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        showDeviceTree
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      📚 Device Library
                    </button>
                  </div>
                </div>

                {/* iPad Pro Zoom & Pan Controls */}
                <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    🔍 Touch Controls
                  </h4>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCanvasScale(prev => Math.max(0.1, prev - 0.2))}
                        className="w-10 h-10 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center justify-center text-lg font-bold transition-all touch-manipulation"
                      >
                        −
                      </button>
                      <div className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300 min-w-[60px] text-center">
                        {Math.round(canvasScale * 100)}%
                      </div>
                      <button
                        onClick={() => setCanvasScale(prev => Math.min(3, prev + 0.2))}
                        className="w-10 h-10 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center justify-center text-lg font-bold transition-all touch-manipulation"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCanvasScale(1)
                          setCanvasOffset({ x: 0, y: 0 })
                        }}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded text-xs hover:bg-blue-600/40 transition-all touch-manipulation"
                      >
                        Reset View
                      </button>
                      <button
                        onClick={() => setCanvasScale(0.5)}
                        className="px-3 py-1 bg-green-600/20 text-green-400 rounded text-xs hover:bg-green-600/40 transition-all touch-manipulation"
                      >
                        Fit to Screen
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-600/50">
                    <div className="flex gap-2">
                      <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className={`px-3 py-1 rounded text-xs transition-all touch-manipulation ${
                          historyIndex <= 0
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-600/20 text-orange-400 hover:bg-orange-600/40'
                        }`}
                      >
                        ↶ Undo
                      </button>
                      <button
                        onClick={redo}
                        disabled={historyIndex >= drawingHistory.length - 1}
                        className={`px-3 py-1 rounded text-xs transition-all touch-manipulation ${
                          historyIndex >= drawingHistory.length - 1
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-600/20 text-orange-400 hover:bg-orange-600/40'
                        }`}
                      >
                        ↷ Redo
                      </button>
                      <button
                        onClick={clearCanvas}
                        className="px-3 py-1 bg-red-600/20 text-red-400 rounded text-xs hover:bg-red-600/40 transition-all touch-manipulation"
                      >
                        🗑️ Clear
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    💡 Use two fingers to pinch-zoom, two-finger drag to pan
                  </div>
                </div>

                {/* Quick Access Toolbar */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                  {[
                    { tool: 'pen', name: 'Draw', icon: PenTool, desc: 'Freehand drawing' },
                    { tool: 'rectangle', name: 'Room', icon: Square, desc: 'Create rooms' },
                    { tool: 'circle', name: 'Zone', icon: Circle, desc: 'Coverage zones' },
                    { tool: 'text', name: 'Label', icon: Type, desc: 'Add text' },
                    { tool: 'move', name: 'Select', icon: Move, desc: 'Move objects' },
                    { tool: 'device', name: 'Device', icon: MapPin, desc: 'Place devices' }
                  ].map(({ tool, name, icon: Icon, desc }) => (
                    <button
                      key={tool}
                      onClick={() => setSelectedTool(tool as any)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 touch-manipulation ${
                        selectedTool === tool
                          ? 'bg-purple-600 border-purple-400 text-white shadow-lg'
                          : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-purple-500 hover:bg-gray-600/50'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-semibold">{name}</span>
                      <span className="text-xs opacity-75">{desc}</span>
                    </button>
                  ))}
                </div>

                {/* iPad Pro Optimized Controls */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Color</label>
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => setCurrentColor(e.target.value)}
                      className="w-full h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
                    />
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Width: {currentStrokeWidth}px
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={currentStrokeWidth}
                      onChange={(e) => setCurrentStrokeWidth(parseInt(e.target.value))}
                      className="w-full h-6 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`bg-gray-700/30 rounded-lg p-4 transition-all touch-manipulation ${
                      showGrid
                        ? 'bg-purple-600/50 border-2 border-purple-400'
                        : 'hover:bg-gray-600/50'
                    }`}
                  >
                    <Grid className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm font-medium">Grid</span>
                  </button>
                  <button
                    onClick={() => setDrawings([])}
                    className="bg-red-600/20 hover:bg-red-600/40 rounded-lg p-4 transition-all touch-manipulation border-2 border-red-600/50"
                  >
                    <Trash2 className="w-6 h-6 mx-auto mb-1 text-red-400" />
                    <span className="text-sm font-medium text-red-400">Clear</span>
                  </button>
                </div>
              </div>
            )}

            {/* Floating Toolbar */}
            {showFloatingToolbar && (uploadedPDF || isBlankCanvas) && (
              <div
                className="fixed bg-gray-800/95 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-4 shadow-2xl z-50"
                style={{ left: toolbarPosition.x, top: toolbarPosition.y }}
                onMouseDown={(e) => {
                  const startX = e.clientX - toolbarPosition.x
                  const startY = e.clientY - toolbarPosition.y

                  const handleMouseMove = (e: MouseEvent) => {
                    setToolbarPosition({
                      x: e.clientX - startX,
                      y: e.clientY - startY
                    })
                  }

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                  }

                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }}
              >
                <div className="flex items-center gap-2 mb-4 cursor-move">
                  <PenTool className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold text-white">Quick Tools</span>
                  <button
                    onClick={() => setShowFloatingToolbar(false)}
                    className="ml-auto text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { tool: 'pen', icon: PenTool, label: 'Draw' },
                    { tool: 'rectangle', icon: Square, label: 'Room' },
                    { tool: 'circle', icon: Circle, label: 'Zone' },
                    { tool: 'text', icon: Type, label: 'Text' },
                    { tool: 'move', icon: Move, label: 'Move' },
                    { tool: 'device', icon: MapPin, label: 'Device' }
                  ].map(({ tool, icon: Icon, label }) => (
                    <button
                      key={tool}
                      onClick={() => setSelectedTool(tool as any)}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                        selectedTool === tool
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-purple-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Device Tree Sidebar */}
            {showDeviceTree && (uploadedPDF || isBlankCanvas) && (
              <div className="fixed right-0 top-0 h-full w-96 bg-gray-800/95 backdrop-blur-xl border-l border-purple-600/30 z-40 overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      📚 Device Library
                    </h3>
                    <button
                      onClick={() => setShowDeviceTree(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Technology Layer Management */}
                  <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      🔧 Layer Controls
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(deviceLibrary).map(([category, data]) => {
                        const layerKey = category.toLowerCase().replace(/\s+/g, '-')
                        const isActive = activeLayers.includes(layerKey)

                        return (
                          <div key={category} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              <span className="text-sm text-gray-300">{category}</span>
                            </div>
                            <button
                              onClick={() => {
                                setActiveLayers(prev =>
                                  isActive
                                    ? prev.filter(layer => layer !== layerKey)
                                    : [...prev, layerKey]
                                )
                              }}
                              className={`w-10 h-5 rounded-full relative transition-all ${
                                isActive ? 'bg-purple-600' : 'bg-gray-600'
                              }`}
                            >
                              <div
                                className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${
                                  isActive ? 'left-6' : 'left-1'
                                }`}
                              />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-600/50">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveLayers(Object.keys(deviceLibrary).map(cat => cat.toLowerCase().replace(/\s+/g, '-')))}
                          className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded text-xs hover:bg-purple-600/40 transition-all"
                        >
                          Show All
                        </button>
                        <button
                          onClick={() => setActiveLayers([])}
                          className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded text-xs hover:bg-gray-600/40 transition-all"
                        >
                          Hide All
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(deviceLibrary).map(([category, data]) => (
                      <div key={category} className="bg-gray-700/30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setSelectedDeviceCategory(
                            selectedDeviceCategory === category ? null : category
                          )}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-600/30 transition-all"
                          style={{ borderLeftColor: data.color, borderLeftWidth: '4px' }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{data.icon}</span>
                            <span className="font-semibold text-white">{category}</span>
                          </div>
                          <span className="text-gray-400">
                            {selectedDeviceCategory === category ? '▼' : '▶'}
                          </span>
                        </button>

                        {selectedDeviceCategory === category && (
                          <div className="p-2 space-y-2">
                            {data.devices.map((device) => (
                              <button
                                key={device.id}
                                className="w-full p-3 bg-gray-600/20 hover:bg-gray-600/40 rounded-lg text-left transition-all border-2 border-transparent hover:border-purple-500/50"
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('application/json', JSON.stringify({
                                    type: 'device',
                                    deviceId: device.id,
                                    deviceName: device.name,
                                    deviceIcon: device.icon,
                                    deviceSpecs: device.specs,
                                    categoryColor: deviceLibrary[category].color,
                                    category: category
                                  }))
                                }}
                                draggable
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-xl">{device.icon}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-white">{device.name}</div>
                                    <div className="text-xs text-gray-400 mt-1">{device.specs}</div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Canvas Area */}
            {(uploadedPDF || isBlankCanvas) && (
              <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {isBlankCanvas ? 'Design Canvas' : (uploadedPDF?.name || 'Floor Plan')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center gap-1">
                      <Save className="w-4 h-4" />
                      Export
                    </button>
                    <span className="text-sm text-gray-400">
                      Tool: {selectedTool} | Drawings: {drawings.length}
                    </span>
                  </div>
                </div>

                <div
                  className="relative bg-white rounded-lg"
                  style={{ aspectRatio: '4/3', minHeight: '600px' }}
                  onDragOver={handleCanvasDragOver}
                  onDrop={handleCanvasDrop}
                >
                  {/* Grid Background */}
                  {showGrid && (
                    <div className="absolute inset-0 opacity-20">
                      <svg width="100%" height="100%">
                        <defs>
                          <pattern id="designGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ccc" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#designGrid)" />
                      </svg>
                    </div>
                  )}

                  {/* PDF Background */}
                  {uploadedPDF && pdfUrl && (
                    <div className="absolute inset-0">
                      <div className="text-center p-8">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">PDF: {uploadedPDF.name}</p>
                        <p className="text-sm text-gray-500">PDF rendering will be implemented here</p>
                      </div>
                    </div>
                  )}

                  {/* Drawing Canvas */}
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                    style={{
                      transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasScale})`,
                      transformOrigin: '0 0'
                    }}
                    onMouseDown={(e) => {
                      if (selectedTool === 'pen') {
                        setIsDrawing(true)
                        // Start new drawing
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = (e.clientX - rect.left - canvasOffset.x) / canvasScale
                        const y = (e.clientY - rect.top - canvasOffset.y) / canvasScale

                        const newDrawing = {
                          id: Date.now().toString(),
                          type: 'pen' as const,
                          points: [x, y],
                          color: currentColor,
                          strokeWidth: currentStrokeWidth
                        }
                        setDrawings(prev => [...prev, newDrawing])
                      }
                    }}
                    onMouseMove={(e) => {
                      if (isDrawing && selectedTool === 'pen') {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = (e.clientX - rect.left - canvasOffset.x) / canvasScale
                        const y = (e.clientY - rect.top - canvasOffset.y) / canvasScale

                        setDrawings(prev => {
                          const newDrawings = [...prev]
                          const lastDrawing = newDrawings[newDrawings.length - 1]
                          if (lastDrawing && lastDrawing.points) {
                            lastDrawing.points.push(x, y)
                          }
                          return newDrawings
                        })
                      }
                    }}
                    onMouseUp={() => {
                      if (isDrawing) {
                        setIsDrawing(false)
                        saveToHistory(drawings)
                      }
                    }}
                    onMouseLeave={() => {
                      if (isDrawing) {
                        setIsDrawing(false)
                        saveToHistory(drawings)
                      }
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  />

                  {/* Instruction Overlay */}
                  {drawings.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <PenTool className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-gray-600 mb-2">Start Drawing</h4>
                        <p className="text-gray-500">
                          {selectedTool === 'pen' && 'Click and drag to draw'}
                          {selectedTool === 'rectangle' && 'Click and drag to create rectangles'}
                          {selectedTool === 'circle' && 'Click and drag to create circles'}
                          {selectedTool === 'text' && 'Click to add text'}
                          {selectedTool === 'device' && 'Click to place security devices'}
                          {selectedTool === 'move' && 'Click and drag to move elements'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Default State */}
            {!uploadedPDF && !isBlankCanvas && (
              <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-12 text-center">
                <PenTool className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Ready to Design Floor Plans</h3>
                <p className="text-gray-400 mb-6">
                  Upload existing floor plans or start with a blank canvas to create annotated security designs.
                </p>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>📋 <strong>Upload PDF floor plans</strong> and add security annotations</p>
                  <p>🎨 <strong>Drawing tools</strong> for markups, measurements, and notes</p>
                  <p>📍 <strong>Device placement</strong> with specifications and coverage areas</p>
                  <p>💾 <strong>Export annotated plans</strong> for proposals and documentation</p>
                </div>
              </div>
            )}

            {/* Hidden file input for PDF upload */}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setUploadedPDF(file)
                  setPdfUrl(URL.createObjectURL(file))
                  setIsBlankCanvas(false)
                }
              }}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        )}
      </div>
    </div>
  )
}