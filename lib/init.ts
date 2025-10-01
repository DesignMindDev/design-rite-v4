/**
 * Application Initialization
 * Run validation and setup on server startup
 */

import { validateEnv } from './env-validation';

// Validate environment variables immediately on import
if (typeof window === 'undefined') {
  // Server-side only
  try {
    validateEnv();
  } catch (error) {
    console.error(error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); // Fail fast in production
    }
  }
}

export { validateEnv };
