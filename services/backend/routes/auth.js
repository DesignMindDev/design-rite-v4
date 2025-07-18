const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");
const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Health check for auth service
router.get("/health", (req, res) => {
  res.json({ 
    status: "Auth service healthy",
    timestamp: new Date().toISOString()
  });
});

// REGISTER ENDPOINT
router.post("/register", async (req, res) => {
  try {
    const { email, password, companyName, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !companyName) {
      return res.status(400).json({ 
        error: "Email, password, and company name are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters" 
      });
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({ 
        error: "User with this email already exists" 
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email: email.toLowerCase(),
          password_hash: passwordHash,
          company_name: companyName,
          first_name: firstName || null,
          last_name: lastName || null,
          subscription_tier: "trial",
          trial_assessments_remaining: 3,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return res.status(500).json({ 
        error: "Failed to create user account" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        companyName: newUser.company_name 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        companyName: newUser.company_name,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        subscriptionTier: newUser.subscription_tier,
        trialAssessmentsRemaining: newUser.trial_assessments_remaining
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      error: "Registration failed. Please try again." 
    });
  }
});

// LOGIN ENDPOINT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Find user in database
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (userError || !user) {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ 
        error: "Account is deactivated. Please contact support." 
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }

    // Update last login
    await supabase
      .from("users")
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        companyName: user.company_name 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.company_name,
        firstName: user.first_name,
        lastName: user.last_name,
        subscriptionTier: user.subscription_tier,
        trialAssessmentsRemaining: user.trial_assessments_remaining
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      error: "Login failed. Please try again." 
    });
  }
});

// DEMO LOGIN ENDPOINT
router.post("/demo", async (req, res) => {
  try {
    // Check if demo user exists, create if not
    let { data: demoUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "demo@design-rite.com")
      .single();

    if (findError && findError.code === 'PGRST116') {
      // Demo user doesn't exist, create it
      const demoPassword = await bcrypt.hash("demo123", 12);
      
      const { data: newDemoUser, error: createError } = await supabase
        .from("users")
        .insert([
          {
            email: "demo@design-rite.com",
            password_hash: demoPassword,
            company_name: "Demo Company",
            first_name: "Demo",
            last_name: "User",
            subscription_tier: "trial",
            trial_assessments_remaining: 3,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error("Failed to create demo user:", createError);
        return res.status(500).json({ 
          error: "Failed to setup demo account" 
        });
      }

      demoUser = newDemoUser;
    } else if (findError) {
      console.error("Demo user lookup error:", findError);
      return res.status(500).json({ 
        error: "Demo access unavailable" 
      });
    }

    // Update last login for demo user
    await supabase
      .from("users")
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", demoUser.id);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: demoUser.id, 
        email: demoUser.email,
        companyName: demoUser.company_name 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response
    res.json({
      success: true,
      message: "Demo login successful",
      token,
      user: {
        id: demoUser.id,
        email: demoUser.email,
        companyName: demoUser.company_name,
        firstName: demoUser.first_name,
        lastName: demoUser.last_name,
        subscriptionTier: demoUser.subscription_tier,
        trialAssessmentsRemaining: demoUser.trial_assessments_remaining
      }
    });

  } catch (error) {
    console.error("Demo login error:", error);
    res.status(500).json({ 
      error: "Demo login failed. Please try again." 
    });
  }
});

// TOKEN VERIFICATION MIDDLEWARE (export for use in other routes)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

// PROFILE ENDPOINT (Protected)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, company_name, first_name, last_name, subscription_tier, trial_assessments_remaining, created_at, last_login")
      .eq("id", req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.company_name,
        firstName: user.first_name,
        lastName: user.last_name,
        subscriptionTier: user.subscription_tier,
        trialAssessmentsRemaining: user.trial_assessments_remaining,
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    });

  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;
module.exports.verifyToken = verifyToken;