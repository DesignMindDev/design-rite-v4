'use client';

import React from 'react';
import Link from 'next/link';
import { X, TrendingUp, Zap, Check, ArrowRight } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
  currentTier?: string;
  usage?: {
    assessments_used: number;
    projects_created: number;
    storage_used_gb: number;
  };
  limits?: {
    assessments_per_month: number;
    projects_per_month: number;
    storage_gb: number;
  };
}

export default function UpgradeModal({
  isOpen,
  onClose,
  reason,
  currentTier = 'trial',
  usage,
  limits
}: UpgradeModalProps) {
  if (!isOpen) return null;

  const getRecommendedPlan = () => {
    if (currentTier === 'trial' || currentTier === 'starter') {
      return 'professional';
    }
    return 'enterprise';
  };

  const recommendedPlan = getRecommendedPlan();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl border border-purple-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-600/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Upgrade Required</h2>
                <p className="text-gray-400 text-sm">Unlock unlimited assessments and premium features</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Limit Reached Message */}
          {reason && (
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-orange-300 font-medium">Usage Limit Reached</p>
                  <p className="text-gray-400 text-sm mt-1">{reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Current Usage Stats */}
          {usage && limits && (
            <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/30">
              <h3 className="text-white font-semibold mb-3">Your Current Usage ({currentTier})</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Assessments</span>
                    <span className="text-white font-medium">
                      {usage.assessments_used} / {limits.assessments_per_month === -1 ? '∞' : limits.assessments_per_month}
                    </span>
                  </div>
                  {limits.assessments_per_month !== -1 && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((usage.assessments_used / limits.assessments_per_month) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recommended Plan */}
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-2 border-purple-500/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white capitalize">{recommendedPlan} Plan</h3>
                <p className="text-gray-400 text-sm">Recommended for your needs</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  ${recommendedPlan === 'professional' ? '199' : '499'}
                  <span className="text-sm text-gray-400 ml-1">/mo</span>
                </div>
                <p className="text-green-400 text-sm">7-day free trial</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {recommendedPlan === 'professional' ? (
                <>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Unlimited security assessments</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>All AI tools (Quick, Discovery, Assistant)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>3 team members</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Everything in Professional</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Unlimited team members</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>White-label options</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>SSO/SAML authentication</span>
                  </li>
                </>
              )}
            </ul>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Link
                href="/upgrade"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                Upgrade to {recommendedPlan}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>

          {/* Compare Plans Link */}
          <div className="text-center">
            <Link
              href="/pricing"
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Compare all plans →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
