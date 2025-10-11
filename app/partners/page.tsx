'use client';

import UnifiedNavigation from '../components/UnifiedNavigation';
import Footer from '../components/Footer';

export default function Partners() {
  const redirectToApp = () => {
    window.location.href = '/estimate-options';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      {/* Main Navigation Header */}
      <UnifiedNavigation />

      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Our Partners</h1>
        <div className="bg-white/5 rounded-lg p-8">
          <p className="text-xl text-gray-300 mb-6">
            We work with leading security technology partners to deliver comprehensive solutions.
          </p>
          <p className="text-gray-400">
            Partner program details coming soon. Contact us to learn about partnership opportunities.
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer redirectToApp={redirectToApp} />
    </div>
  );
}



