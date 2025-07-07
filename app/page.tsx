"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login
    setIsLoggedIn(true)
    setShowLogin(false)
    alert("Login successful! (Demo mode)")
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate registration
    setIsLoggedIn(true)
    setShowRegister(false)
    alert("Registration successful! (Demo mode)")
  }

  const startAssessment = () => {
    if (isLoggedIn) {
      alert("Redirecting to assessment form... (Demo mode)")
    } else {
      setShowRegister(true)
    }
  }

  const watchDemo = () => {
    alert("Demo coming soon! Start your free trial to experience the platform.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-purple-600">Design-Rite™</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" onClick={() => alert("Dashboard (Demo)")}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={() => setIsLoggedIn(false)}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => setShowLogin(true)}>
                    Login
                  </Button>
                  <Button onClick={() => setShowRegister(true)}>Start Free Trial</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">AI-Powered</span>
                  <span className="block text-purple-600 xl:inline"> Security Assessment</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Transform security system design from days to minutes. Get professional assessments, detailed BOMs,
                  and implementation plans powered by advanced AI.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button
                      onClick={startAssessment}
                      size="lg"
                      className="w-full px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10"
                    >
                      Start Free Assessment
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button
                      variant="outline"
                      onClick={watchDemo}
                      size="lg"
                      className="w-full px-8 py-3 text-base font-medium md:py-4 md:text-lg md:px-10 bg-transparent"
                    >
                      Watch Demo
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/placeholder.svg?height=600&width=800&text=Security+System+Dashboard"
            alt="Security system dashboard"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for professional security design
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white text-2xl">
                  🤖
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">AI-Powered Analysis</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Advanced AI analyzes your facility and generates comprehensive security recommendations in minutes.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white text-2xl">
                  📋
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Professional Proposals</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Automatically generated proposals with detailed BOMs, pricing, and implementation timelines.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white text-2xl">
                  ⚡
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Instant Results</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Get professional security assessments in minutes, not days. Perfect for rapid response to RFPs.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white text-2xl">
                  🏢
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Enterprise Ready</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Scalable platform with API access, white-label options, and enterprise integrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your security design process?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-purple-200">
            Start with 3 free assessments. No credit card required.
          </p>
          <Button
            onClick={startAssessment}
            size="lg"
            variant="secondary"
            className="mt-8 px-8 py-3 text-base font-medium"
          >
            Start Free Trial
          </Button>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <Card className="w-96 mx-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 text-center mb-6">Login to Design-Rite™</h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="loginEmail">Email</Label>
                  <Input type="email" id="loginEmail" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input type="password" id="loginPassword" required className="mt-1" />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
              <div className="mt-4 text-center space-y-2">
                <Button
                  variant="link"
                  onClick={() => {
                    setShowLogin(false)
                    setShowRegister(true)
                  }}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Don't have an account? Sign up
                </Button>
                <br />
                <Button
                  variant="link"
                  onClick={() => setShowLogin(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <Card className="w-96 mx-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 text-center mb-6">Start Your Free Trial</h3>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="registerCompany">Company Name</Label>
                  <Input type="text" id="registerCompany" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input type="email" id="registerEmail" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input type="password" id="registerPassword" required className="mt-1" />
                </div>
                <Button type="submit" className="w-full">
                  Start Free Trial
                </Button>
              </form>
              <div className="mt-4 text-center space-y-2">
                <Button
                  variant="link"
                  onClick={() => {
                    setShowRegister(false)
                    setShowLogin(true)
                  }}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Already have an account? Login
                </Button>
                <br />
                <Button
                  variant="link"
                  onClick={() => setShowRegister(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
