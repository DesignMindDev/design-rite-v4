'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginRedirect() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  useEffect(() => {
    // Redirect to subscriber portal for authentication
    const portalUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3040/auth'
      : 'https://portal.design-rite.com/auth';

    // Pass callback URL to portal so it knows where to redirect after auth
    const redirectUrl = callbackUrl
      ? `${portalUrl}?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : portalUrl;

    console.log('[Login Redirect] Redirecting to portal:', redirectUrl);
    window.location.href = redirectUrl;
  }, [callbackUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to login...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    }>
      <LoginRedirect />
    </Suspense>
  );
}
