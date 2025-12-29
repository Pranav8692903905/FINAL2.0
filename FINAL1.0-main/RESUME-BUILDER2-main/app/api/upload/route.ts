import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("photo") as File | null

    if (!file) {
      console.error("No file provided in form data")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type)
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed." }, { status: 400 })
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      console.error("File too large:", file.size)
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      console.log("Creating uploads directory:", uploadsDir)
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const originalName = file.name || `upload-${Date.now()}`
    const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, "-")}`
    const filePath = path.join(uploadsDir, safeName)

    console.log("Uploading file to:", filePath)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.promises.writeFile(filePath, buffer)

    console.log("File uploaded successfully:", safeName)

    const url = `/uploads/${safeName}`
    return NextResponse.json({ url, filename: safeName, size: file.size })
  } catch (err: any) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
