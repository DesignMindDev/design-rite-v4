'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Sparkles, Shield, Zap, Clock, CheckCircle } from 'lucide-react';
import EmailGate from '../components/EmailGate';
import { authHelpers } from '@/lib/supabase';
import { sessionManager } from '../../lib/sessionManager';

export default function PlatformAccessPage() {
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check Supabase authentication
        const user = await authHelpers.getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          // Redirect authenticated users directly
          window.location.href = '/estimate-options';
          return;
        }

        // Check for existing guest session
        const existingUser = sessionManager.getCurrentUser();
        if (existingUser && existingUser.email && existingUser.company) {
          setIsAuthenticated(true);
          // Redirect guests with valid sessions directly
          window.location.href = '/estimate-options';
          return;
        }

        setIsAuthenticated(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleReturningUser = () => {
    setIsReturningUser(true);
    setShowEmailGate(true);
  };

  const handleNewUser = () => {
    setIsReturningUser(false);
    setShowEmailGate(true);
  };

  const handleEmailGateSuccess = () => {
    setShowEmailGate(false);
    // Magic link will handle redirect or guest session will be created
    window.location.href = '/estimate-options';
  };

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"></div>

      {/* Header */}
      <nav className="relative z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
                DR
              </div>
              Design-Rite
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-600/20 rounded-full px-6 py-2 mb-6">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium">Secure Platform Access</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
            Welcome to Design-Rite
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Access our AI-powered security design platform. Choose your path below to get started with professional security assessments and proposals.
          </p>

          {/* Platform Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>AI-Powered Assessments</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Professional Proposals</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Live Pricing Data</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Compliance Ready</span>
            </div>
          </div>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Returning User Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl transition-all group-hover:blur-2xl"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:border-purple-600/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-600/25">

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Returning Guest</h3>
                  <p className="text-purple-300 font-medium">Welcome back!</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Already have an account or used our platform before? Sign in to continue with your existing projects and maintain your user profile.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Continue with existing projects</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Maintain your user profile</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Quick email verification</span>
                </div>
              </div>

              <button
                onClick={handleReturningUser}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-purple-800 transition-all hover:scale-105 shadow-lg hover:shadow-purple-600/30"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* New User Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl transition-all group-hover:blur-2xl"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-xl border border-blue-600/20 rounded-2xl p-8 hover:border-blue-600/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/25">

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">New to Design-Rite</h3>
                  <p className="text-blue-300 font-medium">Start exploring!</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                First time here? Perfect! Get started with our AI-powered security platform. No complex setup required - just enter your details and begin.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>5-minute quick start</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>AI-powered recommendations</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>No commitment required</span>
                </div>
              </div>

              <button
                onClick={handleNewUser}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all hover:scale-105 shadow-lg hover:shadow-blue-600/30"
              >
                Try Platform
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-16">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>FERPA, HIPAA, CJIS Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>3,000+ Products Database</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Gate Modal */}
      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  );
}