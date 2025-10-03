'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface UserStats {
  assessmentsUsed: number;
  assessmentLimit: number;
  plan: string;
  lastAssessment?: string;
}

export default function DashboardPage() {
  const { user, userCompany, isAuthenticated, loading, signOut } = useSupabaseAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/estimate-options');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Fetch subscription data from Supabase
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('tier, status, billing_period, current_period_end, next_billing_date')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .single();

      console.log('Subscription query result:', { subscription, error, userId: user.id });

      let plan = 'trial';
      let assessmentLimit = 3;

      if (subscription && !error) {
        console.log('Found subscription tier:', subscription.tier);
        plan = subscription.tier;
        // Set limits based on tier
        switch (subscription.tier) {
          case 'starter':
            assessmentLimit = 25;
            break;
          case 'professional':
          case 'enterprise':
            assessmentLimit = -1; // Unlimited
            break;
          default:
            assessmentLimit = 3;
        }
      }

      setUserStats({
        assessmentsUsed: 0, // TODO: Fetch actual usage from activity logs
        assessmentLimit,
        plan,
        lastAssessment: undefined
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      // Fall back to trial
      setUserStats({
        assessmentsUsed: 0,
        assessmentLimit: 3,
        plan: 'trial',
        lastAssessment: undefined
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleUpgrade = () => {
    router.push('/upgrade');
  };

  const handleNewAssessment = () => {
    router.push('/estimate-options');
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back!
              </h1>
              <p className="text-gray-600">
                <strong>Email:</strong> {user?.email}<br/>
                <strong>Company:</strong> {userCompany}<br/>
                <strong>Plan:</strong> <span className="capitalize font-semibold text-purple-600">{userStats?.plan || 'Trial'}</span>
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleNewAssessment}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
              >
                New Assessment
              </button>
              <button
                onClick={handleSignOut}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Usage Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Overview</h2>

              {statsLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ) : userStats ? (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Assessments Used</span>
                      <span className="font-semibold text-gray-900">
                        {userStats.assessmentsUsed} / {userStats.assessmentLimit === -1 ? '∞' : userStats.assessmentLimit}
                      </span>
                    </div>

                    {userStats.assessmentLimit !== -1 && (
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-purple-700 h-3 rounded-full transition-all"
                          style={{
                            width: `${Math.min((userStats.assessmentsUsed / userStats.assessmentLimit) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {userStats.plan === 'trial' && userStats.assessmentsUsed >= userStats.assessmentLimit && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-orange-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-orange-700 font-medium">Trial limit reached</p>
                          <p className="text-orange-600 text-sm">Upgrade to continue using unlimited assessments</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="font-semibold text-purple-900 mb-2">Total Assessments</h3>
                      <p className="text-2xl font-bold text-purple-600">{userStats.assessmentsUsed}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">Current Plan</h3>
                      <p className="text-2xl font-bold text-green-600 capitalize">{userStats.plan}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Unable to load usage statistics</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mb-4">No assessments yet</p>
                <button
                  onClick={handleNewAssessment}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Create your first assessment →
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Plan Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Plan Status</h3>

              {userStats?.plan === 'trial' ? (
                <div>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-blue-700 font-medium mb-2">Free Trial Active</p>
                    <p className="text-blue-600 text-sm">
                      {userStats.assessmentLimit - userStats.assessmentsUsed} assessments remaining
                    </p>
                  </div>

                  <button
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
                  >
                    Upgrade Now
                  </button>

                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Unlock unlimited assessments
                  </p>
                </div>
              ) : (
                <div>
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <p className="text-green-700 font-medium mb-2 capitalize">{userStats?.plan} Plan</p>
                    <p className="text-green-600 text-sm">Unlimited assessments</p>
                  </div>

                  <button
                    onClick={() => router.push('/account')}
                    className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Manage Billing
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={handleNewAssessment}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium text-gray-900">New Assessment</span>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/help')}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-gray-900">Help & Support</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}