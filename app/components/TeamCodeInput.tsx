'use client'

import { useState } from 'react'
import { Shield, Key, CheckCircle, AlertCircle } from 'lucide-react'

interface TeamCodeInputProps {
  onValidCode: (member: { name: string; role: string; id: string }) => void
  onClose: () => void
}

export default function TeamCodeInput({ onValidCode, onClose }: TeamCodeInputProps) {
  const [code, setCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')

  const validateCode = async () => {
    if (!code.trim()) {
      setError('Please enter your team access code')
      return
    }

    setIsValidating(true)
    setError('')

    try {
      const response = await fetch('/api/admin/team-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'validate', code: code.trim() })
      })

      const result = await response.json()

      if (result.valid) {
        onValidCode(result.member)
      } else {
        setError('Invalid access code. Please check your code and try again.')
      }
    } catch (error) {
      setError('Failed to validate code. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateCode()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-purple-500/30">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-purple-400" />
            <Key className="w-8 h-8 text-yellow-400 ml-2" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Team Member Access</h2>
          <p className="text-gray-300 text-sm">
            Enter your Design-Rite team access code to enable enhanced AI capabilities
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Access Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="DR-XX-2025-XXX"
              className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 uppercase tracking-wider"
              disabled={isValidating}
            />
            {error && (
              <div className="flex items-center mt-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={validateCode}
              disabled={isValidating}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Validate Code
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-black/20 rounded-lg border border-gray-600">
          <h3 className="text-sm font-semibold text-purple-400 mb-2">Enhanced Capabilities</h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Direct access to qualification scores</li>
            <li>• Live pricing calculations</li>
            <li>• Technical system information</li>
            <li>• Advanced debugging tools</li>
            <li>• Bypass discovery requirements</li>
          </ul>
        </div>
      </div>
    </div>
  )
}