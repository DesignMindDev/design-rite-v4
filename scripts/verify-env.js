#!/usr/bin/env node

/**
 * Environment Variable Verification Script
 * Checks all required environment variables for production deployment
 *
 * Usage: node scripts/verify-env.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Load .env.local if it exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log(`${colors.blue}ℹ Loading environment from .env.local${colors.reset}\n`);
  require('dotenv').config({ path: envPath });
} else {
  console.log(`${colors.yellow}⚠ No .env.local file found, checking system environment${colors.reset}\n`);
}

// Required environment variables
const requiredVars = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL',
    critical: true,
    example: 'https://xxxxxxxxxxxxx.supabase.co'
  },
  {
    name: 'SUPABASE_SERVICE_KEY',
    description: 'Supabase service role key (secret)',
    critical: true,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    sensitive: true
  },
  {
    name: 'ANTHROPIC_API_KEY',
    description: 'Claude API key for AI assistant',
    critical: true,
    example: 'sk-ant-api03-...',
    sensitive: true
  },
  {
    name: 'OPENAI_API_KEY',
    description: 'OpenAI API key for GPT-4 Vision (Spatial Studio)',
    critical: true,
    example: 'sk-proj-...',
    sensitive: true
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    description: 'Production app URL (required for async workers)',
    critical: true,
    example: 'https://www.design-rite.com'
  },
  {
    name: 'NEXT_PUBLIC_HARVESTER_API_URL',
    description: 'Harvester API URL for product intelligence',
    critical: true,
    example: 'https://harvester.design-rite.com'
  }
];

// Optional but recommended environment variables
const optionalVars = [
  {
    name: 'GOOGLE_API_KEY',
    description: 'Google Gemini API key (tertiary AI failover)',
    example: 'AIzaSy...'
  },
  {
    name: 'SENTRY_DSN',
    description: 'Sentry error tracking DSN',
    example: 'https://xxxxx@sentry.io/xxxxx'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anon/public key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  {
    name: 'STRIPE_SECRET_KEY',
    description: 'Stripe secret key for payments',
    example: 'sk_test_... or sk_live_...'
  }
];

// Verification results
let results = {
  passed: 0,
  failed: 0,
  optional: 0,
  warnings: []
};

console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.cyan}   ENVIRONMENT VARIABLE VERIFICATION${colors.reset}`);
console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

// Check required variables
console.log(`${colors.cyan}CRITICAL VARIABLES:${colors.reset}\n`);

requiredVars.forEach(variable => {
  const value = process.env[variable.name];
  const isSet = !!value && value !== '';

  if (isSet) {
    results.passed++;
    const displayValue = variable.sensitive
      ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
      : value;

    console.log(`${colors.green}✓${colors.reset} ${variable.name}`);
    console.log(`  ${colors.blue}→${colors.reset} ${variable.description}`);
    console.log(`  ${colors.blue}→${colors.reset} Value: ${displayValue}\n`);
  } else {
    results.failed++;
    console.log(`${colors.red}✗${colors.reset} ${variable.name} ${colors.red}MISSING${colors.reset}`);
    console.log(`  ${colors.blue}→${colors.reset} ${variable.description}`);
    console.log(`  ${colors.yellow}→${colors.reset} Example: ${variable.example}\n`);
  }
});

// Check optional variables
console.log(`${colors.cyan}OPTIONAL VARIABLES:${colors.reset}\n`);

optionalVars.forEach(variable => {
  const value = process.env[variable.name];
  const isSet = !!value && value !== '';

  if (isSet) {
    results.optional++;
    console.log(`${colors.green}✓${colors.reset} ${variable.name}`);
    console.log(`  ${colors.blue}→${colors.reset} ${variable.description}\n`);
  } else {
    console.log(`${colors.yellow}○${colors.reset} ${variable.name} (not set)`);
    console.log(`  ${colors.blue}→${colors.reset} ${variable.description}`);
    console.log(`  ${colors.yellow}→${colors.reset} Example: ${variable.example}\n`);
  }
});

// Validation checks
console.log(`${colors.cyan}VALIDATION CHECKS:${colors.reset}\n`);

// Check Supabase URL format
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co')) {
    console.log(`${colors.green}✓${colors.reset} Supabase URL format valid\n`);
  } else {
    results.warnings.push('Supabase URL does not appear to be a valid Supabase URL');
    console.log(`${colors.yellow}⚠${colors.reset} Supabase URL format may be incorrect\n`);
  }
}

// Check App URL format
if (process.env.NEXT_PUBLIC_APP_URL) {
  if (process.env.NEXT_PUBLIC_APP_URL.startsWith('http')) {
    console.log(`${colors.green}✓${colors.reset} App URL format valid\n`);
  } else {
    results.warnings.push('App URL should start with http:// or https://');
    console.log(`${colors.yellow}⚠${colors.reset} App URL should start with http:// or https://\n`);
  }
}

// Check for localhost in production URLs
if (process.env.NODE_ENV === 'production') {
  if (process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')) {
    results.warnings.push('Production App URL should not use localhost');
    console.log(`${colors.red}✗${colors.reset} Production App URL uses localhost!\n`);
  }
  if (process.env.NEXT_PUBLIC_HARVESTER_API_URL?.includes('localhost')) {
    results.warnings.push('Production Harvester URL should not use localhost');
    console.log(`${colors.red}✗${colors.reset} Production Harvester URL uses localhost!\n`);
  }
}

// Summary
console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.cyan}   SUMMARY${colors.reset}`);
console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

console.log(`${colors.green}✓${colors.reset} Required variables set: ${results.passed}/${requiredVars.length}`);
console.log(`${colors.yellow}○${colors.reset} Optional variables set: ${results.optional}/${optionalVars.length}`);

if (results.failed > 0) {
  console.log(`${colors.red}✗${colors.reset} Missing required variables: ${results.failed}\n`);
}

if (results.warnings.length > 0) {
  console.log(`\n${colors.yellow}⚠ WARNINGS:${colors.reset}`);
  results.warnings.forEach(warning => {
    console.log(`  ${colors.yellow}→${colors.reset} ${warning}`);
  });
}

console.log('\n');

// Exit code
if (results.failed > 0) {
  console.log(`${colors.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.red}   ✗ VERIFICATION FAILED${colors.reset}`);
  console.log(`${colors.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  console.log(`Missing ${results.failed} required environment variable(s).`);
  console.log(`Please add them to your .env.local file or production environment.\n`);
  process.exit(1);
} else {
  console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.green}   ✓ VERIFICATION PASSED${colors.reset}`);
  console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  console.log(`All required environment variables are configured!\n`);

  if (results.warnings.length > 0) {
    console.log(`${colors.yellow}⚠ You have ${results.warnings.length} warning(s) to review.${colors.reset}\n`);
  }

  process.exit(0);
}
