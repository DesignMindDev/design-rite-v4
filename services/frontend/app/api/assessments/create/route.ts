import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get the backend URL from environment variables
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    console.log("Forwarding assessment request to backend:", backendUrl)

    // Forward the request to the backend service
    const response = await fetch(`${backendUrl}/api/assessments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error("Backend response error:", response.status, response.statusText)
      throw new Error(`Backend responded with ${response.status}`)
    }

    const result = await response.json()
    console.log("Assessment created successfully:", result.assessment?.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Assessment creation error:", error)
    return NextResponse.json({ error: "Failed to create assessment" }, { status: 500 })
  }
}
