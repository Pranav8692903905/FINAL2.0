import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const response = await fetch(`${BACKEND_URL}/upload-resume`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()

    // Normalize course links so the frontend always receives { name, url }
    const courses = Array.isArray(data.courses)
      ? data.courses.map((course: any) => ({
          name: course?.name,
          url: course?.url || course?.link || "",
        }))
      : []

    return NextResponse.json({ ...data, courses })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
