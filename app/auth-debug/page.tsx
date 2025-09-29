'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { authHelpers } from '@/lib/supabase';

function AuthDebugContent() {
  const [authState, setAuthState] = useState<any>(null);
  const [urlParams, setUrlParams] = useState<any>({});
  const searchParams = useSearchParams();

  useEffect(() => {
    // Capture all URL parameters
    const params: any = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setUrlParams(params);

    // Check current auth state
    const checkAuth = async () => {
      try {
        const user = await authHelpers.getCurrentUser();
        const session = await authHelpers.getCurrentSession();
        setAuthState({ user, session });
      } catch (error) {
        setAuthState({ error: error });
      }
    };

    checkAuth();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">🔍 Auth Debug Information</h1>

      <div className="space-y-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">📋 URL Parameters</h2>
          <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(urlParams, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">👤 Auth State</h2>
          <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">🌐 Window Location</h2>
          <pre className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            {typeof window !== 'undefined' ? JSON.stringify({
              href: window.location.href,
              hostname: window.location.hostname,
              pathname: window.location.pathname,
              search: window.location.search,
              hash: window.location.hash
            }, null, 2) : 'Loading...'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function AuthDebugPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">🔍 Loading Auth Debug...</h1>
      </div>
    }>
      <AuthDebugContent />
    </Suspense>
  );
}