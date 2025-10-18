'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ExistingUserPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  useEffect(() => {
    // Redirect to login after 5 seconds
    const timer = setTimeout(() => {
      const loginUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/auth'
        : 'https://portal.design-rite.com/auth'
      window.location.href = loginUrl
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen dr-bg-gradient flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="dr-card p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome Back!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            You already have an active Design-Rite account{email && ` with ${email}`}.
          </p>

          {/* Info Box */}
          <div className="dr-gradient-box p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              🔐 Sign In to Continue
            </h2>
            <p className="text-gray-700 mb-4">
              Please sign in to access your dashboard and all your projects.
            </p>
            <p className="text-sm text-gray-600">
              Redirecting you to the sign-in page in 5 seconds...
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href={process.env.NODE_ENV === 'development' ? 'http://localhost:3001/auth' : 'https://portal.design-rite.com/auth'}
              className="inline-block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-semibold"
            >
              Sign In Now
            </Link>

            <Link
              href="/forgot-password"
              className="block text-purple-600 hover:text-purple-700 font-semibold text-sm underline"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Need help?</strong> Contact our support team at{' '}
              <a href="mailto:support@design-rite.com" className="text-purple-600 hover:underline">
                support@design-rite.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            New to Design-Rite?{' '}
            <Link href="/create-account" className="text-purple-600 hover:underline">
              Create a new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
