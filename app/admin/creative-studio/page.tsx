'use client'
import { useEffect } from 'react'

export default function CreativeStudioRedirect() {
  useEffect(() => {
    const microserviceUrl = process.env.NEXT_PUBLIC_CREATIVE_STUDIO_URL || 'http://localhost:3030'
    window.location.href = microserviceUrl
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Loading Creative Studio...</h2>
        <p className="text-gray-600">Redirecting to microservice</p>
      </div>
    </div>
  )
}
