'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Download, Trash2, Sparkles, Globe, Brain } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
}

export default function GeneralAIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'auto' | 'openai' | 'claude'>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [chatThreadId, setChatThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('generalAIChatHistory');
    if (savedChats) {
      const parsed = JSON.parse(savedChats);
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('generalAIChatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Send message to AI
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      let response;

      if (selectedProvider === 'openai') {
        // Use OpenAI Assistant API
        if (!chatThreadId) {
          // Initialize thread
          const initResponse = await fetch('/api/chat/init', { method: 'POST' });
          const initData = await initResponse.json();
          setChatThreadId(initData.threadId);

          response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: input.trim(),
              threadId: initData.threadId
            })
          });
        } else {
          response = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: input.trim(),
              threadId: chatThreadId
            })
          });
        }
      } else {
        // Use Claude or Auto
        response = await fetch('/api/general-ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input.trim(),
            provider: selectedProvider,
            conversationHistory: messages.slice(-10) // Last 10 messages for context
          })
        });
      }

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response || data.message,
        timestamp: new Date(),
        provider: data.provider || selectedProvider
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        provider: 'error'
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Clear chat history
  const clearChat = () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
      setMessages([]);
      setChatThreadId(null);
      localStorage.removeItem('generalAIChatHistory');
    }
  };

  // Export chat history
  const exportChat = () => {
    const chatText = messages.map(msg =>
      `[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}${msg.provider ? ` (${msg.provider})` : ''}: ${msg.content}`
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
      // Ctrl/Cmd + Enter to send
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [input, messages, selectedProvider, isLoading]);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai':
        return <Globe className="w-4 h-4" />;
      case 'claude':
        return <Brain className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'openai':
        return 'WebGPT';
      case 'claude':
        return 'Claude';
      default:
        return 'Auto';
    }
  };

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/60 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/workspace"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Workspace</span>
              </Link>
              <div className="w-px h-6 bg-gray-600"></div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  General AI Chat
                </h1>
                <p className="text-gray-400 text-sm">Unrestricted AI for any task</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Provider Selection */}
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as 'auto' | 'openai' | 'claude')}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="auto">🎯 Auto (Best Available)</option>
                <option value="openai">🌐 WebGPT (Search + AI)</option>
                <option value="claude">🧠 Claude (Deep Analysis)</option>
              </select>

              <button
                onClick={exportChat}
                disabled={messages.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export Chat"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={clearChat}
                disabled={messages.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 hover:text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear Chat"
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-3">Start a Conversation</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Ask me anything! No restrictions, no branding constraints. I can help with:
              </p>

              {/* Example Use Cases */}
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">💻 Code Generation</h3>
                  <p className="text-gray-300 text-sm">
                    Create React components, API endpoints, automation scripts, or debug existing code.
                  </p>
                </div>

                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">✍️ Content Writing</h3>
                  <p className="text-gray-300 text-sm">
                    Write marketing copy, proposals, blog posts, or technical documentation.
                  </p>
                </div>

                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">📊 Data Analysis</h3>
                  <p className="text-gray-300 text-sm">
                    Analyze security requirements, cost breakdowns, or performance metrics.
                  </p>
                </div>

                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-700/30">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">💡 Brainstorming</h3>
                  <p className="text-gray-300 text-sm">
                    Generate ideas for marketing campaigns, product features, or creative solutions.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800/60 text-white border border-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {message.role === 'assistant' && message.provider && (
                        <div className="flex items-center gap-1 text-xs bg-gray-700/50 px-2 py-1 rounded">
                          {getProviderIcon(message.provider)}
                          <span>{getProviderName(message.provider)}</span>
                        </div>
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/60 border border-gray-700/30 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-gray-800/60 border-t border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask me anything... (Enter to send, Shift+Enter for new line)"
                className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Tip: Use Ctrl/Cmd+Enter to send quickly</span>
                <span>{input.length} characters</span>
              </div>
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
