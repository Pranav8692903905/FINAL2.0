"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart3, Upload, FileText, Zap, AlertCircle } from "lucide-react"

interface AnalysisData {
  name: string
  email: string
  phone: string
  pages: number
  skills: string[]
  experience: string
  education: string
  score: number
  level: string
  field: string
  recommended_skills: string[]
  courses: Array<{
    name: string
    url: string
  }>
  filename: string
}

export function ResumeAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setAnalysisData(null)
      setError(null)
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }))
        throw new Error(errorData.detail || `HTTP ${response.status}`)
      }

      const data = await response.json()
      setAnalysisData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze resume"
      setError(errorMessage)
      console.error("Analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const downloadReport = () => {
    if (!analysisData) return

    try {
      // Create HTML content for the report
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Resume Analysis Report - ${analysisData.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 900px;
              margin: 0 auto;
              background-color: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #1f2937;
              margin: 0;
            }
            .filename {
              color: #6b7280;
              font-size: 14px;
              margin-top: 5px;
            }
            .score-section {
              text-align: center;
              padding: 20px;
              background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
              color: white;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .score-value {
              font-size: 48px;
              font-weight: bold;
              margin: 10px 0;
            }
            .score-label {
              font-size: 14px;
              opacity: 0.9;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 20px;
            }
            .info-item {
              padding: 15px;
              background-color: #f9fafb;
              border-radius: 6px;
            }
            .info-label {
              color: #6b7280;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .info-value {
              color: #1f2937;
              font-size: 16px;
              font-weight: bold;
            }
            .badges {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-bottom: 15px;
            }
            .badge {
              display: inline-block;
              padding: 6px 12px;
              background-color: #e0f2fe;
              color: #0369a1;
              border-radius: 20px;
              font-size: 13px;
              border: 1px solid #bae6fd;
            }
            .badge.recommended {
              background-color: #fef3c7;
              color: #b45309;
              border-color: #fde68a;
            }
            .courses-list {
              list-style: none;
              padding: 0;
            }
            .course-item {
              padding: 12px;
              background-color: #f0f9ff;
              border-left: 4px solid #3b82f6;
              margin-bottom: 10px;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
              margin-top: 30px;
              color: #6b7280;
              font-size: 12px;
            }
            @media (max-width: 600px) {
              .info-grid {
                grid-template-columns: 1fr;
              }
              .container {
                padding: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Resume Analysis Report</h1>
              <p class="filename">${analysisData.filename}</p>
            </div>

            <div class="score-section">
              <div class="score-label">Overall Score</div>
              <div class="score-value">${analysisData.score}/100</div>
              <div class="score-label">${analysisData.score >= 80 ? 'Excellent' : analysisData.score >= 60 ? 'Good' : 'Needs Improvement'}</div>
            </div>

            <div class="section">
              <div class="section-title">Candidate Information</div>
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
                  <div class="info-label">Pages</div>
                  <div class="info-value">${analysisData.pages}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Career Profile</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Field</div>
                  <div class="info-value">${analysisData.field}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Experience Level</div>
                  <div class="info-value">${analysisData.level}</div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Detected Skills (${analysisData.skills.length})</div>
              <div class="badges">
                ${analysisData.skills.map(skill => `<span class="badge">${skill}</span>`).join('')}
              </div>
            </div>

            <div class="section">
              <div class="section-title">Recommended Skills to Add</div>
              <div class="badges">
                ${analysisData.recommended_skills.map(skill => `<span class="badge recommended">+ ${skill}</span>`).join('')}
              </div>
            </div>

            ${analysisData.courses.length > 0 ? `
            <div class="section">
              <div class="section-title">Recommended Courses</div>
              <ul class="courses-list">
                ${analysisData.courses.map(course => `
                  <li class="course-item">
                    <strong>${course.name}</strong><br>
                    <small style="color: #0369a1; text-decoration: underline;">${course.url}</small>
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : ''}

            <div class="footer">
              <p>Generated on ${new Date().toLocaleString()}</p>
              <p>This report was generated by Resume Analyzer AI</p>
            </div>
          </div>
        </body>
        </html>
      `

      // Create a blob and download
      const element = document.createElement('a')
      const file = new Blob([htmlContent], { type: 'text/html' })
      element.href = URL.createObjectURL(file)
      element.download = `Resume-Analysis-Report-${analysisData.name.replace(/\s+/g, '-')}-${new Date().getTime()}.html`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      
      // Show success message
      alert('Report downloaded successfully!')
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download report. Please try again.')
    }
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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
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
                Upload your PDF resume to get instant AI-powered analysis
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
                    PDF format supported
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="relative border-2 border-dashed border-blue-500/40 rounded-2xl p-12 text-center group hover:border-blue-500/60 transition-all duration-300 bg-blue-500/5">
                  <div className="space-y-4">
                    <div className="h-20 w-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <FileText className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Click to upload or drag & drop</p>
                      <p className="text-xs text-gray-400">PDF • Up to 10MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {uploadedFile && (
                  <Alert className="bg-green-500/10 border-green-500/30">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-300">
                        <strong>{uploadedFile.name}</strong> ready for analysis
                      </AlertDescription>
                    </div>
                  </Alert>
                )}

                <Button
                  onClick={analyzeResume}
                  disabled={!uploadedFile || isAnalyzing}
                  className="w-full px-8 py-6 text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Analyzing Your Resume...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5 inline" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Results Section
          <div className="space-y-8">
            <Card className="border-0 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md shadow-2xl overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      Analysis Results
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                      {analysisData.filename}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-5xl font-bold ${getScoreColor(analysisData.score)}`}>
                      {analysisData.score}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Overall Score</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-lg font-semibold text-white">{analysisData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-lg font-semibold text-white">{analysisData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-lg font-semibold text-white">{analysisData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Pages</p>
                    <p className="text-lg font-semibold text-white">{analysisData.pages}</p>
                  </div>
                </div>

                {/* Analysis Metrics */}
                <div className="border-t border-slate-700/50 pt-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-300">Field Detected</p>
                      <Badge className="bg-blue-500/30 text-blue-300">{analysisData.field}</Badge>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-300">Experience Level</p>
                      <Badge className="bg-purple-500/30 text-purple-300">{analysisData.level}</Badge>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="border-t border-slate-700/50 pt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-white mb-3">Found Skills ({analysisData.skills.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.skills.map((skill) => (
                        <Badge key={skill} className="bg-emerald-500/30 text-emerald-300 border border-emerald-500/50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-3">Recommended Skills to Add</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.recommended_skills.map((skill) => (
                        <Badge key={skill} className="bg-yellow-500/30 text-yellow-300 border border-yellow-500/50">
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Courses Section */}
                {analysisData.courses.length > 0 && (
                  <div className="border-t border-slate-700/50 pt-6 space-y-4">
                    <h3 className="font-semibold text-white mb-3">Recommended Courses</h3>
                    <div className="space-y-2">
                      {analysisData.courses.map((course) => (
                        <div key={course.name} className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-all">
                          <span className="text-white text-sm">{course.name}</span>
                          <a href={course.url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="ghost" className="text-blue-400">
                              View Course
                            </Button>
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
                Download Report
              </Button>
              <Button
                onClick={() => {
                  setAnalysisData(null)
                  setUploadedFile(null)
                  setError(null)
                }}
                variant="outline"
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
