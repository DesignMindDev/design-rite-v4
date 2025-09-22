'use client';

import { useState, useEffect } from 'react';

interface AuthData {
  email: string;
  company: string;
  timestamp: number;
  expiresAt: number;
}

const AUTH_CACHE_KEY = 'design_rite_auth';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const useAuthCache = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthData | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkAuthentication();
    }
  }, []);

  const checkAuthentication = () => {
    try {
      const cached = localStorage.getItem(AUTH_CACHE_KEY);
      if (cached) {
        const data: AuthData = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now < data.expiresAt) {
          setAuthData(data);
          setIsAuthenticated(true);
          return true;
        } else {
          // Cache expired, remove it
          localStorage.removeItem(AUTH_CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('Error checking authentication cache:', error);
      localStorage.removeItem(AUTH_CACHE_KEY);
    }

    setIsAuthenticated(false);
    setAuthData(null);
    return false;
  };

  const saveAuthentication = (email: string, company: string) => {
    try {
      const now = Date.now();
      const data: AuthData = {
        email,
        company,
        timestamp: now,
        expiresAt: now + CACHE_DURATION
      };

      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(data));
      setAuthData(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving authentication cache:', error);
    }
  };

  const clearAuthentication = () => {
    try {
      localStorage.removeItem(AUTH_CACHE_KEY);
      setIsAuthenticated(false);
      setAuthData(null);
    } catch (error) {
      console.error('Error clearing authentication cache:', error);
    }
  };

  const extendSession = () => {
    if (authData) {
      const now = Date.now();
      const updatedData: AuthData = {
        ...authData,
        expiresAt: now + CACHE_DURATION
      };

      try {
        localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(updatedData));
        setAuthData(updatedData);
      } catch (error) {
        console.error('Error extending session:', error);
      }
    }
  };

  return {
    isAuthenticated,
    authData,
    checkAuthentication,
    saveAuthentication,
    clearAuthentication,
    extendSession
  };
};