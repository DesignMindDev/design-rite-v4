'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Bot, Upload, MessageSquare, Zap, RefreshCw, Download, ArrowLeft, Sparkles, FileText, Database } from 'lucide-react'

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

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [hasUploadedFile, setHasUploadedFile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check for existing assessment data from previous tools
    const quickEstimateData = sessionStorage.getItem('quickEstimateData')
    const aiDiscoveryData = sessionStorage.getItem('aiDiscoveryData')

    if (aiDiscoveryData) {
      const data = JSON.parse(aiDiscoveryData)
      setAssessmentData(data)
      addWelcomeMessage('AI Discovery', data)
    } else if (quickEstimateData) {
      const data = JSON.parse(quickEstimateData)
      setAssessmentData(data)
      addWelcomeMessage('Quick Estimate', data)
    } else {
      addInitialMessage()
    }
  }, [])

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
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: `🎉 Perfect! I've loaded your ${source} data and I'm ready to help refine it.

**Current Assessment Overview:**
${data.projectType ? `• Project Type: ${data.projectType}` : ''}
${data.facilitySize ? `• Facility Size: ${data.facilitySize}` : ''}
${data.budget ? `• Budget Range: ${data.budget}` : ''}
${data.securityNeeds?.length ? `• Security Needs: ${data.securityNeeds.join(', ')}` : ''}

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
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response with real-world refinement scenarios
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes('camera') || input.includes('surveillance')) {
      return `🎥 Great! I've updated your surveillance system recommendations:

**Added to Assessment:**
• 4x Additional 4K IP cameras for enhanced coverage
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

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl">
      {/* Header Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold dr-text-violet">
              Design-Rite
            </Link>
            <div className="flex space-x-6">
              <Link href="/" className="hover:dr-text-violet transition-colors">Home</Link>
              <Link href="/solutions" className="hover:dr-text-violet transition-colors">Solutions</Link>
              <Link href="/contact" className="hover:dr-text-violet transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/estimate-options" className="flex items-center gap-2 text-gray-400 hover:dr-text-violet transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Options</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 dr-bg-violet rounded-xl">
              <Bot className="w-8 h-8 dr-text-pearl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold dr-text-violet">AI Assistant Refinement</h1>
              <p className="text-gray-300 text-lg">★★★ AI-ENHANCED • Intelligent conversation-driven improvements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Sparkles className="w-4 h-4 dr-text-violet" />
              <span>Smart Refinements</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <RefreshCw className="w-4 h-4 dr-text-violet" />
              <span>Real-time Updates</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Upload className="w-4 h-4 dr-text-violet" />
              <span>Upload Existing</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Download className="w-4 h-4 dr-text-violet" />
              <span>Export Results</span>
            </div>
          </div>
        </div>
      </div>

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
                <button className="w-full px-4 py-2 dr-bg-violet hover:bg-purple-700 dr-text-pearl rounded-lg transition-colors">
                  📄 Updated Proposal
                </button>
                <button className="w-full px-4 py-2 border border-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
                  📊 Detailed BOM
                </button>
                <button className="w-full px-4 py-2 border border-gray-600/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
                  📋 Implementation Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}