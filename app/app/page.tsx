'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to AI Assessment after a brief moment
    const timer = setTimeout(() => {
      router.push('/ai-assessment');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Loading AI Security Assessment...</h2>
        <p className="text-gray-400">Taking you to the platform</p>
      </div>
    </div>
  );
}



