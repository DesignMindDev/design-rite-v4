'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Send, FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportedEstimateData {
  projectId: string;
  timestamp: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  projectDetails: {
    facilityType: string;
    squareFootage: number;
    deviceCounts: {
      camerasIndoor: number;
      camerasOutdoor: number;
      accessControlDoors: number;
      motionSensors: number;
    };
    complexity: string;
  };
  estimateResults: {
    equipmentCost: number;
    laborCost: number;
    materialsCost: number;
    totalCost: number;
    lowEstimate: number;
    highEstimate: number;
  };
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function EnhancedAIAssessment() {
  const searchParams = useSearchParams();
  const isImport = searchParams.get('import') === 'true';
  const projectId = searchParams.get('projectId');

  const [isImported, setIsImported] = useState(false);
  const [importedData, setImportedData] = useState<ImportedEstimateData | null>(null);
  const [currentPhase, setCurrentPhase] = useState<'import-welcome' | 'chat' | 'results'>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [qualificationScore, setQualificationScore] = useState(0);

  // Handle import on component mount
  useEffect(() => {
    if (isImport && projectId) {
      handleImportData();
    }
  }, [isImport, projectId]);

  const handleImportData = () => {
    try {
      const importedDataString = sessionStorage.getItem('estimateData');
      if (!importedDataString) {
        console.warn('No estimate data found to import');
        return;
      }

      const data: ImportedEstimateData = JSON.parse(importedDataString);
      setImportedData(data);
      setIsImported(true);
      setCurrentPhase('import-welcome');
      
      // Calculate qualification score
      const score = calculateImportQualificationScore(data);
      setQualificationScore(score);

      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'assistant',
        content: generateImportWelcomeMessage(data),
        timestamp: new Date().toISOString(),
      };

      setChatMessages([welcomeMessage]);
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  const calculateImportQualificationScore = (data: ImportedEstimateData): number => {
    let score = 40; // Base score for having estimate data
    
    if (data.customerInfo.email && data.customerInfo.name) score += 20;
    if (data.customerInfo.company) score += 10;
    if (data.projectDetails.squareFootage > 10000) score += 15;
    
    const totalDevices = Object.values(data.projectDetails.deviceCounts).reduce((sum, count) => sum + count, 0);
    if (totalDevices > 10) score += 15;
    
    return Math.min(score, 100);
  };

  const generateImportWelcomeMessage = (data: ImportedEstimateData): string => {
    const totalDevices = Object.values(data.projectDetails.deviceCounts).reduce((sum, count) => sum + count, 0);
    const deviceSummary = [];
    
    if (data.projectDetails.deviceCounts.camerasIndoor > 0) {
      deviceSummary.push(`${data.projectDetails.deviceCounts.camerasIndoor} indoor cameras`);
    }
    if (data.projectDetails.deviceCounts.camerasOutdoor > 0) {
      deviceSummary.push(`${data.projectDetails.deviceCounts.camerasOutdoor} outdoor cameras`);
    }
    if (data.projectDetails.deviceCounts.accessControlDoors > 0) {
      deviceSummary.push(`${data.projectDetails.deviceCounts.accessControlDoors} access control doors`);
    }

    return `🎯 **Continuing Your Security Assessment**

I have your project details from the cost estimator:

**Project Overview:**
- ${data.projectDetails.facilityType.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())} facility
- ${data.projectDetails.squareFootage.toLocaleString()} square feet
- ${totalDevices} total security devices planned
- Budget range: $${data.estimateResults.lowEstimate.toLocaleString()} - $${data.estimateResults.highEstimate.toLocaleString()}

**Equipment Summary:**
${deviceSummary.join(', ')}

Now let's dive deeper into your security requirements. I can help with:
- Detailed equipment specifications and compliance requirements
- Phased implementation planning
- Integration with existing systems
- ROI analysis and risk assessment

What specific aspects of your security system would you like to explore further?`;
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: chatInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsGeneratingResponse(true);

    try {
      // Enhanced context for imported sessions
      let context = '';
      if (isImported && importedData) {
        context = `
IMPORTED PROJECT CONTEXT:
- Customer: ${importedData.customerInfo.name} (${importedData.customerInfo.company || 'Individual'})
- Facility: ${importedData.projectDetails.facilityType}, ${importedData.projectDetails.squareFootage} sq ft
- Budget: $${importedData.estimateResults.lowEstimate.toLocaleString()} - $${importedData.estimateResults.highEstimate.toLocaleString()}
- Devices: ${JSON.stringify(importedData.projectDetails.deviceCounts)}
- Complexity: ${importedData.projectDetails.complexity}

The customer has already received a cost estimate and is now seeking detailed security assessment.
`;
      }

      // Call your existing API
      const response = await fetch('/api/ai-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          context: context,
          sessionId: projectId || `session_${Date.now()}`,
          importedData: importedData
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        const botMessage: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          type: 'assistant',
          content: result.response || result.message || 'I received your message and will provide detailed security recommendations.',
          timestamp: new Date().toISOString(),
        };

        setChatMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Provide contextual fallback response
      let fallbackResponse = "I apologize, but I'm having trouble connecting to the AI service right now.";
      
      if (isImported && importedData) {
        fallbackResponse = `Based on your ${importedData.projectDetails.facilityType} project with a budget of $${importedData.estimateResults.lowEstimate.toLocaleString()}-$${importedData.estimateResults.highEstimate.toLocaleString()}, I recommend focusing on:

1. **NDAA Compliance**: Ensure all cameras meet Section 889 requirements
2. **Scalable Architecture**: Plan for future expansion
3. **Integration Strategy**: Connect with existing building systems
4. **Phased Implementation**: Start with perimeter security, then interior coverage

Would you like me to elaborate on any of these areas?`;
      }
      
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        type: 'assistant',
        content: fallbackResponse,
        timestamp: new Date().toISOString(),
      };

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  // Import Welcome Component
  if (currentPhase === 'import-welcome' && isImported && importedData) {
    const totalDevices = Object.values(importedData.projectDetails.deviceCounts).reduce((sum, count) => sum + count, 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
        {/* Header */}
        <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-6xl mx-auto px-8 py-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Design-Rite
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Continuing Your Security Assessment</h1>
            <p className="text-xl text-white/70">
              Great! I have your project details from the cost estimator. Let's dive deeper into your security requirements.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Project Summary */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-500" />
                Project Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Customer:</span>
                  <span className="font-semibold">{importedData.customerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Company:</span>
                  <span className="font-semibold">{importedData.customerInfo.company || 'Individual'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Facility Type:</span>
                  <span className="font-semibold capitalize">{importedData.projectDetails.facilityType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Square Footage:</span>
                  <span className="font-semibold">{importedData.projectDetails.squareFootage.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total Devices:</span>
                  <span className="font-semibold">{totalDevices}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Complexity:</span>
                  <span className="font-semibold capitalize">{importedData.projectDetails.complexity}</span>
                </div>
              </div>
            </div>

            {/* Budget & Equipment */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">$</span>
                Budget & Equipment
              </h2>
              <div className="mb-6">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  ${importedData.estimateResults.lowEstimate.toLocaleString()} - ${importedData.estimateResults.highEstimate.toLocaleString()}
                </div>
                <div className="text-white/70">Initial cost estimate</div>
              </div>
              <div className="space-y-3">
                {importedData.projectDetails.deviceCounts.camerasIndoor > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Indoor Cameras:</span>
                    <span className="font-semibold">{importedData.projectDetails.deviceCounts.camerasIndoor}</span>
                  </div>
                )}
                {importedData.projectDetails.deviceCounts.camerasOutdoor > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Outdoor Cameras:</span>
                    <span className="font-semibold">{importedData.projectDetails.deviceCounts.camerasOutdoor}</span>
                  </div>
                )}
                {importedData.projectDetails.deviceCounts.accessControlDoors > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Access Control Doors:</span>
                    <span className="font-semibold">{importedData.projectDetails.deviceCounts.accessControlDoors}</span>
                  </div>
                )}
                {importedData.projectDetails.deviceCounts.motionSensors > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Motion Sensors:</span>
                    <span className="font-semibold">{importedData.projectDetails.deviceCounts.motionSensors}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl border border-purple-500/30 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">🚀 Ready for Deep Dive Analysis?</h2>
            <p className="text-white/80 mb-6">
              Now that I have your basic requirements, I can provide detailed security analysis including:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>NDAA-compliant equipment specifications</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>Compliance & regulatory requirements</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>Phased implementation planning</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span>ROI analysis & risk assessment</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPhase('chat')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all text-lg"
              >
                Continue Assessment →
              </button>
              <button
                onClick={() => window.location.href = '/ai-assessment'}
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Start Fresh Discovery
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/70">
                Qualification Score: <span className="font-bold text-green-400">{qualificationScore}%</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat Phase
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Design-Rite
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold">
                  {isImported ? '🎯 Enhanced AI Security Assessment' : 'AI Security Assessment'}
                </h1>
                {isImported && importedData && (
                  <p className="text-white/70 mt-2">
                    Continuing analysis for {importedData.customerInfo.name} - {importedData.projectDetails.facilityType} project
                  </p>
                )}
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white/10 text-white'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isGeneratingResponse && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-white/60 text-sm ml-2">AI is analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-white/20 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isGeneratingResponse && sendChatMessage()}
                    placeholder={isImported ? "Ask about compliance, equipment specs, or implementation..." : "Ask about security requirements..."}
                    className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                    disabled={isGeneratingResponse}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || isGeneratingResponse}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Context Panel */}
          <div className="space-y-6">
            {/* Project Summary */}
            {isImported && importedData && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Import Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Customer:</span>
                    <span className="text-white text-right flex-1 ml-2">{importedData.customerInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Budget Range:</span>
                    <span className="text-white text-right flex-1 ml-2">
                      ${importedData.estimateResults.lowEstimate.toLocaleString()} - ${importedData.estimateResults.highEstimate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Facility:</span>
                    <span className="text-white capitalize text-right flex-1 ml-2">{importedData.projectDetails.facilityType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Qualification Score:</span>
                    <span className={`font-bold ${qualificationScore >= 75 ? 'text-green-400' : qualificationScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {qualificationScore}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => setChatInput("What NDAA-compliant cameras do you recommend for this project?")}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
                >
                  🔒 NDAA Compliance
                </button>
                <button 
                  onClick={() => setChatInput("Can you provide a phased implementation plan?")}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
                >
                  📋 Implementation Plan
                </button>
                <button 
                  onClick={() => setChatInput("What are the ROI and risk mitigation benefits?")}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
                >
                  💰 ROI Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
