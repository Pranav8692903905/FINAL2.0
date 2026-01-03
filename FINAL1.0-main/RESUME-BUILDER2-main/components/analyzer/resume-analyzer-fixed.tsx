"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3, Upload, FileText, Zap, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface AnalysisData {
  name: string
  email: string
  phone: string
  pages: number
  skills: string[]
  experience: string
  education: string[]
  score: number
  level: string
  field: string
  recommended_skills: string[]
  courses: Array<{
    name: string
    link?: string
    url?: string
  }>
  filename: string
}

export function ResumeAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file: File) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError("❌ Only PDF files are supported. Please upload a .pdf file.")
      setUploadedFile(null)
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError("❌ File size exceeds 10MB limit. Please choose a smaller file.")
      setUploadedFile(null)
      return
    }

    if (file.size === 0) {
      setError("❌ File is empty. Please choose a valid PDF file.")
      setUploadedFile(null)
      return
    }

    setUploadedFile(file)
    setAnalysisData(null)
    setError(null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const analyzeResume = async () => {
    if (!uploadedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const response = await fetch("/api/analyzer", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data?.detail || `HTTP ${response.status} Error`
        setError(`❌ ${errorMsg}`)
        setAnalysisData(null)
        return
      }

      // Ensure all fields have proper defaults
      const normalizedData: AnalysisData = {
        name: data?.name || "Unknown",
        email: data?.email || "N/A",
        phone: data?.phone || "N/A",
        pages: data?.pages || 1,
        skills: Array.isArray(data?.skills) ? data.skills : [],
        experience: data?.experience || "Fresher",
        education: Array.isArray(data?.education) ? data.education : [],
        score: typeof data?.score === 'number' ? data.score : 0,
        level: data?.level || "Fresher",
        field: data?.field || "General IT",
        recommended_skills: Array.isArray(data?.recommended_skills) ? data.recommended_skills : [],
        courses: Array.isArray(data?.courses) ? data.courses : [],
        filename: data?.filename || uploadedFile.name
      }

      setAnalysisData(normalizedData)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze resume"
      setError(`❌ Network Error: ${errorMessage}`)
      setAnalysisData(null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 80) return "bg-green-500/20 text-green-300 border-green-500/50"
    if (score >= 60) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50"
    return "bg-red-500/20 text-red-300 border-red-500/50"
  }

  const downloadReport = () => {
    if (!analysisData) return

    const courses = analysisData.courses || []
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume Analysis Report - ${analysisData.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          .header h1 { font-size: 32px; margin-bottom: 10px; }
          .header p { opacity: 0.9; font-size: 14px; }
          .score-section {
            text-align: center;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .score-value { font-size: 72px; font-weight: bold; margin: 10px 0; }
          .score-label { font-size: 18px; opacity: 0.9; }
          .content { padding: 40px; }
          .section { margin-bottom: 40px; }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }
          .info-item {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          .info-label { color: #666; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .info-value { color: #333; font-size: 16px; font-weight: 600; margin-top: 5px; }
          .badges {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 15px 0;
          }
          .badge {
            display: inline-block;
            padding: 8px 14px;
            background: #e0f2fe;
            color: #0369a1;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            border: 1px solid #bae6fd;
          }
          .badge.recommended {
            background: #fef3c7;
            color: #b45309;
            border-color: #fde68a;
          }
          .courses-list { list-style: none; padding: 0; }
          .course-item {
            padding: 15px;
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            margin-bottom: 10px;
            border-radius: 4px;
          }
          .course-item strong { color: #333; }
          .course-link { color: #0369a1; font-size: 12px; }
          .footer {
            text-align: center;
            padding: 20px;
            border-top: 1px solid #e5e7eb;
            background: #f8f9fa;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Resume Analysis Report</h1>
            <p>${analysisData.filename} • Generated on ${new Date().toLocaleString()}</p>
          </div>

          <div class="score-section">
            <div class="score-label">Overall Score</div>
            <div class="score-value">${analysisData.score}/100</div>
            <div class="score-label">${analysisData.score >= 80 ? '⭐ Excellent' : analysisData.score >= 60 ? '👍 Good' : '⚠️ Needs Improvement'}</div>
          </div>

          <div class="content">
            <div class="section">
              <div class="section-title">👤 Candidate Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Name</div>
                  <div class="info-value">${analysisData.name || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${analysisData.email || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone</div>
                  <div class="info-value">${analysisData.phone || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Resume Pages</div>
                  <div class="info-value">${analysisData.pages}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">💼 Career Profile</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Detected Field</div>
                  <div class="info-value">${analysisData.field}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Experience Level</div>
                  <div class="info-value">${analysisData.level}</div>
                </div>
              </div>
            </div>

            ${analysisData.skills.length > 0 ? `
            <div class="section">
              <div class="section-title">🛠️ Detected Skills (${analysisData.skills.length})</div>
              <div class="badges">
                ${analysisData.skills.map(skill => `<span class="badge">${skill}</span>`).join('')}
              </div>
            </div>
            ` : ''}

            ${analysisData.recommended_skills.length > 0 ? `
            <div class="section">
              <div class="section-title">✅ Recommended Skills to Add</div>
              <div class="badges">
                ${analysisData.recommended_skills.map(skill => `<span class="badge recommended">+ ${skill}</span>`).join('')}
              </div>
            </div>
            ` : ''}

            ${courses.length > 0 ? `
            <div class="section">
              <div class="section-title">📚 Recommended Courses</div>
              <ul class="courses-list">
                ${courses.map(course => `
                  <li class="course-item">
                    <strong>${course.name}</strong><br>
                    <a href="${course.url || course.link || '#'}" target="_blank" class="course-link">
                      ${course.url || course.link || 'Link'}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}
          </div>

          <div class="footer">
            <p>✨ Generated by Resume Analyzer AI • ${new Date().toLocaleString()}</p>
            <p>This is a confidential analysis report. Please use responsibly.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const element = document.createElement('a')
    const file = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    element.href = URL.createObjectURL(file)
    element.download = `Resume-Analysis-${analysisData.name.replace(/\s+/g, '-')}-${Date.now()}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage: "url('/any.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(2,6,23,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Resume Analyzer</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!analysisData ? (
          // Upload Section
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Analyze Your Resume
              </h2>
              <p className="text-muted-foreground text-lg">
                Upload your PDF resume to get instant AI-powered analysis and personalized recommendations
              </p>
            </div>

            {error && (
              <Alert className="mb-6 border-red-500/30 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <Card className="border-0 bg-gradient-to-br from-blue-500/10 via-slate-800/80 to-blue-600/10 backdrop-blur-md shadow-2xl overflow-hidden">
              <CardHeader>
                <div className="text-center">
                  <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/40">
                    <Upload className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl text-white">Upload Your Resume</CardTitle>
                  <CardDescription className="text-gray-300 mt-2">
                    Supported format: PDF (Max 10MB)
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Drag and Drop Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    isDragActive
                      ? "border-blue-400 bg-blue-500/10 scale-105"
                      : "border-blue-500/40 bg-blue-500/5 hover:border-blue-500/60"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="h-20 w-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <FileText className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">
                        {isDragActive ? "Drop your PDF here" : "Click to upload or drag & drop"}
                      </p>
                      <p className="text-xs text-gray-400">PDF • Up to 10MB</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* File Selected Alert */}
                {uploadedFile && (
                  <Alert className="bg-green-500/10 border-green-500/30">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <AlertDescription className="text-green-300">
                      <strong>{uploadedFile.name}</strong> ({(uploadedFile.size / 1024).toFixed(2)} KB) ready for analysis
                    </AlertDescription>
                  </Alert>
                )}

                {/* Analyze Button */}
                <Button
                  onClick={analyzeResume}
                  disabled={!uploadedFile || isAnalyzing}
                  className="w-full px-8 py-6 text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Clock className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Your Resume... ({Math.random() > 0.5 ? '1' : '2'} sec)
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Analyze Resume Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Results Section
          <div className="space-y-8">
            {/* Main Results Card */}
            <Card className="border-0 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md shadow-2xl overflow-hidden">
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-3xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      Analysis Results
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                      📄 {analysisData.filename}
                    </CardDescription>
                  </div>
                  <div className={`text-right px-6 py-4 rounded-lg border ${getScoreBadgeColor(analysisData.score)}`}>
                    <div className={`text-5xl font-bold ${getScoreColor(analysisData.score)}`}>
                      {analysisData.score}
                    </div>
                    <p className="text-sm mt-1">Overall Score</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Basic Info Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Name</p>
                    <p className="text-lg font-semibold text-white mt-1">{analysisData.name}</p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Email</p>
                    <p className="text-lg font-semibold text-white mt-1 break-all">{analysisData.email}</p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Phone</p>
                    <p className="text-lg font-semibold text-white mt-1">{analysisData.phone}</p>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Resume Pages</p>
                    <p className="text-lg font-semibold text-white mt-1">{analysisData.pages}</p>
                  </div>
                </div>

                {/* Analysis Metrics */}
                <div className="border-t border-slate-700/50 pt-6 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm font-medium text-gray-300">🎯 Field Detected</p>
                    <Badge className="bg-blue-500/30 text-blue-300 border-blue-500/50">{analysisData.field}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="text-sm font-medium text-gray-300">📊 Experience Level</p>
                    <Badge className="bg-purple-500/30 text-purple-300 border-purple-500/50">{analysisData.level}</Badge>
                  </div>
                </div>

                {/* Skills Section */}
                {analysisData.skills.length > 0 && (
                  <div className="border-t border-slate-700/50 pt-6 space-y-3">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      🛠️ Found Skills ({analysisData.skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Skills */}
                {analysisData.recommended_skills.length > 0 && (
                  <div className="border-t border-slate-700/50 pt-6 space-y-3">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      ✅ Recommended Skills to Add ({analysisData.recommended_skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.recommended_skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-yellow-500/30 text-yellow-300 border border-yellow-500/50"
                        >
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Courses Section */}
                {analysisData.courses.length > 0 && (
                  <div className="border-t border-slate-700/50 pt-6 space-y-3">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      📚 Recommended Courses ({analysisData.courses.length})
                    </h3>
                    <div className="space-y-2">
                      {analysisData.courses.map((course, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-all"
                        >
                          <span className="text-white text-sm flex-1">{course.name}</span>
                          <a
                            href={course.url || course.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs font-semibold ml-2"
                          >
                            View →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                onClick={downloadReport}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
              >
                <FileText className="mr-2 h-5 w-5" />
                Download Report (HTML)
              </Button>
              <Button
                onClick={() => {
                  setAnalysisData(null)
                  setUploadedFile(null)
                  setError(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
                variant="outline"
                className="border-gray-600 hover:border-gray-400"
              >
                Analyze Another Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
