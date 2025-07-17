const express = require("express");
const router = express.Router();

// Health check for auth service
router.get("/health", (req, res) => {
  res.json({ status: "Auth service healthy" });
});

// Placeholder auth routes
router.post("/login", (req, res) => {
  res.json({ message: "Login endpoint - to be implemented" });
});

router.post("/register", (req, res) => {
  res.json({ message: "Register endpoint - to be implemented" });
});

module.exports = router;
