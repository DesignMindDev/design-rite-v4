"use client"

import Link from 'next/link'

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
      <header className="bg-black/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 py-5">
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-600 font-black text-sm">
              DR
            </div>
            Design-Rite
          </Link>
        </nav>
      </header>
      
      <main className="py-20 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Education Security</h1>
          <p className="text-xl">Coming soon...</p>
        </div>
      </main>
    </div>
  )
}
