import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("photo") as any

    if (!file || typeof file.stream !== "function") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

    const originalName = file.name || `upload-${Date.now()}`
    const safeName = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, "-")}`
    const filePath = path.join(uploadsDir, safeName)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.promises.writeFile(filePath, buffer)

    const url = `/uploads/${safeName}`
    return NextResponse.json({ url })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
