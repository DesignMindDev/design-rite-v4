'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, HelpCircle, Info, Minimize2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HelpChatbotProps {
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  useOpenAIAssistant?: boolean;
}

const HelpChatbot = ({ position = 'bottom-right', primaryColor = 'purple', useOpenAIAssistant = true }: HelpChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  const colorClasses = {
    purple: {
      bg: 'bg-purple-600 hover:bg-purple-700',
      gradient: 'from-purple-600 to-purple-700',
      border: 'border-purple-500',
      text: 'text-purple-600'
    },
    blue: {
      bg: 'bg-blue-600 hover:bg-blue-700',
      gradient: 'from-blue-600 to-blue-700',
      border: 'border-blue-500',
      text: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-600 hover:bg-green-700',
      gradient: 'from-green-600 to-green-700',
      border: 'border-green-500',
      text: 'text-green-600'
    }
  };

  const colors = colorClasses[primaryColor as keyof typeof colorClasses] || colorClasses.purple;

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      role: 'assistant',
      content: "Hi! I'm your Design-Rite Security Advisor. How can I help you today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Initialize thread on first open
  useEffect(() => {
    if (isOpen && !threadId && useOpenAIAssistant) {
      initializeThread();
    }
  }, [isOpen, threadId, useOpenAIAssistant]);

  const initializeThread = async () => {
    try {
      const response = await fetch('/api/chat/init', {
        method: 'POST',
      });
      const data = await response.json();
      setThreadId(data.threadId);
      console.log('Initialized thread:', data.threadId);
    } catch (error) {
      console.error('Failed to initialize chat thread:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      if (useOpenAIAssistant && threadId) {
        // Use OpenAI Assistant API
        const response = await fetch('/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            threadId: threadId
          }),
        });

        const data = await response.json();

        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Use fallback help assistant API
        const response = await fetch('/api/help-assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            sessionId: Date.now().toString(),
            conversationHistory: messages.slice(-5) // Last 5 messages for context
          })
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response || 'I apologize, but I encountered an issue. Please try again.',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact support@design-rite.com',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('pricing') || lowerInput.includes('cost') || lowerInput.includes('price')) {
      return `💰 **About Our Pricing:**

Our platform provides real-time pricing from major distributors like CDW, giving you accurate market pricing for security equipment.

• **Live Pricing Data** - 3,000+ products with current market prices
• **NDAA Compliant** - Excludes banned manufacturers by default
• **Professional Estimates** - Industry-standard markup and installation costs

Try our Security Estimate tool for instant pricing on your project!`;
    }

    if (lowerInput.includes('security') || lowerInput.includes('camera') || lowerInput.includes('access control')) {
      return `🔒 **Security System Help:**

We specialize in comprehensive security solutions including:

• **Video Surveillance** - IP cameras, NVRs, analytics
• **Access Control** - Card readers, biometrics, mobile access
• **Intrusion Detection** - Motion sensors, door/window contacts
• **Fire Safety** - Smoke detectors, notification systems

Our AI Discovery Assistant can create custom recommendations based on your specific needs!`;
    }

    if (lowerInput.includes('about') || lowerInput.includes('company') || lowerInput.includes('design-rite')) {
      return `🏢 **About Design-Rite:**

We're security system professionals who understand the challenges sales engineers face every day.

• **Built by Sales Engineers** - We know your pain points
• **AI-Powered Intelligence** - Streamline proposal creation
• **Real Market Data** - Accurate pricing and specifications
• **Professional Outputs** - Proposals, BOMs, implementation plans

Our mission: Turn chaotic Tuesday mornings into organized, professional presentations that win deals.`;
    }

    if (lowerInput.includes('navigate') || lowerInput.includes('how to') || lowerInput.includes('help')) {
      return `📍 **Platform Navigation:**

Here's how to get the most from Design-Rite:

1. **Quick Start** - Use Security Estimate for 5-minute basic estimates
2. **Comprehensive** - Try AI Discovery for detailed 15-20 minute assessments
3. **Refinement** - Use AI Assistant to chat and improve existing estimates
4. **Export** - Generate professional proposals, BOMs, and implementation plans

Start with Security Estimate if you need something fast, or AI Discovery for thorough analysis!`;
    }

    return `🤔 I'd be happy to help! I can assist with:

• **Platform features** - Security Estimate, AI Discovery, AI Assistant
• **Security systems** - Cameras, access control, intrusion detection
• **Pricing questions** - How our real-time pricing works
• **Company info** - About Design-Rite and our mission

Could you be more specific about what you'd like to know?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: "How does pricing work?", emoji: "💰" },
    { text: "What security systems do you cover?", emoji: "🔒" },
    { text: "Tell me about Design-Rite", emoji: "🏢" },
    { text: "How do I navigate the platform?", emoji: "📍" }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClasses[position]} ${colors.bg} text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all transform hover:scale-110 z-50`}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
        <span className="absolute top-0 right-0 h-3 w-3 bg-green-400 rounded-full animate-pulse"></span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <div className="bg-white rounded-t-2xl shadow-2xl border border-gray-200 w-80">
          <div className={`bg-gradient-to-r ${colors.gradient} text-white p-4 rounded-t-2xl flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5" />
              <span className="font-semibold">Design-Rite Help</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} w-96 bg-white rounded-2xl shadow-2xl z-50 transition-all h-[600px]`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-semibold">Design-Rite Advisor</h3>
            <p className="text-xs opacity-90">Security System Expert</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? `bg-gradient-to-r ${colors.gradient} text-white`
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Actions (only show if no user messages yet) */}
            {messages.filter(m => m.role === 'user').length === 0 && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500 text-center">Quick questions:</div>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(action.text)}
                    className="w-full text-left p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <span>{action.emoji}</span>
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    Thinking...
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Design-Rite..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`${colors.bg} text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpChatbot;