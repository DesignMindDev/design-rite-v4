'use client';

// components/ChatAssistant.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your Design-Rite advisor. I can help with platform questions and basic guidance. For unlimited AI assistance, please upgrade to premium features.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Public chatbot uses simple help responses - no thread initialization needed

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Public chatbot now provides limited predefined responses
      let responseContent = "I can help with basic Design-Rite platform questions. ";

      // Simple keyword matching for limited public responses
      const lowerInput = currentInput.toLowerCase();

      if (lowerInput.includes('estimate') || lowerInput.includes('pricing')) {
        responseContent += "For security estimates, try our Quick Security Estimate tool - it provides real pricing in 5 minutes. Want more detailed analysis? Upgrade to access our AI Discovery Assistant.";
      } else if (lowerInput.includes('security') || lowerInput.includes('camera') || lowerInput.includes('access control')) {
        responseContent += "I can provide basic security system information. For comprehensive security analysis and design recommendations, please upgrade to access our full AI capabilities.";
      } else if (lowerInput.includes('compliance') || lowerInput.includes('ndaa') || lowerInput.includes('ferpa')) {
        responseContent += "Our platform supports NDAA compliance and FERPA requirements. For detailed compliance analysis, upgrade to access our premium AI features.";
      } else if (lowerInput.includes('help') || lowerInput.includes('how')) {
        responseContent += "I can guide you through basic platform features. For advanced help and unlimited AI assistance, consider upgrading to premium.";
      } else {
        responseContent += "For detailed answers and unlimited AI assistance, please upgrade to our premium features. I can only provide basic platform guidance.";
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all transform hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
          <span className="absolute top-0 right-0 h-3 w-3 bg-green-400 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-96 bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl shadow-2xl z-50 transition-all ${
          isMinimized ? 'h-14' : 'h-[600px]'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-semibold">Design-Rite Advisor</h3>
                {isMinimized ? null : <p className="text-xs opacity-90">Security System Expert</p>}
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

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="h-[450px] overflow-y-auto p-4 space-y-4 bg-gray-900/50">
                {messages.map((message, index) => (
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
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700/60 text-white shadow-md max-w-[80%] p-3 rounded-xl border border-gray-600/30">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-600/30 bg-gray-800/60 rounded-b-2xl">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about our security solutions..."
                    className="flex-1 p-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by AI • Available 24/7
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatAssistant;