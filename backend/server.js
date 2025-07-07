const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// Body parsing middleware
app.use(compression())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    services: {
      api: "operational",
      database: "connected",
      ai: "available",
    },
  })
})

// API Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/assessments", require("./routes/assessments"))
app.use("/api/subscriptions", require("./routes/subscriptions"))
app.use("/api/admin", require("./routes/admin"))

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
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
