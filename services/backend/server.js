const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize Claude AI
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/assessments", require("./routes/assessments"));
app.use("/api/subscriptions", require("./routes/subscriptions"));
app.use("/api/admin", require("./routes/admin"));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ai_status: process.env.CLAUDE_API_KEY ? 'configured' : 'missing'
  });
});

// Claude AI Security Assessment Function
async function analyzeSecurityWithClaude(facilityData, assessmentType) {
  try {
    const prompt = `You are an expert security consultant with 20+ years of experience. Analyze this facility and provide a comprehensive security assessment.

FACILITY INFORMATION:
${JSON.stringify(facilityData, null, 2)}

ASSESSMENT TYPE: ${assessmentType}

Please provide a detailed security assessment including:

1. SECURITY VULNERABILITIES
   - Physical security gaps
   - Access control weaknesses
   - Surveillance blind spots
   - Environmental risks

2. THREAT ANALYSIS
   - Potential security threats
   - Risk probability and impact
   - Vulnerability exploitation scenarios

3. SECURITY RECOMMENDATIONS
   - Physical security improvements
   - Technology solutions (cameras, access control, alarms)
   - Procedural enhancements
   - Budget considerations

4. IMPLEMENTATION TIMELINE
   - Immediate actions (0-30 days)
   - Short-term improvements (1-6 months)
   - Long-term strategic enhancements (6+ months)

5. PROFESSIONAL SUMMARY
   - Executive summary for stakeholders
   - ROI justification for security investments
   - Compliance considerations

Format your response as a professional security consultant would present to a client. Be specific, actionable, and include estimated costs where appropriate.`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return {
      analysis: message.content[0].text,
      confidence: 0.95,
      assessment_id: `assess_${Date.now()}`,
      facility_type: facilityData.type || 'general',
      recommendations_count: 5,
      estimated_implementation_time: '3-6 months'
    };

  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('AI analysis failed: ' + error.message);
  }
}

// AI Security Assessment Endpoint
app.post('/api/assessments/analyze', async (req, res) => {
  try {
    const { facilityData, assessmentType } = req.body;
    
    // Validate input
    if (!facilityData || !assessmentType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: facilityData and assessmentType'
      });
    }

    // Call Claude AI for analysis
    const aiAssessment = await analyzeSecurityWithClaude(facilityData, assessmentType);
    
    res.json({
      success: true,
      assessment: aiAssessment,
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    });
  } catch (error) {
    console.error('AI Assessment Error:', error);
    res.status(500).json({
      success: false,
      error: 'Assessment failed: ' + error.message
    });
  }
});

// AI Chat Endpoint for Security Expert
app.post('/api/chat/security-expert', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const expertPrompt = `You are a professional security consultant with extensive experience in physical security, access control, surveillance systems, and risk assessment. 

User Question: ${message}

Context: ${context ? JSON.stringify(context) : 'No additional context provided'}

Provide a helpful, professional response as a security expert would. Be specific, actionable, and include relevant recommendations or solutions.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.4,
      messages: [
        {
          role: "user",
          content: expertPrompt
        }
      ]
    });

    res.json({
      success: true,
      response: response.content[0].text,
      timestamp: new Date().toISOString(),
      expert: 'AI Security Consultant'
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      error: 'Chat service unavailable'
    });
  }
});

// Test AI Connection Endpoint
app.get('/api/ai/test', async (req, res) => {
  try {
    const testMessage = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: "Respond with 'AI Security Expert Online' to confirm connection."
        }
      ]
    });

    res.json({
      success: true,
      message: testMessage.content[0].text,
      status: 'AI connected and operational'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'AI connection failed: ' + error.message
    });
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Design-Rite Backend running on port ${PORT}`);
  console.log(`🧠 AI Security Expert: ${process.env.CLAUDE_API_KEY ? 'Ready' : 'Not configured'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});