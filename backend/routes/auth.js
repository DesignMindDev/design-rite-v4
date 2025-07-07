const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { createClient } = require("@supabase/supabase-js")
const router = express.Router()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, companyName, firstName, lastName } = req.body

    // Validate input
    if (!email || !password || !companyName) {
      return res.status(400).json({
        error: "Email, password, and company name are required",
      })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          password_hash: hashedPassword,
          company_name: companyName,
          first_name: firstName,
          last_name: lastName,
          subscription_tier: "trial",
          trial_assessments_remaining: 3,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return res.status(500).json({ error: "Failed to create user" })
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.company_name,
        subscriptionTier: user.subscription_tier,
        trialAssessmentsRemaining: user.trial_assessments_remaining,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Get user from database
    const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.company_name,
        subscriptionTier: user.subscription_tier,
        trialAssessmentsRemaining: user.trial_assessments_remaining,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
}

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, company_name, subscription_tier, trial_assessments_remaining, created_at")
      .eq("id", req.user.userId)
      .single()

    if (error || !user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        companyName: user.company_name,
        subscriptionTier: user.subscription_tier,
        trialAssessmentsRemaining: user.trial_assessments_remaining,
        createdAt: user.created_at,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
module.exports.verifyToken = verifyToken
