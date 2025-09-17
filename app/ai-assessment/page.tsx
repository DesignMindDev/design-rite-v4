'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Shield, Building2, Users, Calendar, DollarSign, CheckCircle, AlertTriangle, Download, Briefcase } from 'lucide-react';

const IntegratorDiscoveryAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Design-Rite AI Discovery Assistant. I'll help you conduct a thorough client discovery session using our proven 7-step methodology. This ensures you capture every critical detail for your security system proposal.\n\nTo get started, tell me about this client meeting - what's the company name and what type of facility are we designing security for?",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionData, setSessionData] = useState({
    companyName: '',
    facilityType: '',
    currentPhase: 'initial_discovery',
    qualificationScore: 0,
    documentsGenerated: []
  });
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callClaudeAPI = async (userMessage) => {
    try {
      const response = await fetch('/api/discovery-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionData: sessionData,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.message.content;
      } else {
        return data.error || "I apologize, but I'm having trouble processing that right now.";
      }
    } catch (error) {
      console.error('Claude API call failed:', error);
      return "I'm experiencing some technical difficulties. Let me help you manually - could you provide more details about your client's specific requirements?";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const aiResponse = await callClaudeAPI(input);
      
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      const fallbackMessage = {
        role: 'assistant',
        content: "I'm experiencing some connectivity issues. Let's continue with the discovery process. Could you provide more details about what we were discussing?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 text-purple-300" />
            <h1 className="text-3xl font-bold text-white">Design-Rite AI Discovery Assistant</h1>
          </div>
          <p className="text-white/70 text-lg">
            Systematic client discovery for security integrators - never miss a detail, never lose a requirement
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl p-4 rounded-xl ${
                      message.role === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white/20 text-white'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-white/20 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                        <span className="text-white/60 text-sm">AI is analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-white/20 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
                    placeholder="Discuss client requirements, ask questions, or provide details..."
                    className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                    disabled={isTyping}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isTyping}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Discovery Progress</h3>
              <div className="space-y-2">
                {['WHO', 'WHAT', 'WHEN', 'WHERE', 'WHY', 'HOW', 'COMPLIANCE'].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/20 text-white/60">
                      {index + 1}
                    </div>
                    <span className="text-sm text-white/60">{step}</span>
                  </div>
                ))}
              </div>
              
              {sessionData.qualificationScore > 0 && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Qualification Score</span>
                    <span className={`font-bold ${
                      sessionData.qualificationScore >= 90 ? 'text-green-400' :
                      sessionData.qualificationScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {sessionData.qualificationScore}/100
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratorDiscoveryAssistant;