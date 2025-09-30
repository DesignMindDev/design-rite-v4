'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bot, Upload, MessageSquare, Zap, RefreshCw, Download, ArrowLeft, Sparkles, FileText, Database, Settings, ChevronDown } from 'lucide-react'
import { sessionManager } from '../../lib/sessionManager'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AssessmentData {
  projectType?: string
  facilitySize?: string
  budget?: string
  securityNeeds?: string[]
  currentSystems?: string
  [key: string]: any
}

interface AIProvider {
  id: string
  name: string
  description: string
  endpoint?: string
  model?: string
  available: boolean
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [hasUploadedFile, setHasUploadedFile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState('assessment-assistant')
  const [apiKey, setApiKey] = useState('')
  const [showSessions, setShowSessions] = useState(false)
  const [userHash, setUserHash] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [sessionName, setSessionName] = useState('')
  const [previousSessions, setPreviousSessions] = useState<any[]>([])
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [previewContent, setPreviewContent] = useState({ title: '', content: '', filename: '' })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [aiProviders, setAiProviders] = useState<AIProvider[]>([
    {
      id: 'assessment-assistant',
      name: 'Assessment Assistant',
      description: 'Specialized security assessment and discovery assistant',
      endpoint: '/api/ai/assistant',
      model: 'gpt-4',
      available: true
    },
    {
      id: 'simulated',
      name: 'Simulated Responses',
      description: 'Pre-programmed responses for demo purposes',
      available: true
    },
    {
      id: 'existing-endpoint',
      name: 'Existing AI Assessment',
      description: 'Your current /api/ai-assessment endpoint',
      endpoint: '/api/ai-assessment',
      available: true
    }
  ])

  useEffect(() => {
    // Initialize user hash and session
    initializeSession()

    // Load AI providers from the AI Providers system
    loadAIProviders()

    // Check for existing assessment data from previous tools
    const quickEstimateData = sessionStorage.getItem('quickEstimateData')
    const aiDiscoveryData = sessionStorage.getItem('aiDiscoveryData')

    if (aiDiscoveryData) {
      const data = JSON.parse(aiDiscoveryData)
      setAssessmentData(data)
      addWelcomeMessage('AI Discovery', data)

      // Initialize session tracking from AI Discovery data
      if (data.userId && data.projectId) {
        console.log('🎯 Continuing session from AI Discovery:', data.userId, data.projectId)
      }
    } else if (quickEstimateData) {
      const data = JSON.parse(quickEstimateData)
      setAssessmentData(data)
      addWelcomeMessage('Quick Estimate', data)

      // Initialize session tracking from Quick Estimate data
      if (data.userId && data.projectId) {
        console.log('🎯 Continuing session from Quick Estimate:', data.userId, data.projectId)

        // Track AI assistant usage
        sessionManager.trackActivity({
          action: 'ai_assistant_started',
          tool: 'ai-assistant',
          data: {
            source: 'quick-estimate',
            estimatedCost: data.estimate?.totalCost,
            systems: data.selectedSystems
          }
        });

        // Log AI session continuation
        sessionManager.logAISession({
          tool: 'ai-assistant',
          sessionId: sessionId,
          userId: data.userId,
          projectId: data.projectId,
          data: { source: 'quick_estimate_handoff', assessment_data: data }
        });
      }
    } else {
      addInitialMessage()

      // Initialize fresh session for direct AI assistant access
      const user = sessionManager.getOrCreateUser()
      const project = sessionManager.createOrUpdateProject({
        projectName: `AI Assistant Session ${new Date().toLocaleDateString()}`,
        facilityType: 'Unknown',
        phase: {
          tool: 'ai-assistant',
          data: { direct_access: true }
        }
      });

      console.log('🎯 Started fresh AI Assistant session:', user.userId, project.projectId)
    }
  }, [])

  const loadAIProviders = async () => {
    try {
      const response = await fetch('/api/admin/ai-providers')
      if (response.ok) {
        const data = await response.json()
        const assessmentProviders = data.providers.filter((p: any) =>
          p.use_case === 'assessment' && p.enabled
        ).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || `${p.provider_type} provider for security assessments`,
          endpoint: '/api/ai/assistant',
          model: p.model,
          available: true
        }))

        // Update the providers list with real ones
        setAiProviders(prev => [
          ...assessmentProviders,
          ...prev.filter(p => p.id === 'simulated' || p.id === 'existing-endpoint')
        ])

        // If assessment providers are available, set the first one as default
        if (assessmentProviders.length > 0) {
          setSelectedProvider(assessmentProviders[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to load AI providers:', error)
    }
  }

  const generateUserHash = () => {
    // Create a persistent user hash based on browser fingerprint
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.platform
    ].join('|')

    // Simple hash function
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  const generateSessionId = () => {
    return `ai_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const initializeSession = async () => {
    // Get or create user hash
    let hash = localStorage.getItem('ai_user_hash')
    if (!hash) {
      hash = generateUserHash()
      localStorage.setItem('ai_user_hash', hash)
    }
    setUserHash(hash)

    // Check for existing session or create new one
    const existingSessionId = sessionStorage.getItem('ai_current_session')
    if (existingSessionId) {
      setSessionId(existingSessionId)
      await loadSession(existingSessionId, hash)
    } else {
      await createNewSession(hash)
    }

    // Load previous sessions
    await loadPreviousSessions(hash)
  }

  const createNewSession = async (hash: string) => {
    const newSessionId = generateSessionId()
    const newSessionName = `Session ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`

    setSessionId(newSessionId)
    setSessionName(newSessionName)
    sessionStorage.setItem('ai_current_session', newSessionId)

    // Create assessment session in database (for assessment data only)
    try {
      await fetch('/api/ai/logging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_session',
          data: {
            sessionId: newSessionId,
            userHash: hash,
            sessionName: newSessionName,
            aiProvider: selectedProvider,
            assessmentData // Only assessment data goes here
          }
        })
      })

      // Create separate chat session (for chat messages only)
      await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_chat_session',
          data: {
            sessionId: `chat_${newSessionId}`,
            userHash: hash,
            sessionName: `Chat - ${newSessionName}`,
            aiProvider: selectedProvider,
            assessmentReference: newSessionId // Link to assessment session
          }
        })
      })
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  }

  const loadSession = async (sessionId: string, hash: string) => {
    try {
      const response = await fetch('/api/ai/logging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_session',
          data: { sessionId, userHash: hash }
        })
      })

      if (response.ok) {
        const { session, conversations } = await response.json()
        setSessionName(session.session_name)
        setSelectedProvider(session.ai_provider)

        if (session.assessment_data) {
          setAssessmentData(session.assessment_data)
        }

        // Restore conversation history
        const restoredMessages = conversations.map((conv: any) => [
          {
            id: `${conv.id}_user`,
            role: 'user' as const,
            content: conv.user_message,
            timestamp: new Date(conv.timestamp)
          },
          {
            id: `${conv.id}_assistant`,
            role: 'assistant' as const,
            content: conv.ai_response,
            timestamp: new Date(conv.timestamp)
          }
        ]).flat()

        setMessages(restoredMessages)
      }
    } catch (error) {
      console.error('Failed to load session:', error)
    }
  }

  const loadPreviousSessions = async (hash: string) => {
    try {
      const response = await fetch('/api/ai/logging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_sessions',
          data: { userHash: hash, limit: 10 }
        })
      })

      if (response.ok) {
        const { sessions } = await response.json()
        setPreviousSessions(sessions || [])
      }
    } catch (error) {
      console.error('Failed to load previous sessions:', error)
    }
  }

  const logConversation = async (userMessage: string, aiResponse: string) => {
    try {
      // Save chat message separately (without assessment data)
      await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_chat_message',
          data: {
            sessionId: `chat_${sessionId}`, // Use separate chat session ID
            userHash,
            userMessage,
            aiResponse,
            aiProvider: selectedProvider,
            threadId: null, // Will be set when using OpenAI threads
            assistantId: null, // Will be set when using OpenAI assistants
            timestamp: new Date().toISOString(),
            metadata: { hasUploadedFile }
          }
        })
      })
    } catch (error) {
      console.error('Failed to log conversation:', error)
    }
  }

  const switchToSession = async (targetSessionId: string) => {
    setSessionId(targetSessionId)
    sessionStorage.setItem('ai_current_session', targetSessionId)
    setMessages([])
    await loadSession(targetSessionId, userHash)
    setShowSessions(false)
  }

  const startNewSession = async () => {
    await createNewSession(userHash)
    setMessages([])
    setAssessmentData(null)
    setHasUploadedFile(false)
    addInitialMessage()
    await loadPreviousSessions(userHash)
    setShowSessions(false)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addInitialMessage = () => {
    const initialMessage: Message = {
      id: '1',
      role: 'assistant',
      content: `👋 Welcome to AI Assistant Refinement!

I'm here to help you perfect your security assessment through natural conversation. You can:

🔄 **Refine existing assessments** - Upload a previous estimate or continue from AI Discovery
💬 **Chat to improve** - Tell me what you'd like to change or add
⚡ **Real-time updates** - See pricing and recommendations update as we chat
📊 **Export results** - Generate updated proposals and BOMs

What would you like to work on today?`,
      timestamp: new Date()
    }
    setMessages([initialMessage])
  }

  const addWelcomeMessage = (source: string, data: AssessmentData) => {
    // Handle different data structures based on source
    let overview = ''

    if (source === 'Quick Estimate') {
      // Security estimate data structure
      const facilitySize = data.facilitySize ? `${data.facilitySize} sq ft` : ''
      const selectedSystems = data.selectedSystems || []
      const estimate = data.estimate
      const contactInfo = data.contactInfo

      overview = `**Current Assessment Overview:**
${facilitySize ? `• Facility Size: ${facilitySize}` : ''}
${contactInfo?.company ? `• Company: ${contactInfo.company}` : ''}
${selectedSystems.length ? `• Selected Systems: ${selectedSystems.join(', ').replace(/([A-Z])/g, ' $1').trim()}` : ''}
${estimate?.totalCost ? `• Estimated Cost: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(estimate.totalCost)}` : ''}`
    } else {
      // AI Discovery data structure
      const facilityInfo = data.squareFootage ? `${data.squareFootage} sq ft` : (data.facilitySize || '')
      const facilityType = data.facilityType || data.projectType || ''
      const budget = data.budgetRange || data.budget || ''
      const securityConcerns = data.securityConcerns || data.securityNeeds || []

      overview = `**Current Assessment Overview:**
${facilityType ? `• Facility Type: ${facilityType}` : ''}
${facilityInfo ? `• Facility Size: ${facilityInfo}` : ''}
${budget ? `• Budget Range: ${budget.replace(/-/g, ' - ').replace(/k/g, 'K').replace(/m/g, 'M')}` : ''}
${securityConcerns.length ? `• Security Concerns: ${securityConcerns.join(', ')}` : ''}`
    }

    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: `🎉 Perfect! I've loaded your ${source} data and I'm ready to help refine it.

${overview}

What would you like to refine or improve? For example:
- "Add more cameras to the parking area"
- "Include access control for the server room"
- "Reduce the budget by 15%"
- "Add compliance requirements for HIPAA"`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setHasUploadedFile(true)
      const uploadMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `Uploaded file: ${file.name}`,
        timestamp: new Date()
      }

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `📄 I've analyzed your uploaded assessment. I can see the existing security recommendations and pricing. What would you like to refine or improve?

Some suggestions:
- Adjust equipment quantities or specifications
- Add new security zones or areas
- Modify budget constraints
- Include additional compliance requirements
- Update implementation timeline`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, uploadMessage, responseMessage])
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      let aiResponse: Message

      if (selectedProvider === 'simulated') {
        // Simulate AI response with real-world refinement scenarios
        setTimeout(() => {
          const response: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: generateAIResponse(currentInput),
            timestamp: new Date()
          }
          setMessages(prev => [...prev, response])
          setIsLoading(false)
        }, 1500)
        return
      }

      // Use real AI provider
      const selectedProviderConfig = aiProviders.find(p => p.id === selectedProvider)
      if (!selectedProviderConfig?.endpoint) {
        throw new Error('Provider configuration not found')
      }

      const response = await fetch(selectedProviderConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          context: {
            assessmentData,
            conversationHistory: messages.slice(-5), // Last 5 messages for context
            provider: selectedProvider
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success && data.error) {
        throw new Error(data.error)
      }

      aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || data.content || 'I apologize, but I encountered an issue processing your request.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiResponse])

      // Log the conversation
      await logConversation(currentInput, aiResponse.content)
    } catch (error) {
      console.error('AI Provider Error:', error)

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ AI Provider Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nFalling back to simulated response:\n\n${generateAIResponse(currentInput)}`,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorResponse])

      // Log the error response
      await logConversation(currentInput, errorResponse.content)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('camera') || input.includes('surveillance')) {
      return `🎥 Great! I've updated your surveillance system recommendations:

**Added to Assessment:**
• 4x Additional IP cameras (2MP/4MP options) for enhanced coverage
• Upgraded storage to accommodate extra streams
• Enhanced analytics package for motion detection

**Updated Pricing:**
• Previous estimate: $28,500
• **New total: $31,200** (+$2,700)

The additional cameras will provide 95% coverage versus the original 80%. Would you like me to adjust the camera specifications or add any other features?`
    }

