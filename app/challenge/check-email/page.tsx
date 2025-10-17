'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function CheckEmailContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get email from URL parameter (for 7-day trial) or Stripe session (for paid)
    const emailParam = searchParams.get('email')

    if (emailParam) {
      setEmail(emailParam)
      setLoading(false)
    } else if (sessionId) {
      // Fetch from Stripe session if available
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setEmail(data.email)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId, searchParams])

  const handleResendEmail = async () => {
    // TODO: Implement resend email functionality
    alert('Resend email functionality coming soon!')
  }

  return (
    <div className="min-h-screen dr-bg-gradient flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="dr-card p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            🎉 Welcome to Design Rite!
          </h1>

          {!loading && email && (
            <p className="text-lg text-gray-600 mb-8">
              We just sent a verification email to <strong>{email}</strong>
            </p>
          )}

          {/* Email Instructions */}
          <div className="dr-gradient-box p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              📧 Check Your Email
            </h2>
            <p className="text-gray-700 mb-4">
              Click the link in the email to verify your account and access the platform.
            </p>
            <p className="text-sm text-gray-600">
              The email should arrive within 1-2 minutes.
            </p>
          </div>

          {/* Next Steps */}
          <div className="text-left mb-8">
            <h3 className="text-xl font-bold mb-4">What's Next?</h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Check your email inbox for a message from Design Rite</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Click the verification link in the email</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Start automating your security proposals!</span>
              </li>
            </ol>
          </div>

          {/* Help Text */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 mb-4">
              Don't see the email? Check your spam folder.
            </p>
            <button
              onClick={handleResendEmail}
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm underline"
            >
              Resend verification email
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>💡 Pro Tip:</strong> Add noreply@design-rite.com to your contacts to ensure you receive all platform notifications.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Need help? <a href="/contact" className="text-purple-600 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen dr-bg-gradient flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  )
}
