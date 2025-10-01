/**
 * Next-Auth.js Configuration for Design-Rite v3 Admin System
 * Implements role-based authentication with Supabase backend
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

// Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Extended user type with role and access code
 */
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    accessCode?: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    accessCode?: string;
  }
}

/**
 * Next-Auth Configuration
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        try {
          // Get user from database
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email.toLowerCase())
            .single();

          if (error || !user) {
            // Log failed attempt without user_id
            await supabase.from('activity_logs').insert({
              user_id: null,
              action: 'failed_login',
              success: false,
              details: { email: credentials.email, reason: 'User not found' }
            });
            throw new Error('Invalid email or password');
          }

          // Check if account is active
          if (user.status !== 'active') {
            await supabase.from('activity_logs').insert({
              user_id: user.id,
              action: 'failed_login',
              success: false,
              details: { email: credentials.email, reason: `Account status: ${user.status}` }
            });
            throw new Error(`Account is ${user.status}`);
          }

          // Verify password
          const isValid = await compare(credentials.password, user.password_hash);

          if (!isValid) {
            // Increment failed login attempts
            const failedAttempts = (user.failed_login_attempts || 0) + 1;
            await supabase
              .from('users')
              .update({ failed_login_attempts: failedAttempts })
              .eq('id', user.id);

            // Log failed attempt
            await supabase.from('activity_logs').insert({
              user_id: user.id,
              action: 'failed_login',
              success: false,
              details: {
                email: credentials.email,
                reason: 'Invalid password',
                failed_attempts: failedAttempts
              }
            });

            // Suspend account after 5 failed attempts
            if (failedAttempts >= 5) {
              await supabase
                .from('users')
                .update({ status: 'suspended', notes: 'Auto-suspended: Too many failed login attempts' })
                .eq('id', user.id);
              throw new Error('Account suspended due to too many failed login attempts. Contact admin.');
            }

            throw new Error('Invalid email or password');
          }

          // Update login count and last login
          await supabase
            .from('users')
            .update({
              last_login: new Date().toISOString(),
              login_count: (user.login_count || 0) + 1,
              failed_login_attempts: 0
            })
            .eq('id', user.id);

          // Log successful login
          await supabase.from('activity_logs').insert({
            user_id: user.id,
            action: 'login',
            success: true,
            details: { email: credentials.email }
          });

          // Return user object for session
          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            role: user.role,
            accessCode: user.access_code
          };
        } catch (error) {
          console.error('Authentication error:', error);
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Authentication failed');
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Add role and access code to token on initial sign in
      if (user) {
        token.role = user.role;
        token.accessCode = user.accessCode;
      }
      return token;
    },

    async session({ session, token }) {
      // Add role and access code to session
      if (session.user) {
        session.user.role = token.role as string;
        session.user.accessCode = token.accessCode as string;
      }
      return session;
    }
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Update session every hour
  },

  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
};
