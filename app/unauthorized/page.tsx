'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-purple-900/20">
      <div className="bg-[#1A1A1A] p-8 rounded-lg shadow-xl border border-red-600/30 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center text-white font-black text-xl mx-auto mb-4">
            ⚠️
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this area</p>
        </div>

        {/* Error Details */}
        <div className="bg-red-500/10 border border-red-500/50 rounded p-4 mb-6">
          <p className="text-red-400 text-sm">
            {reason === 'domain_restricted' ? (
              <>
                <strong>Business Admin Access Restricted</strong>
                <br />
                <br />
                Access to the business admin portal is restricted to:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>@design-rite.com email addresses</li>
                  <li>Users with domain override permission</li>
                  <li>Super administrators</li>
                </ul>
              </>
            ) : (
              <>
                You do not have permission to access this resource. Please contact your administrator
                if you believe this is an error.
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition-colors text-center block"
          >
            Go to Customer Dashboard
          </Link>
          <Link
            href="/"
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded transition-colors text-center block"
          >
            Return to Homepage
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-6 bg-purple-900/20 border border-purple-600/30 rounded p-3">
          <p className="text-xs text-gray-400">
            <strong className="text-purple-400">Need Access?</strong>
            <br />
            Contact your Design-Rite administrator at{' '}
            <a href="mailto:dan@design-rite.com" className="text-purple-400 hover:text-purple-300">
              dan@design-rite.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-purple-900/20">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}