    if (input.includes('budget') || input.includes('cost') || input.includes('price')) {
      return `💰 I'll help optimize your budget!

**Cost Optimization Options:**
• Switch to 1080p cameras in low-priority areas (-$3,200)
• Use hybrid wired/wireless access points (-$1,800)
• Standard analytics vs. premium package (-$2,400)
• Phased implementation over 6 months (30% upfront)

**Current Total:** $31,200
**Optimized Total:** $23,800 (-24% savings)

Which budget adjustments interest you most?`
    }

    if (input.includes('access control') || input.includes('door') || input.includes('entry')) {
      return `🚪 Perfect! Let me enhance your access control system:

**Recommended Additions:**
• Card reader system for main entrances
• Biometric scanner for secure areas
• Integration with existing surveillance
• Mobile app for remote management

**Security Enhancement:**
• Multi-factor authentication
• Time-based access restrictions
• Audit trail logging
• Emergency lockdown capability

**Investment:** +$8,400 for comprehensive access control
**Total Updated Estimate:** $39,600

This creates a fully integrated security ecosystem. Shall I detail the implementation plan?`
    }

    return `✨ I understand you'd like to refine that aspect of your security assessment.

Based on your input, I'm analyzing the best approach to incorporate these changes while maintaining system integration and budget considerations.

**What I'm considering:**
• Impact on existing recommendations
• Budget implications
• Installation timeline adjustments
• Compliance requirements

Could you provide a bit more detail about your specific goals? This will help me give you the most accurate refinement.`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleExportProposal = () => {
    // Create a mock updated proposal
    const proposalContent = `# Updated Security Assessment Proposal

## Project Summary
${assessmentData?.projectType || 'Security Assessment'}
${assessmentData?.facilitySize ? `Facility Size: ${assessmentData.facilitySize}` : ''}
${assessmentData?.budget ? `Budget Range: ${assessmentData.budget}` : ''}

## AI-Enhanced Recommendations
Based on our conversation, the following refinements have been made:

${messages.filter(m => m.role === 'user').map((msg, i) => `${i + 1}. ${msg.content}`).join('\n')}

## Updated Pricing
- Real-time pricing integration maintained
- Recommendations optimized based on conversation
- Professional-grade specifications

## Next Steps
1. Review updated specifications
2. Schedule installation consultation
3. Finalize contract and timeline

Generated with AI Assistant Refinement
Date: ${new Date().toLocaleDateString()}
`

    // Show preview instead of direct download
    setPreviewContent({
      title: 'Updated Security Assessment Proposal',
      content: proposalContent,
      filename: `Updated_Security_Proposal_${new Date().toISOString().split('T')[0]}.md`
    })
    setShowPrintPreview(true)
  }

