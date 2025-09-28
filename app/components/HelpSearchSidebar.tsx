'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface HelpItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  url?: string;
  action?: () => void;
}

interface ContextSuggestion {
  icon: string;
  title: string;
  description: string;
  action: () => void;
}

export default function HelpSearchSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'help' | 'chat'>('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<HelpItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [contextSuggestions, setContextSuggestions] = useState<ContextSuggestion[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: Date, provider?: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'claude' | 'auto'>('auto');
  const [chatThreadId, setChatThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Help items database
  const helpItems: HelpItem[] = [
    // Security Estimate Help
    {
      id: 'estimate-basics',
      title: 'How to Create Security Estimates',
      description: 'Step-by-step guide to generating accurate security system estimates',
      category: 'Estimation',
      tags: ['estimate', 'pricing', 'security', 'basics'],
      url: '/help/estimation-guide'
    },
    {
      id: 'pricing-data',
      title: 'Understanding Pricing Data',
      description: 'How our real-time pricing system works with 3,000+ products',
      category: 'Estimation',
      tags: ['pricing', 'products', 'database', 'costs'],
      url: '/help/pricing-guide'
    },

    // AI Assessment Help
    {
      id: 'ai-assessment-intro',
      title: 'AI Assessment Overview',
      description: 'Complete guide to using the AI Discovery Assistant',
      category: 'Assessment',
      tags: ['ai', 'assessment', 'discovery', 'comprehensive'],
      url: '/help/ai-assessment'
    },
    {
      id: 'compliance-requirements',
      title: 'Compliance Requirements Guide',
      description: 'FERPA, HIPAA, CJIS compliance for security installations',
      category: 'Compliance',
      tags: ['ferpa', 'hipaa', 'cjis', 'compliance', 'regulations'],
      url: '/help/compliance'
    },

    // AI Chat Capabilities
    {
      id: 'ai-chat-overview',
      title: 'AI Chat Assistant',
      description: 'Direct chat with AI providers (OpenAI, Claude) without restrictions',
      category: 'AI Tools',
      tags: ['ai', 'chat', 'openai', 'claude', 'unrestricted'],
      url: '/help/ai-chat'
    },
    {
      id: 'ai-provider-selection',
      title: 'AI Provider Selection',
      description: 'How to choose between OpenAI, Claude, or Auto mode for optimal results',
      category: 'AI Tools',
      tags: ['providers', 'openai', 'claude', 'auto', 'optimization'],
      url: '/help/ai-providers'
    },
    {
      id: 'ai-creation-examples',
      title: 'AI Creation Examples',
      description: 'Code generation, content writing, analysis, and creative tasks',
      category: 'AI Tools',
      tags: ['examples', 'code', 'creative', 'analysis', 'generation'],
      action: () => {
        setActiveTab('chat');
        setChatInput('Show me examples of different AI creation tasks I can perform');
        setTimeout(() => sendChatMessage(), 100);
      }
    },
    {
      id: 'ai-analytics',
      title: 'AI Performance Analytics',
      description: 'Track and optimize AI provider performance for different task types',
      category: 'AI Tools',
      tags: ['analytics', 'performance', 'optimization', 'metrics'],
      url: '/help/ai-analytics'
    },

    // AI Creation Task Examples
    {
      id: 'ai-code-generation',
      title: 'Code Generation Example',
      description: 'Generate React components, API endpoints, or automation scripts',
      category: 'AI Examples',
      tags: ['code', 'react', 'api', 'javascript', 'typescript'],
      action: () => {
        setActiveTab('chat');
        setChatInput('Create a React component for a security camera product card with props for name, price, manufacturer, and an image URL. Include hover effects and a "Add to Estimate" button.');
        setTimeout(() => sendChatMessage(), 100);
      }
    },
    {
      id: 'ai-content-writing',
      title: 'Content Writing Example',
      description: 'Create marketing copy, proposals, or technical documentation',
      category: 'AI Examples',
      tags: ['content', 'marketing', 'proposals', 'writing', 'documentation'],
      action: () => {
        setActiveTab('chat');
        setChatInput('Write compelling marketing copy for a security system proposal targeting a retail store. Include pain points about theft, vandalism, and employee safety. Use persuasive language that emphasizes ROI and peace of mind.');
        setTimeout(() => sendChatMessage(), 100);
      }
    },
    {
      id: 'ai-data-analysis',
      title: 'Data Analysis Example',
      description: 'Analyze security requirements, cost breakdowns, or performance metrics',
      category: 'AI Examples',
      tags: ['analysis', 'data', 'metrics', 'requirements', 'performance'],
      action: () => {
        setActiveTab('chat');
        setChatInput('Analyze this security system cost breakdown and suggest optimizations: 20 IP cameras ($4,000), NVR system ($1,200), access control ($2,500), installation labor ($3,000). Total: $10,700. How can we reduce costs while maintaining effectiveness?');
        setTimeout(() => sendChatMessage(), 100);
      }
    },
    {
      id: 'ai-creative-brainstorm',
      title: 'Creative Brainstorming Example',
      description: 'Generate ideas for marketing campaigns, product names, or solutions',
      category: 'AI Examples',
      tags: ['creative', 'brainstorm', 'ideas', 'marketing', 'solutions'],
      action: () => {
        setActiveTab('chat');
        setChatInput('Brainstorm 10 creative names for a new AI-powered security assessment feature. The tool analyzes building layouts and recommends optimal camera placement. Think of names that convey intelligence, precision, and security expertise.');
        setTimeout(() => sendChatMessage(), 100);
      }
    },
    {
      id: 'ai-technical-explanation',
      title: 'Technical Explanation Example',
      description: 'Explain complex security concepts or troubleshoot technical issues',
      category: 'AI Examples',
      tags: ['technical', 'explanation', 'troubleshooting', 'security', 'concepts'],
      action: () => {
        setActiveTab('chat');
        setChatInput('Explain the differences between IP cameras and analog cameras for a non-technical client. Include pros/cons, cost implications, and which scenarios favor each technology. Make it simple but comprehensive.');
        setTimeout(() => sendChatMessage(), 100);
      }
    },
    {
      id: 'ai-proposal-generation',
      title: 'Proposal Generation Example',
      description: 'Create detailed security proposals with technical specifications',
      category: 'AI Examples',
      tags: ['proposal', 'specifications', 'technical', 'detailed', 'professional'],
      action: () => {
        setActiveTab('chat');
        setChatInput('Generate a professional security proposal executive summary for a 50,000 sq ft warehouse. Include current vulnerabilities, proposed solution overview, key benefits, timeline, and investment summary. Make it compelling for C-level decision makers.');
        setTimeout(() => sendChatMessage(), 100);
      }
    },

    // Creative Studio Help
    {
      id: 'creative-studio-basics',
      title: 'Creative Studio Getting Started',
      description: 'How to create compelling content with AI assistance',
      category: 'Content',
      tags: ['creative', 'content', 'writing', 'marketing'],
      url: '/help/creative-studio'
    },
    {
      id: 'brand-voice',
      title: 'Tuesday Morning Storm Brand Voice',
      description: 'Understanding and applying Design-Rite\'s unique brand voice',
      category: 'Content',
      tags: ['brand', 'voice', 'messaging', 'tone'],
      url: '/help/brand-voice'
    },

    // Product Database Help
    {
      id: 'product-search',
      title: 'Finding the Right Products',
      description: 'Search techniques for our security product database',
      category: 'Products',
      tags: ['products', 'search', 'cameras', 'access control'],
      url: '/help/product-search'
    },
    {
      id: 'facility-types',
      title: 'Security by Facility Type',
      description: 'Best practices for different facility types and environments',
      category: 'Installation',
      tags: ['facility', 'office', 'warehouse', 'retail', 'education'],
      url: '/help/facility-types'
    },

    // Quick Actions
    {
      id: 'quick-estimate',
      title: 'Start Quick Estimate',
      description: '5-minute estimate for immediate pricing',
      category: 'Quick Actions',
      tags: ['quick', 'estimate', 'fast', 'pricing'],
      action: () => window.location.href = '/security-estimate'
    },
    {
      id: 'ai-discovery',
      title: 'Launch AI Discovery',
      description: 'Comprehensive 15-20 minute security assessment',
      category: 'Quick Actions',
      tags: ['ai', 'discovery', 'assessment', 'comprehensive'],
      action: () => window.location.href = '/ai-assessment'
    },
    {
      id: 'create-content',
      title: 'Create Marketing Content',
      description: 'Generate blog posts, case studies, and social media content',
      category: 'Quick Actions',
      tags: ['content', 'marketing', 'creative', 'generation'],
      action: () => window.location.href = '/admin/creative-studio'
    }
  ];

  // Context-aware suggestions based on current page
  useEffect(() => {
    const suggestions: ContextSuggestion[] = [];

    if (pathname.includes('/security-estimate')) {
      suggestions.push(
        {
          icon: '💡',
          title: 'Pricing Tips',
          description: 'Get accurate estimates faster',
          action: () => setSearchQuery('pricing data')
        },
        {
          icon: '🏢',
          title: 'Facility Guidelines',
          description: 'Security best practices by building type',
          action: () => setSearchQuery('facility types')
        },
        {
          icon: '🚀',
          title: 'Upgrade to AI Assessment',
          description: 'Get comprehensive analysis',
          action: () => window.location.href = '/ai-assessment'
        }
      );
    } else if (pathname.includes('/ai-assessment')) {
      suggestions.push(
        {
          icon: '📋',
          title: 'Compliance Check',
          description: 'Ensure regulatory requirements',
          action: () => setSearchQuery('compliance requirements')
        },
        {
          icon: '🎯',
          title: 'Assessment Tips',
          description: 'Maximize AI assistant effectiveness',
          action: () => setSearchQuery('ai assessment')
        },
        {
          icon: '📊',
          title: 'Quick Estimate',
          description: 'Start with basic pricing',
          action: () => window.location.href = '/security-estimate'
        }
      );
    } else if (pathname.includes('/creative-studio')) {
      suggestions.push(
        {
          icon: '✍️',
          title: 'Brand Voice Guide',
          description: 'Apply Tuesday Morning Storm voice',
          action: () => setSearchQuery('brand voice')
        },
        {
          icon: '🎨',
          title: 'Content Ideas',
          description: 'Get inspiration for your next piece',
          action: () => setSearchQuery('creative studio')
        },
        {
          icon: '📈',
          title: 'Marketing Strategy',
          description: 'Content that converts',
          action: () => setSearchQuery('marketing content')
        }
      );
    } else {
      // Homepage or general navigation
      suggestions.push(
        {
          icon: '⚡',
          title: 'Quick Start',
          description: 'Get your first estimate in 5 minutes',
          action: () => window.location.href = '/estimate-options'
        },
        {
          icon: '🤖',
          title: 'AI Discovery',
          description: 'Comprehensive security assessment',
          action: () => window.location.href = '/ai-assessment'
        },
        {
          icon: '🎯',
          title: 'Find Products',
          description: 'Search our security product database',
          action: () => setSearchQuery('product search')
        }
      );
    }

    setContextSuggestions(suggestions);
  }, [pathname]);

  // Filter help items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = helpItems.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );

    setFilteredItems(filtered);
  }, [searchQuery]);

  // Load recent searches and chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('helpSearchHistory');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    const savedChats = localStorage.getItem('aiChatHistory');
    if (savedChats) {
      const parsed = JSON.parse(savedChats);
      setChatMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  // Save search to history
  const saveSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('helpSearchHistory', JSON.stringify(updated));
  };

  // Handle help item click
  const handleItemClick = (item: HelpItem) => {
    saveSearch(searchQuery);

    if (item.action) {
      item.action();
    } else if (item.url) {
      window.open(item.url, '_blank');
    }

    setIsOpen(false);
  };

  // Send AI chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage = {
      role: 'user' as const,
      content: chatInput.trim(),
      timestamp: new Date()
    };

    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput('');
    setIsLoading(true);

    try {
      let response;

      // For paying subscribers, use unrestricted AI with full capabilities
      if (selectedProvider === 'openai') {
        // Use OpenAI Assistant API for premium users
        if (!chatThreadId) {
          // Initialize thread if needed
          const initResponse = await fetch('/api/chat/init', { method: 'POST' });
          const initData = await initResponse.json();
          setChatThreadId(initData.threadId);

          response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: chatInput.trim(),
              threadId: initData.threadId
            })
          });
        } else {
          response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: chatInput.trim(),
              threadId: chatThreadId
            })
          });
        }
      } else {
        // Use premium Claude API for other providers
        response = await fetch('/api/help-assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: chatInput.trim(),
            sessionId: Date.now().toString(),
            conversationHistory: chatMessages.slice(-5)
          })
        });
      }

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant' as const,
        content: data.response,
        timestamp: new Date(),
        provider: data.provider
      };

      const finalMessages = [...newMessages, assistantMessage];
      setChatMessages(finalMessages);

      // Save to localStorage
      localStorage.setItem('aiChatHistory', JSON.stringify(finalMessages));

    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        provider: 'error'
      };
      setChatMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setChatMessages([]);
    setChatThreadId(null); // Reset OpenAI thread
    localStorage.removeItem('aiChatHistory');
  };

  // Export chat history
  const exportChat = () => {
    const chatText = chatMessages.map(msg =>
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.role.toUpperCase()}${msg.provider ? ` (${msg.provider})` : ''}: ${msg.content}`
    ).join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open help
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setActiveTab('help');
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }

      // Ctrl/Cmd + Shift + K to open AI chat
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        setIsOpen(true);
        setActiveTab('chat');
        setTimeout(() => chatInputRef.current?.focus(), 100);
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }

      // Enter to send chat message (when chat input is focused)
      if (e.key === 'Enter' && activeTab === 'chat' && document.activeElement === chatInputRef.current) {
        e.preventDefault();
        sendChatMessage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, chatInput, chatMessages, selectedProvider, isLoading]);

  // Only show help sidebar on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {/* Help Toggle Button - Only on Admin Pages */}
      {isAdminPage && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-purple-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-purple-700 transition-all z-40 group"
          title="Help & AI Chat (Ctrl+K / Ctrl+Shift+K)"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="hidden group-hover:block text-sm whitespace-nowrap pr-1">AI Assistant</span>
          </div>
        </button>
      )}

      {/* Sidebar Overlay - Only on Admin Pages */}
      {isAdminPage && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsOpen(false)} />
      )}

      {/* Help Sidebar - Only on Admin Pages */}
      {isAdminPage && (
        <div className={`fixed top-0 right-0 h-full w-96 bg-gray-800/60 backdrop-blur-xl border-l border-purple-600/20 shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">AI Assistant</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-purple-100 text-sm mt-1">Help, search, and unrestricted AI chat</p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-600/30">
            <div className="flex">
              <button
                onClick={() => setActiveTab('help')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'help'
                    ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-600/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🔍 Help & Search
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'chat'
                    ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-600/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                💬 AI Chat
              </button>
            </div>
          </div>

          {/* Search Input - Help Tab Only */}
          {activeTab === 'help' && (
            <div className="p-4 border-b border-gray-600/30">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search help, products, actions..."
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>
          )}

          {/* AI Chat Interface - Chat Tab Only */}
          {activeTab === 'chat' && (
            <div className="p-4 border-b border-gray-600/30">
              {/* Provider Selection */}
              <div className="flex gap-2 mb-4">
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as 'openai' | 'claude' | 'auto')}
                  className="flex-1 p-2 bg-gray-700/50 border border-gray-600/50 rounded text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="auto">🎯 Auto (Best Available)</option>
                  <option value="openai">🌐 WebGPT (Search + AI)</option>
                  <option value="claude">🧠 Claude (Deep Analysis)</option>
                </select>
                <button
                  onClick={clearChat}
                  className="px-3 py-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Clear Chat"
                >
                  🗑️
                </button>
                <button
                  onClick={exportChat}
                  className="px-3 py-2 text-gray-400 hover:text-purple-400 transition-colors"
                  title="Export Chat"
                  disabled={chatMessages.length === 0}
                >
                  💾
                </button>
              </div>

              {/* Chat Input */}
              <div className="relative">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask AI anything (no restrictions)..."
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 disabled:text-gray-500"
                >
                  {isLoading ? '⏳' : '🚀'}
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* AI Chat Messages */}
            {activeTab === 'chat' && (
              <div className="p-4 space-y-4 h-full bg-gray-900/50">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="font-semibold mb-2 text-white">General AI Assistant</h3>
                    <p className="text-sm">Ask me anything! No restrictions, no branding constraints.</p>
                    <div className="text-xs mt-4 space-y-1">
                      <p>💡 Get coding help</p>
                      <p>✍️ Write content</p>
                      <p>🧠 Brainstorm ideas</p>
                      <p>📊 Analyze data</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-xl ${
                            message.role === 'user'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700/60 text-white shadow-md border border-gray-600/30'
                          }`}
                        >
                          <div className="text-sm mb-1">
                            {message.role === 'user' ? (
                              <span className="font-medium">You</span>
                            ) : (
                              <span className="font-medium">
                                AI {message.provider && message.provider !== 'error' && `(${message.provider})`}
                              </span>
                            )}
                            <span className="text-xs opacity-70 ml-2">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-700/60 text-white shadow-md p-3 rounded-xl border border-gray-600/30">
                          <div className="text-sm font-medium mb-1">AI is thinking...</div>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Help Content - Help Tab Only */}
            {activeTab === 'help' && (
              <>
                {/* Search Results */}
                {searchQuery && filteredItems.length > 0 && (
              <div className="p-4">
                <h3 className="font-semibold text-white mb-3">Search Results</h3>
                <div className="space-y-2">
                  {filteredItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="p-3 border border-gray-600/30 rounded-lg hover:bg-purple-600/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{item.title}</h4>
                          <p className="text-sm text-gray-300 mt-1">{item.description}</p>
                          <span className="inline-block bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded mt-2">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-gray-400 ml-2">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery && filteredItems.length === 0 && (
              <div className="p-4 text-center text-gray-400">
                <p>No results found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try searching for: estimate, assessment, pricing, compliance, ai chat, examples</p>
              </div>
            )}

            {/* Context Suggestions */}
            {!searchQuery && contextSuggestions.length > 0 && (
              <div className="p-4">
                <h3 className="font-semibold text-white mb-3">Suggestions for this page</h3>
                <div className="space-y-2">
                  {contextSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={suggestion.action}
                      className="p-3 border border-gray-600/30 rounded-lg hover:bg-purple-600/20 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{suggestion.icon}</span>
                        <div>
                          <h4 className="font-medium text-white">{suggestion.title}</h4>
                          <p className="text-sm text-gray-300">{suggestion.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="p-4 border-t border-gray-600/30">
                <h3 className="font-semibold text-white mb-3">Recent Searches</h3>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="p-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-gray-400">🕐</span>
                      {search}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {!searchQuery && (
              <div className="p-4 border-t border-gray-600/30">
                <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.location.href = '/estimate-options'}
                    className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left"
                  >
                    🚀 Start New Estimate
                  </button>
                  <button
                    onClick={() => window.location.href = '/admin/creative-studio'}
                    className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-left"
                  >
                    ✨ Create Content
                  </button>
                  <button
                    onClick={() => setSearchQuery('compliance')}
                    className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left"
                  >
                    📋 Check Compliance
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-left"
                  >
                    🤖 Open AI Chat
                  </button>
                </div>
              </div>
            )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-600/30 bg-gray-800/60 text-center text-sm text-gray-400">
            {activeTab === 'help' ? (
              <p>Press <kbd className="bg-gray-700 text-gray-300 px-1 rounded">Ctrl+K</kbd> for help</p>
            ) : (
              <p>Press <kbd className="bg-gray-700 text-gray-300 px-1 rounded">Ctrl+Shift+K</kbd> for AI chat | <kbd className="bg-gray-700 text-gray-300 px-1 rounded">Enter</kbd> to send</p>
            )}
          </div>
        </div>
        </div>
      )}
    </>
  );
}