"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, Upload, FileText, Zap, TrendingUp, CheckCircle } from "lucide-react"
import { SkillGapAnalysis } from "./skill-gap-analysis"
import { RecommendationsList } from "./recommendations-list"

interface MatchData {
  overallMatch: number
  skillsMatch: number
  experienceMatch: number
  keywordMatch: number
  recommendations: Array<{
    type: "skill" | "experience" | "keyword" | "certification"
    title: string
    description: string
    priority: "high" | "medium" | "low"
    impact: string
  }>
  missingSkills: string[]
  matchingSkills: string[]
  suggestedProjects: string[]
  certifications: string[]
  jobDetails: {
    title: string
    company: string
    location: string
    requirements: string[]
  }
}

export function JobMatcher() {
  const [jobDescription, setJobDescription] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [uploadedResume, setUploadedResume] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchData, setMatchData] = useState<MatchData | null>(null)

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedResume(file)
    }
  }

  const analyzeMatch = async () => {
    if (!jobDescription.trim() || !uploadedResume) return

    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock analysis results
    const mockMatchData: MatchData = {
      overallMatch: 72,
      skillsMatch: 68,
      experienceMatch: 78,
      keywordMatch: 70,
      recommendations: [
        {
          type: "skill",
          title: "Learn React Hooks",
          description:
            "The job requires advanced React knowledge including hooks. Consider taking a course on modern React patterns.",
          priority: "high",
          impact: "Increases match score by 15%",
        },
        {
          type: "certification",
          title: "AWS Cloud Practitioner",
          description:
            "This role involves cloud deployment. Getting AWS certified would significantly boost your profile.",
          priority: "medium",
          impact: "Increases match score by 10%",
        },
        {
          type: "experience",
          title: "Add API Development Projects",
          description: "Showcase more REST API development experience to match the job requirements.",
          priority: "high",
          impact: "Increases match score by 12%",
        },
        {
          type: "keyword",
          title: "Include 'Microservices' Keyword",
          description: "The job description mentions microservices architecture. Add this to your skills section.",
          priority: "low",
          impact: "Increases match score by 5%",
        },
      ],
      missingSkills: ["React Hooks", "AWS", "Docker", "Kubernetes", "GraphQL"],
      matchingSkills: ["JavaScript", "Node.js", "MongoDB", "Git", "Agile", "REST APIs"],
      suggestedProjects: [
        "Build a microservices application with Docker",
        "Create a React app with advanced hooks",
        "Deploy an application to AWS",
        "Implement GraphQL API",
      ],
      certifications: ["AWS Cloud Practitioner", "Docker Certified Associate", "React Developer Certification"],
      jobDetails: {
        title: jobTitle || "Full Stack Developer",
        company: company || "Tech Company",
        location: "Remote",
        requirements: [
          "3+ years of JavaScript experience",
          "React and Node.js proficiency",
          "Experience with cloud platforms",
          "Knowledge of containerization",
          "API development experience",
        ],
      },
    }

    setMatchData(mockMatchData)
    setIsAnalyzing(false)
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getMatchVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/1715371733808.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(2,6,23,0.5)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Job Description Matcher</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!matchData ? (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Match Your Resume to Job Descriptions
              </h2>
              <p className="text-muted-foreground text-lg">
                Get personalized recommendations to improve your chances of landing the job
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Resume Upload - Impressive Design */}
              <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-slate-800/80 to-emerald-600/10 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-emerald-500/20 transition-all duration-300">
                {/* Background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_50%)]" />
                
                <CardHeader className="relative z-10">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                      <Upload className="h-8 w-8 text-emerald-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">Upload Your Resume</CardTitle>
                    <CardDescription className="text-gray-300 mt-2">
                      Upload in PDF, DOC, or DOCX format
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
                        <p className="text-xs text-gray-400">PDF, DOC, DOCX • Up to 10MB</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
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
                          <strong>{uploadedResume.name}</strong> ready for matching
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Job Description Input - Impressive Design */}
              <Card className="border-0 bg-gradient-to-br from-cyan-500/10 via-slate-800/80 to-cyan-600/10 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-cyan-500/20 transition-all duration-300">
                {/* Background glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.2),transparent_50%)]" />
                
                <CardHeader className="relative z-10">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/40">
                      <Target className="h-8 w-8 text-cyan-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">Job Description</CardTitle>
                    <CardDescription className="text-gray-300 mt-2">
                      Job title, company & description
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle" className="text-white text-sm font-medium">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Senior Frontend Developer"
                        className="mt-2 bg-slate-900/50 border-cyan-500/30 text-white placeholder-gray-500 rounded-lg focus:border-cyan-500/60 focus:ring-cyan-500/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-white text-sm font-medium">Company</Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g., Google"
                        className="mt-2 bg-slate-900/50 border-cyan-500/30 text-white placeholder-gray-500 rounded-lg focus:border-cyan-500/60 focus:ring-cyan-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="jobDescription" className="text-white text-sm font-medium mb-3 block">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the complete job description here..."
                      rows={9}
                      className="resize-none bg-slate-900/50 border-cyan-500/30 text-white placeholder-gray-500 rounded-xl focus:border-cyan-500/60 focus:ring-cyan-500/20 transition-all duration-300"
                    />
                  </div>
                  
                  {jobDescription && (
                    <Alert className="bg-cyan-500/10 border-cyan-500/30">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-cyan-400" />
                        </div>
                        <AlertDescription className="text-cyan-300">
                          Job description added for accurate matching
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button
                onClick={analyzeMatch}
                disabled={!jobDescription.trim() || !uploadedResume || isAnalyzing}
                className="relative px-12 py-6 text-lg bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Analyzing Match...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5 inline" />
                    Analyze Job Match
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Match Score Overview - Impressive Design */}
            <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.15),transparent_50%)]" />
              
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white">Job Match Analysis</CardTitle>
                    <CardDescription className="text-gray-300 mt-2">
                      {matchData.jobDetails.title} at {matchData.jobDetails.company}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                      {matchData.overallMatch}%
                    </div>
                    <p className="text-gray-300 text-sm mt-2">Overall Match</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid md:grid-cols-4 gap-6">
                  {/* Skills Match */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
                    <div className="h-12 w-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/40">
                      <TrendingUp className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-400">{matchData.skillsMatch}%</div>
                    <p className="text-gray-300 text-sm mt-2">Skills Match</p>
                    <Progress value={matchData.skillsMatch} className="mt-3 bg-emerald-500/10" />
                  </div>

                  {/* Experience Match */}
                  <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
                    <div className="h-12 w-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 border border-cyan-500/40">
                      <CheckCircle className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="text-3xl font-bold text-cyan-400">{matchData.experienceMatch}%</div>
                    <p className="text-gray-300 text-sm mt-2">Experience Match</p>
                    <Progress value={matchData.experienceMatch} className="mt-3 bg-cyan-500/10" />
                  </div>

                  {/* Keywords Match */}
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                    <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/40">
                      <Zap className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold text-blue-400">{matchData.keywordMatch}%</div>
                    <p className="text-gray-300 text-sm mt-2">Keywords Match</p>
                    <Progress value={matchData.keywordMatch} className="mt-3 bg-blue-500/10" />
                  </div>

                  {/* Overall Match */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                    <div className="h-12 w-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/40">
                      <Target className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="text-3xl font-bold text-purple-400">{matchData.overallMatch}%</div>
                    <p className="text-gray-300 text-sm mt-2">Overall Match</p>
                    <Progress value={matchData.overallMatch} className="mt-3 bg-purple-500/10" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Tabs defaultValue="recommendations" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="skills">Skills Gap</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
              </TabsList>

              <TabsContent value="recommendations" className="mt-6">
                <RecommendationsList recommendations={matchData.recommendations} />
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <SkillGapAnalysis matchingSkills={matchData.matchingSkills} missingSkills={matchData.missingSkills} />
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-white">Suggested Projects</CardTitle>
                    <CardDescription className="text-gray-300">Build these projects to strengthen your profile for this role</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      {matchData.suggestedProjects.map((project, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-500/40">
                              <TrendingUp className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{project}</h4>
                              <p className="text-sm text-gray-300 mt-2">
                                This project will help demonstrate the skills required for this position.
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="certifications" className="mt-6">
                <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_50%)]" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-white">Recommended Certifications</CardTitle>
                    <CardDescription className="text-gray-300">These certifications would strengthen your application</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="grid md:grid-cols-2 gap-4">
                      {matchData.certifications.map((cert, index) => (
                        <div key={index} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-purple-500/40">
                              <CheckCircle className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{cert}</h4>
                              <p className="text-sm text-gray-300 mt-1">Industry-recognized certification</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                onClick={() => setMatchData(null)} 
                variant="outline"
                className="px-8 py-6 text-lg border-slate-600 text-white hover:bg-slate-800 transition-all duration-300"
              >
                Analyze Another Job
              </Button>
              <Button className="px-8 py-6 text-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg hover:shadow-emerald-500/50 transition-all duration-300">
                Download Report
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-6 text-lg border-slate-600 text-white hover:bg-slate-800 transition-all duration-300"
              >
                Update Resume
              </Button>
            </div>
          </div>
        )}

        {/* Privacy & Information Footer */}
        <footer className="mt-16 border-t border-slate-700/50 bg-gradient-to-b from-transparent to-slate-900/50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                  About Job Matcher
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Smart AI matching technology that compares your resume against job descriptions. Identify skill gaps, 
                  get tailored recommendations, and understand exactly what employers are looking for.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                  Privacy & Confidentiality
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Your resume and job descriptions are processed securely and never stored permanently. We respect your 
                  privacy and don't share your information with employers or third parties without your explicit consent.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
                  Matching Insights
                </h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Skill compatibility analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Gap identification & advice
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Keyword optimization tips
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Personalized recommendations
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-800/50 text-center">
              <p className="text-xs text-gray-500">
                © 2025 Job Matcher. All rights reserved. • Your data is secure and confidential.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
