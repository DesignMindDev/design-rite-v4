'use client'

// This component will rarely be reached due to our rewrites configuration
// The static HTML landing page will be served instead
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-6">
          DR
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Loading Design-Rite Platform...</p>
      </div>
    </div>
  )
}