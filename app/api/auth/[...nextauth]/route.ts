/**
 * Next-Auth.js API Route Handler
 * Handles all authentication requests for Design-Rite v3 admin system
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
