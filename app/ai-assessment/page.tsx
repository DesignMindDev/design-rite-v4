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
    discoveryProgress: {
      who: { completed: false, data: {} },
      what: { completed: false, data: {} },
      when: { completed: false, data: {} },
      where: { completed: false, data: {} },
      why: { completed: false, data: {} },
      how: { completed: false, data: {} },
      compliance: { completed: false, data: {} }
    },
    qualificationScore: 0,
    currentPhase: 'initial_discovery',
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
      // The API returns data.message.content
      return data.message.content;
    } else {
      return data.error || "I apologize, but I'm having trouble processing that right now.";
    }
  } catch (error) {
    console.error('Claude API call failed:', error);
    return "I'm experiencing some technical difficulties. Let me help you manually - could you provide more details about your client's specific requirements?";
  }
};

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update session data with discovery progress
        setSessionData(prev => ({
          ...prev,
          currentPhase: data.discoveryProgress.currentPhase,
          qualificationScore: data.discoveryProgress.qualificationScore,
          discoveryProgress: {
            ...prev.discoveryProgress,
            completedPhases: data.discoveryProgress.completedPhases
          }
        }));
        
        return data.message.content;
      } else {
        // Use fallback response if provided
        return data.fallback?.content || "I apologize, but I'm having trouble processing that right now. Could you please rephrase your response?";
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

    // Call Claude API for intelligent response
    try {
      const aiResponse = await callClaudeAPI(input);
      
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
      // The API returns data.message.content
      return data.message.content;
    } else {
      return data.error || "I apologize, but I'm having trouble processing that right now.";
    }
  } catch (error) {
    console.error('Claude API call failed:', error);
    return "I'm experiencing some technical difficulties. Let me help you manually - could you provide more details about your client's specific requirements?";
  }
};
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateDocuments = async () => {
    setIsTyping(true);
    
    const generatingMessage = {
      role: 'assistant',
      content: "🔄 **GENERATING PROFESSIONAL PROPOSAL...**\n\nAnalyzing your discovery session to create:\n- Comprehensive Bill of Materials with 3-tier pricing\n- Professional proposal document\n- NDAA-compliant equipment specifications\n- Implementation timeline and next steps\n\nThis may take 30-60 seconds...",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, generatingMessage]);
    
    try {
      // Extract discovery data from conversation
      const discoveryData = {
        company_name: sessionData.companyName || 'Client Company',
        facility_type: sessionData.facilityType || 'office',
        facility_size: sessionData.facilitySize || 50000,
        security_concerns: messages.filter(m => m.role === 'user').map(m => m.content).join(' '),
        timeline: sessionData.timeline,
        budget_tier: sessionData.budgetTier,
        compliance_requirements: sessionData.complianceRequirements || []
      };
      
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discoveryData,
          conversationHistory: messages
        })
      });
      
      if (!response.ok) {
        throw new Error('Proposal generation failed');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSessionData(prev => ({
          ...prev,
          proposalData: data.proposal,
          documentsGenerated: ['Professional Proposal', 'BOM with 3-Tier Pricing', 'System Requirements', 'NDAA Compliance Report']
        }));
        
        const successMessage = {
          role: 'assistant',
          content: `🎉 **PROFESSIONAL PROPOSAL GENERATED!**\n\n**System Specifications:**\n• ${data.proposal.requirements.cameras} IP cameras with analytics\n• ${data.proposal.requirements.doors} access control doors\n• ${data.proposal.requirements.storage_days} days video retention\n• Full NDAA Section 889 compliance\n\n**Investment Options:**\n• **Entry Level:** ${data.proposal.summary.pricing.entry.toLocaleString()}\n• **Mid-Tier:** ${data.proposal.summary.pricing.mid.toLocaleString()}\n• **Premium:** ${data.proposal.summary.pricing.premium.toLocaleString()}\n\n**Documents Ready:**\n✅ Professional proposal document\n✅ Detailed Bill of Materials\n✅ 3-tier pricing analysis\n✅ Implementation timeline\n✅ Compliance verification\n\n**Next Steps:**\n1. Review proposal with your team\n2. Present to client within 2 business days\n3. Use project tracking for implementation\n\nYour systematic discovery ensures this proposal addresses every client requirement!`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, successMessage]);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
      
    } catch (error) {
      console.error('Document generation failed:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: "❌ **PROPOSAL GENERATION ENCOUNTERED AN ISSUE**\n\nDon't worry - your discovery session data is preserved. You can:\n\n1. Try generating the proposal again\n2. Export your discovery notes manually\n3. Contact support for assistance\n\nAll the client requirements you've captured are still available for manual proposal creation.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const ProgressIndicator = () => {
    const steps = [
      { key: 'who', label: 'WHO', completed: sessionData.discoveryProgress.who.completed },
      { key: 'what', label: 'WHAT', completed: sessionData.discoveryProgress.what.completed },
      { key: 'when', label: 'WHEN', completed: sessionData.discoveryProgress.when.completed },
      { key: 'where', label: 'WHERE', completed: sessionData.discoveryProgress.where.completed },
      { key: 'why', label: 'WHY', completed: sessionData.discoveryProgress.why.completed },
      { key: 'how', label: 'HOW', completed: sessionData.discoveryProgress.how.completed },
      { key: 'compliance', label: 'COMPLIANCE', completed: sessionData.discoveryProgress.compliance.completed }
    ];

    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Discovery Progress</h3>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step.completed ? 'bg-green-500 text-white' : 'bg-white/20 text-white/60'
              }`}>
                {step.completed ? '✓' : index + 1}
              </div>
              <span className={`text-sm ${step.completed ? 'text-green-300' : 'text-white/60'}`}>
                {step.label}
              </span>
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
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
              {/* Messages */}
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

              {/* Input */}
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

          {/* Progress & Actions */}
          <div className="space-y-6">
            <ProgressIndicator />
            
            {/* Client Info */}
            {sessionData.companyName && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Client Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Company:</span>
                    <span className="text-white">{sessionData.companyName}</span>
                  </div>
                  {sessionData.facilityType && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Facility:</span>
                      <span className="text-white">{sessionData.facilityType}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/60">Phase:</span>
                    <span className="text-white capitalize">{sessionData.currentPhase.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {sessionData.currentPhase === 'documentation_ready' && (
                <button
                  onClick={generateDocuments}
                  disabled={isTyping}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FileText className="w-5 h-5" />
                  Generate Professional Proposal
                </button>
              )}
              
              {sessionData.documentsGenerated.length > 0 && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Documents Ready
                  </h4>
                  <div className="space-y-2">
                    {sessionData.documentsGenerated.map(doc => (
                      <div key={doc} className="flex items-center justify-between text-sm">
                        <span className="text-green-200">{doc}</span>
                        <Download className="w-4 h-4 text-green-300 cursor-pointer hover:text-green-200" />
                      </div>
                    ))}
                  </div>
                  
                  {sessionData.proposalData && (
                    <div className="mt-4 pt-4 border-t border-green-500/30">
                      <h5 className="text-green-300 font-medium mb-2">Proposal Summary:</h5>
                      <div className="space-y-1 text-xs text-green-200">
                        <div>Cameras: {sessionData.proposalData.requirements.cameras}</div>
                        <div>Doors: {sessionData.proposalData.requirements.doors}</div>
                        <div className="font-medium">Investment Range:</div>
                        <div>${sessionData.proposalData.summary.pricing.entry.toLocaleString()} - ${sessionData.proposalData.summary.pricing.premium.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Benefits Reminder */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2">Why This Matters</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Systematic requirement capture</li>
                <li>• Nothing falls through cracks</li>
                <li>• Professional documentation</li>
                <li>• Higher close rates</li>
                <li>• Smoother implementations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratorDiscoveryAssistant;