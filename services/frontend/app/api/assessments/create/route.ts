import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const assessmentData = await request.json()

    // Get the backend URL from environment or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

    console.log("Forwarding assessment to backend:", backendUrl)

    // Forward the request to the backend service
    const response = await fetch(`${backendUrl}/api/assessments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assessmentData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", response.status, errorText)

      return NextResponse.json(
        {
          error: "Failed to create assessment",
          details: `Backend returned ${response.status}`,
        },
        { status: response.status },
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Assessment API error:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
