'use client';

import { useState, useRef, useEffect } from 'react';
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
import { Send, Sparkles, User, Bot, Loader2, FileText, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const auth = useSupabaseAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/doc-ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-280px)] flex flex-col bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Harvey AI Assistant</h2>
            <p className="text-xs text-gray-500">Ask me about your documents</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FileText className="w-4 h-4" />
          <span>Context-aware responses</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start a Conversation</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ask questions about your uploaded documents, request security assessments, or generate professional proposals.
              </p>
              <div className="grid gap-3">
                {[
                  'Analyze my security documents',
                  'Generate a proposal for a client',
                  'What compliance requirements apply?'
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-700 hover:text-gray-900 text-sm text-left shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg
              ${message.role === 'user'
                ? 'bg-gradient-to-br from-emerald-600 to-teal-600'
                : 'bg-gradient-to-br from-purple-600 to-blue-600'
              }
            `}>
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Message Content */}
            <div className={`
              flex-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}
            `}>
              <div className={`
                px-5 py-4 rounded-2xl shadow-sm
                ${message.role === 'user'
                  ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
                }
              `}>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              <span className="text-xs text-gray-400 mt-2 block px-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 max-w-[80%]">
              <div className="px-5 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                  <span className="text-gray-600 text-sm">Harvey is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium mb-1">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Harvey anything about your documents..."
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all max-h-32"
              rows={1}
              disabled={isLoading}
            />
            <span className="absolute bottom-3 right-3 text-xs text-gray-400">
              {input.length > 0 && `${input.length} chars`}
            </span>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2 font-semibold text-white"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
