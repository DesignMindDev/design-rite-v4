const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 8000

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.anthropic.com", "https://api.openai.com"],
      },
    },
  }),
)

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://design-rite.com", "https://app.design-rite.com"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
)

// Body parsing middleware
app.use(compression())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "3.0.0",
    services: {
      api: "operational",
      database: process.env.SUPABASE_URL ? "connected" : "not configured",
      ai: process.env.OPENAI_API_KEY ? "available" : "not configured",
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || "development",
      supabaseConfigured: !!process.env.SUPABASE_URL,
      openaiConfigured: !!process.env.OPENAI_API_KEY,
      claudeConfigured: !!process.env.CLAUDE_API_KEY,
    }
  })
})

// Simple AI Assessment Agent endpoint
app.get("/api/assessments/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "AI Assessment Agent",
    timestamp: new Date().toISOString(),
    ai_services: {
      openai: process.env.OPENAI_API_KEY ? "configured" : "not configured",
      claude: process.env.CLAUDE_API_KEY ? "configured" : "not configured",
      supabase: process.env.SUPABASE_URL ? "configured" : "not configured",
    },
  })
})

// Test endpoint for AI functionality
app.post("/api/assessments/test", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OpenAI API key not configured",
      })
    }

    const OpenAI = require("openai")
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Generate a brief security assessment summary for a small office building.",
        },
      ],
      max_tokens: 200,
    })

    res.json({
      success: true,
      message: "AI Assessment Agent is fully operational",
      sample_assessment: response.choices[0].message.content,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI test error:", error)
    res.status(500).json({
      success: false,
      error: "AI service test failed",
      details: error.message,
    })
  }
})

// API Routes (commented out problematic ones for now)
// app.use("/api/auth", require("./routes/auth"))
app.use("/api/assessments", require("./routes/assessments"))
// app.use("/api/subscriptions", require("./routes/subscriptions"))
// app.use("/api/admin", require("./routes/admin"))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON payload" })
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Design-Rite Backend running on port ${PORT}`)
  console.log(`🧠 AI Security Expert: ${process.env.OPENAI_API_KEY ? 'Ready' : 'Not configured'}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

module.exports = app
// Updated: 2025-07-10 17:32:05
