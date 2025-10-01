'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Zap, FileSpreadsheet } from 'lucide-react';

export default function SystemSurveyorIntegration() {
  const [selectedMethod, setSelectedMethod] = useState<'excel' | 'api' | null>(null);
  const [apiToken, setApiToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleConnect = async () => {
    if (!apiToken.trim()) {
      setError('Please enter your API token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/system-surveyor/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: apiToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid API token');
      }

      // Store token temporarily (in production, use more secure storage)
      sessionStorage.setItem('ss_api_token', apiToken);

      // Redirect to import page
      router.push('/integrations/system-surveyor/import');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show method selection if none selected
  if (!selectedMethod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-purple-950/20 to-[#0A0A0A]">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  System Surveyor Integration
                </h1>
              </div>
              <p className="text-xl text-gray-300">
                Choose how you want to import your field surveys
              </p>
            </div>

            {/* Method Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Excel Upload Method */}
              <div
                onClick={() => router.push('/integrations/system-surveyor/upload')}
                className="bg-[#1A1A1A] border border-purple-500/30 rounded-xl p-8 hover:border-purple-500 transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Excel Upload</h3>
                  <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-xs font-semibold mb-4">
                    RECOMMENDED
                  </div>
                  <p className="text-gray-400 mb-6">
                    Upload System Surveyor Excel exports directly - no API setup required
                  </p>
                  <ul className="text-sm text-gray-300 space-y-2 mb-6 text-left w-full">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>No authentication needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>Instant processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>Works offline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>96 items processed (Patriot Auto demo)</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Excel File
                  </button>
                </div>
              </div>

              {/* API Integration Method */}
              <div
                onClick={() => setSelectedMethod('api')}
                className="bg-[#1A1A1A] border border-purple-500/30 rounded-xl p-8 hover:border-purple-500 transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">API Connection</h3>
                  <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-400 text-xs font-semibold mb-4">
                    ADVANCED
                  </div>
                  <p className="text-gray-400 mb-6">
                    Direct API connection to your System Surveyor account
                  </p>
                  <ul className="text-sm text-gray-300 space-y-2 mb-6 text-left w-full">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">✓</span>
                      <span>Real-time sync</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">✓</span>
                      <span>Automatic updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">✓</span>
                      <span>Multi-site management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">✓</span>
                      <span>Requires API token</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    Connect API
                  </button>
                </div>
              </div>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-[#1A1A1A] border border-purple-500/20 rounded-lg text-center hover:border-purple-500/40 transition-colors">
                <div className="text-4xl mb-3">⚡</div>
                <div className="text-lg font-semibold text-purple-400 mb-1">90% Faster</div>
                <div className="text-sm text-gray-400">Proposal generation time</div>
              </div>
              <div className="p-6 bg-[#1A1A1A] border border-purple-500/20 rounded-lg text-center hover:border-purple-500/40 transition-colors">
                <div className="text-4xl mb-3">🎯</div>
                <div className="text-lg font-semibold text-purple-400 mb-1">100% Accurate</div>
                <div className="text-sm text-gray-400">Direct field data import</div>
              </div>
              <div className="p-6 bg-[#1A1A1A] border border-purple-500/20 rounded-lg text-center hover:border-purple-500/40 transition-colors">
                <div className="text-4xl mb-3">📄</div>
                <div className="text-lg font-semibold text-purple-400 mb-1">Professional</div>
                <div className="text-sm text-gray-400">Enterprise-grade documents</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Show API integration flow if selected
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-purple-950/20 to-[#0A0A0A]">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">

          {/* Back Button */}
          <button
            onClick={() => setSelectedMethod(null)}
            className="mb-6 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Options
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                Connect System Surveyor API
              </h1>
            </div>
            <p className="text-xl text-gray-300">
              Enter your API token to connect your account
            </p>
          </div>

          {/* Connection Card */}
          <div className="bg-[#1A1A1A] border border-purple-500/30 rounded-xl p-8 shadow-2xl">

            {/* How it Works */}
            <div className="mb-8 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                How This Works
              </h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Enter your System Surveyor API token below</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Select a completed survey from your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Equipment counts and measurements auto-populate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Generate professional proposals in minutes</span>
                </li>
              </ul>
            </div>

            {/* API Token Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                System Surveyor API Token
              </label>
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
                className="w-full px-4 py-3 bg-[#0A0A0A] border border-purple-500/30 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleConnect()}
              />
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get your token from System Surveyor → Settings → API Access
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              disabled={loading || !apiToken.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connecting...
                </span>
              ) : (
                'Connect to System Surveyor'
              )}
            </button>

            {/* Help Text */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Don't have API access?{' '}
              <a
                href="https://systemsurveyor.com/product-features/api-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Learn more about System Surveyor API
              </a>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#1A1A1A] border border-purple-500/20 rounded-lg text-center hover:border-purple-500/40 transition-colors">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-lg font-semibold text-purple-400 mb-1">90% Faster</div>
              <div className="text-sm text-gray-400">Proposal generation time</div>
            </div>
            <div className="p-6 bg-[#1A1A1A] border border-purple-500/20 rounded-lg text-center hover:border-purple-500/40 transition-colors">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-lg font-semibold text-purple-400 mb-1">100% Accurate</div>
              <div className="text-sm text-gray-400">Direct field data import</div>
            </div>
            <div className="p-6 bg-[#1A1A1A] border border-purple-500/20 rounded-lg text-center hover:border-purple-500/40 transition-colors">
              <div className="text-4xl mb-3">📄</div>
              <div className="text-lg font-semibold text-purple-400 mb-1">Professional</div>
              <div className="text-sm text-gray-400">Enterprise-grade documents</div>
            </div>
          </div>

          {/* Partnership Info */}
          <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-3">Official Integration Partner</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Design-Rite is proud to partner with System Surveyor to provide the most complete
              workflow for security system integrators. From field survey to professional proposal,
              we've got you covered.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}