/**
 * Environment Variable Validation
 * Validates all required environment variables are present at startup
 * Prevents runtime crashes due to missing configuration
 */

interface EnvConfig {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;

  // Next-Auth
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;

  // OpenAI
  OPENAI_API_KEY: string;
  ASSESSMENT_ASSISTANT_ID?: string; // Optional - may use default

  // Optional integrations
  CALENDLY_WEBHOOK_SECRET?: string;
  SLACK_WEBHOOK_URL?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

const REQUIRED_ENV_VARS: (keyof EnvConfig)[] = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'OPENAI_API_KEY',
];

const OPTIONAL_ENV_VARS: (keyof EnvConfig)[] = [
  'ASSESSMENT_ASSISTANT_ID',
  'CALENDLY_WEBHOOK_SECRET',
  'SLACK_WEBHOOK_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
];

/**
 * Validates environment variables on application startup
 * @throws Error if required variables are missing
 */
export function validateEnv(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  // Check optional variables
  for (const varName of OPTIONAL_ENV_VARS) {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  }

  // Log warnings for optional variables
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Optional environment variables not set:', warnings.join(', '));
    console.warn('   Some features may be disabled.');
  }

  // Throw error if required variables are missing
  if (missing.length > 0) {
    const errorMessage = `
❌ FATAL: Missing required environment variables:
${missing.map(v => `   - ${v}`).join('\n')}

Please add these to your .env.local file.
See .env.example for reference.
    `.trim();

    throw new Error(errorMessage);
  }

  // Validate URL formats
  try {
    new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid URL');
  }

  try {
    new URL(process.env.NEXTAUTH_URL!);
  } catch {
    throw new Error('NEXTAUTH_URL must be a valid URL');
  }

  // Validate API key formats
  if (!process.env.OPENAI_API_KEY!.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY must start with "sk-"');
  }

  if (process.env.SUPABASE_SERVICE_KEY && !process.env.SUPABASE_SERVICE_KEY.startsWith('eyJ')) {
    console.warn('⚠️  SUPABASE_SERVICE_KEY format looks incorrect (should start with "eyJ")');
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Environment variables validated successfully');
  }
}

/**
 * Get typed environment configuration
 */
export function getEnv(): EnvConfig {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    ASSESSMENT_ASSISTANT_ID: process.env.ASSESSMENT_ASSISTANT_ID,
    CALENDLY_WEBHOOK_SECRET: process.env.CALENDLY_WEBHOOK_SECRET,
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  };
}