  const handleExportBOM = () => {
    // Create a mock BOM
    const bomContent = `# Detailed Bill of Materials (BOM)

## Security System Components

### Surveillance System
- IP Security Cameras (8x) - $800-$1,200 each (NDAA Compliant)
- Network Video Recorder - $800
- Storage Array (8TB) - $600
- Network Infrastructure - $1,500

### Access Control
- Card Readers (4x) - $400 each
- Access Control Panel - $1,200
- Key Cards (50x) - $5 each

### Installation & Configuration
- Professional Installation - $3,500
- System Configuration - $1,200
- Training & Documentation - $800

Total Investment: $15,400

Generated with AI Assistant Refinement
Date: ${new Date().toLocaleDateString()}
`

    // Show preview instead of direct download
    setPreviewContent({
      title: 'Detailed Bill of Materials (BOM)',
      content: bomContent,
      filename: `Security_BOM_${new Date().toISOString().split('T')[0]}.md`
    })
    setShowPrintPreview(true)
  }

  const handleExportImplementation = () => {
    // Create a mock implementation plan
    const implementationContent = `# Implementation Plan

## Phase 1: Site Survey & Planning (Week 1)
- Conduct detailed site assessment
- Finalize equipment specifications
- Create installation timeline
- Obtain necessary permits

## Phase 2: Equipment Procurement (Week 2-3)
- Order security equipment
- Coordinate delivery scheduling
- Prepare installation materials
- Schedule contractor resources

## Phase 3: Installation (Week 4-5)
- Install surveillance cameras
- Configure network infrastructure
- Set up access control system
- Test all components

## Phase 4: Configuration & Testing (Week 6)
- System configuration and optimization
- User training and documentation
- Final testing and sign-off
- Warranty and support activation

Total Timeline: 6 weeks
Project Manager: Assigned upon contract signing

Generated with AI Assistant Refinement
Date: ${new Date().toLocaleDateString()}
`

    // Show preview instead of direct download
    setPreviewContent({
      title: 'Implementation Plan',
      content: implementationContent,
      filename: `Implementation_Plan_${new Date().toISOString().split('T')[0]}.md`
    })
    setShowPrintPreview(true)
  }

