"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, Upload, FileText, Briefcase, MapPin, ExternalLink, Loader2 } from "lucide-react"

interface Job {
  title: string
  companyName: string
  location?: string
  url?: string
  source?: string
}

interface AnalysisResult {
  summary: string
  gaps: string
  roadmap: string
  jobs?: Job[]
}

export function JobMatcherNew() {
  const [uploadedResume, setUploadedResume] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isFetchingJobs, setIsFetchingJobs] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string>("")

  // Use Next.js rewrite to backend via relative /api/* to avoid mixed content & CORS issues
  const apiBase = ''

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedResume(file)
      setError("")
    }
  }

  const analyzeResume = async () => {
    if (!uploadedResume) return

    setIsAnalyzing(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", uploadedResume)

      const response = await fetch(`/api/analyze/resume`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errText = await response.text()
        let detail = "Failed to analyze resume"
        try {
          const parsed = JSON.parse(errText)
          detail = parsed?.detail || parsed?.message || detail
        } catch (parseErr) {
          console.error("Failed to parse error response", parseErr)
        }
        throw new Error(detail)
      }

      const data = await response.json()
      setAnalysisResult(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze resume. Please try again."
      setError(message)
      console.error("Analyze resume failed", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const fetchJobRecommendations = async () => {
    if (!analysisResult) return

    setIsFetchingJobs(true)
    setError("")

    try {
      // Extract keywords from summary
      const keywordsResponse = await fetch(`/api/keywords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summary: analysisResult.summary }),
      })

      if (!keywordsResponse.ok) {
        const errText = await keywordsResponse.text()
        let detail = "Failed to extract keywords"
        try {
          const parsed = JSON.parse(errText)
          detail = parsed?.detail || parsed?.message || detail
        } catch (parseErr) {
          console.error("Failed to parse keyword error", parseErr)
        }
        throw new Error(detail)
      }

      const { keywords } = await keywordsResponse.json()

      // Fetch jobs
      const jobsResponse = await fetch(
        `/api/jobs?keywords=${encodeURIComponent(keywords)}&rows=60`
      )

      if (!jobsResponse.ok) {
        const errText = await jobsResponse.text()
        let detail = "Failed to fetch jobs"
        try {
          const parsed = JSON.parse(errText)
          detail = parsed?.detail || parsed?.message || detail
        } catch (parseErr) {
          console.error("Failed to parse jobs error", parseErr)
        }
        throw new Error(detail)
      }

      const jobsData = await jobsResponse.json()
      setAnalysisResult({ ...analysisResult, jobs: jobsData.jobs })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch job recommendations. Please try again."
      setError(message)
      console.error("Fetch jobs failed", err)
    } finally {
      setIsFetchingJobs(false)
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/1715371733808.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(2,6,23,0.5)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">AI-Powered Job Matcher</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!analysisResult ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Match Your Resume to Perfect Jobs
              </h2>
              <p className="text-muted-foreground text-lg">
                Upload your resume and get personalized job recommendations with AI-powered analysis
              </p>
            </div>

            {/* Resume Upload */}
            <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-slate-800/80 to-emerald-600/10 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-emerald-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_50%)]" />
              
              <CardHeader className="relative z-10">
                <div className="text-center">
                  <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                    <Upload className="h-8 w-8 text-emerald-400" />
                  </div>
                  <CardTitle className="text-2xl text-white">Upload Your Resume</CardTitle>
                  <CardDescription className="text-gray-300 mt-2">
                    Upload in PDF format for AI analysis
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="relative border-2 border-dashed border-emerald-500/40 rounded-2xl p-12 text-center group hover:border-emerald-500/60 transition-all duration-300 bg-emerald-500/5">
                  <div className="space-y-4">
                    <div className="h-20 w-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
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
                    onChange={handleResumeUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {uploadedResume && (
                  <Alert className="bg-emerald-500/10 border-emerald-500/30">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-emerald-400" />
                      </div>
                      <AlertDescription className="text-emerald-300">
                        <strong>{uploadedResume.name}</strong> ready for analysis
                      </AlertDescription>
                    </div>
                  </Alert>
                )}

                {error && (
                  <Alert className="bg-red-500/10 border-red-500/30">
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="text-center">
                  <Button
                    onClick={analyzeResume}
                    disabled={!uploadedResume || isAnalyzing}
                    className="px-12 py-6 text-lg bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-5 w-5" />
                        Analyze & Get Job Matches
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Analysis Results */}
            <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.15),transparent_50%)]" />
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-2xl text-white">Resume Analysis</CardTitle>
                <CardDescription className="text-gray-300 mt-2">
                  AI-powered insights from your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                {/* Summary */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">📑 Summary</h3>
                  <p className="text-gray-300 leading-relaxed">{analysisResult.summary}</p>
                </div>

                {/* Skill Gaps */}
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20">
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">🛠️ Skill Gaps & Missing Areas</h3>
                  <p className="text-gray-300 leading-relaxed">{analysisResult.gaps}</p>
                </div>

                {/* Roadmap */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">🚀 Future Roadmap</h3>
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">{analysisResult.roadmap}</div>
                </div>

                {/* Job Recommendations Button */}
                {!analysisResult.jobs && (
                  <div className="text-center">
                    <Button
                      onClick={fetchJobRecommendations}
                      disabled={isFetchingJobs}
                      className="px-12 py-6 text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
                    >
                      {isFetchingJobs ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Fetching Jobs...
                        </>
                      ) : (
                        <>
                          <Briefcase className="mr-2 h-5 w-5" />
                          Get Job Recommendations
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Recommendations */}
            {analysisResult.jobs && analysisResult.jobs.length > 0 && (
              <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)]" />
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl text-white">💼 Job Recommendations</CardTitle>
                  <CardDescription className="text-gray-300 mt-2">
                    Found {analysisResult.jobs.length} matching positions from RSS feeds
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    {analysisResult.jobs.map((job, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="h-12 w-12 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-indigo-500/40">
                                <Briefcase className="h-6 w-6 text-indigo-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white text-lg mb-1">{job.title}</h4>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                                  <span className="font-medium text-indigo-300">{job.companyName}</span>
                                  {job.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {job.location}
                                    </span>
                                  )}
                                  {job.source && (
                                    <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                                      {job.source}
                                    </Badge>
                                  )}
                                </div>
                                {job.url && (
                                  <a
                                    href={job.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                                  >
                                    View Job
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {analysisResult.jobs && analysisResult.jobs.length === 0 && (
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertDescription className="text-yellow-300">
                  No jobs found matching your profile. Try updating your resume or check back later.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                onClick={() => {
                  setAnalysisResult(null)
                  setUploadedResume(null)
                }}
                variant="outline"
                className="px-8 py-6 text-lg border-slate-600 text-white hover:bg-slate-800 transition-all duration-300"
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
