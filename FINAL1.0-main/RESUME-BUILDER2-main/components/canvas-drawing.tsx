"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function CanvasDrawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(5)
  const [brushColor, setBrushColor] = useState("#000000")

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Set initial canvas background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set drawing properties
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }, [])

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      ctx.lineWidth = brushSize
      ctx.strokeStyle = brushColor
      ctx.lineTo(x, y)
      ctx.stroke()
    },
    [isDrawing, brushSize, brushColor],
  )

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const downloadCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "canvas-drawing.png"
    link.href = canvas.toDataURL()
    link.click()
  }, [])

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="brush-size" className="text-sm font-medium">
              Brush Size:
            </label>
            <input
              id="brush-size"
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground w-8">{brushSize}px</span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="brush-color" className="text-sm font-medium">
              Color:
            </label>
            <input
              id="brush-color"
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-12 h-8 rounded border border-border cursor-pointer"
            />
          </div>

          <Button onClick={clearCanvas} variant="outline" size="sm">
            Clear Canvas
          </Button>

          <Button onClick={downloadCanvas} variant="outline" size="sm">
            Download
          </Button>
        </div>

        {/* Canvas */}
        <div className="border border-border rounded-lg overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="block cursor-crosshair"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Click and drag on the canvas to draw. Use the controls above to adjust brush size and color.
        </p>
      </div>
    </Card>
  )
}