  const handleDownloadFromPreview = () => {
    const blob = new Blob([previewContent.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = previewContent.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowPrintPreview(false)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${previewContent.title}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              h1, h2, h3 { color: #333; }
              pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <pre style="white-space: pre-wrap; font-family: inherit;">${previewContent.content}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }
  }

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 text-center">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/estimate-options" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Options</span>
          </Link>
          <div className="flex-1 text-center">
            <span className="font-bold text-lg">🤖 AI ASSISTANT REFINEMENT</span>
            <span className="ml-2">★★★ Intelligent Conversation-Driven Improvements</span>
          </div>
          <div className="text-sm">
            <Settings
              className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowSettings(!showSettings)}
            />
          </div>
        </div>
      </div>

      {/* AI Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-800 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl border p-6">
              <h3 className="text-xl font-bold dr-text-violet mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                AI Provider Selection
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Provider Selection */}
                <div>
                  <label className="block text-sm font-medium dr-text-pearl mb-3">
                    Choose AI Provider:
                  </label>
                  <div className="space-y-2">
                    {aiProviders.map((provider) => (
                      <label key={provider.id} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="aiProvider"
                          value={provider.id}
                          checked={selectedProvider === provider.id}
                          onChange={(e) => setSelectedProvider(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{provider.name}</span>
                            {!provider.available && (
                              <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">Coming Soon</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{provider.description}</p>
                          {provider.model && (
                            <p className="text-xs text-purple-400 mt-1">Model: {provider.model}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* API Configuration */}
                <div>
                  <label className="block text-sm font-medium dr-text-pearl mb-3">
                    API Key (if required):
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API key for external providers..."
                    className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-lg dr-text-pearl placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Required for OpenAI and Claude. Not needed for simulated or existing endpoint.
                  </p>

                  {/* Provider Info */}
                  <div className="mt-4 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                    <h4 className="font-medium text-purple-300 mb-2">Current Selection:</h4>
                    {(() => {
                      const current = aiProviders.find(p => p.id === selectedProvider)
                      return (
                        <div className="text-sm text-gray-300">
                          <p><strong>{current?.name}</strong></p>
                          <p>{current?.description}</p>
                          {current?.endpoint && (
                            <p className="text-xs text-purple-400 mt-1">Endpoint: {current.endpoint}</p>
                          )}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Test Button */}
                  <button
                    onClick={() => {
                      setInputValue("Test message: Please introduce yourself and explain how you can help with security assessments.")
                      setShowSettings(false)
                    }}
                    className="w-full mt-4 px-4 py-2 dr-bg-violet hover:bg-purple-700 dr-text-pearl rounded-lg transition-colors"
                  >
                    Test Selected Provider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-8">
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl border shadow-2xl flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 dr-bg-violet rounded-lg">
                      <MessageSquare className="w-5 h-5 dr-text-pearl" />
                    </div>
                    <div>
                      <h2 className="font-semibold dr-text-pearl">AI Refinement Assistant</h2>
                      <p className="text-sm text-gray-300">Natural language security system optimization</p>
                    </div>
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 dr-bg-violet hover:bg-purple-700 dr-text-pearl rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Assessment
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 italic">
                  *Accepts: PDF, DOC, DOCX, TXT files up to 10MB
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-900/20">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-gray-800/80 border border-gray-700/50 text-gray-100'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-purple-200' : 'text-gray-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800/80 border border-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 dr-border-violet"></div>
                          AI is analyzing your request...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-gray-700/50 bg-gray-900/20 rounded-b-2xl">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe what you'd like to refine... (e.g., 'Add more cameras to parking area')"
                    className="flex-1 px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-lg dr-text-pearl placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-6 py-3 dr-bg-violet hover:bg-purple-700 dr-text-pearl rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Current Assessment Summary */}
            {assessmentData && (
              <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl border p-6">
                <h3 className="font-semibold dr-text-pearl mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 dr-text-violet" />
                  Current Assessment
                </h3>
                <div className="space-y-3 text-sm">
                  {assessmentData.projectType && (
                    <div>
                      <span className="font-medium text-gray-300">Project:</span>
                      <span className="ml-2 text-gray-400">{assessmentData.projectType}</span>
                    </div>
                  )}
                  {assessmentData.facilitySize && (
                    <div>
                      <span className="font-medium text-gray-300">Size:</span>
                      <span className="ml-2 text-gray-400">{assessmentData.facilitySize}</span>
                    </div>
                  )}
                  {assessmentData.budget && (
                    <div>
                      <span className="font-medium text-gray-300">Budget:</span>
                      <span className="ml-2 text-gray-400">{assessmentData.budget}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl border p-6">
              <h3 className="font-semibold dr-text-pearl mb-4">Quick Refinements</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setInputValue("Add more security cameras")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  🎥 Add more cameras
                </button>
                <button
                  onClick={() => setInputValue("Reduce budget by 20%")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  💰 Optimize budget
                </button>
                <button
                  onClick={() => setInputValue("Add access control system")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  🚪 Access control
                </button>
                <button
                  onClick={() => setInputValue("Include HIPAA compliance")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  🔒 Add compliance
                </button>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl border p-6">
              <h3 className="font-semibold dr-text-pearl mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 dr-text-violet" />
                Export Results
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleExportProposal}
                  className="w-full px-4 py-2 dr-bg-violet hover:bg-purple-700 dr-text-pearl rounded-lg transition-colors"
                >
                  📄 Preview Proposal
                </button>
                <button
                  onClick={handleExportBOM}
                  className="w-full px-4 py-2 border border-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  📊 Preview BOM
                </button>
                <button
                  onClick={handleExportImplementation}
                  className="w-full px-4 py-2 border border-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  📋 Preview Implementation Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{previewContent.title}</h2>
              <button
                onClick={() => setShowPrintPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="bg-white shadow-sm rounded-lg p-8 mx-auto max-w-3xl" style={{ minHeight: '11in' }}>
                <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-mono">
                  {previewContent.content}
                </pre>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                File: {previewContent.filename}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={handleDownloadFromPreview}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}