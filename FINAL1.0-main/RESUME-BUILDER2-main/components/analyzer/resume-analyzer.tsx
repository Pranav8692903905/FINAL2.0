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
            <div className="flex justify-center gap-4">
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
              <Button>Download Report</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
