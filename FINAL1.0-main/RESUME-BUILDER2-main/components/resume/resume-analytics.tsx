"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, TrendingUp, FileText, Zap } from "lucide-react"
import type { Resume } from "./resume-context"

interface ResumeAnalyticsProps {
  resume: Resume
}

export function ResumeAnalytics({ resume }: ResumeAnalyticsProps) {
  // Calculate completion percentage
  const calculateCompletion = () => {
    let completed = 0
    let total = 0

    resume.sections.forEach((section) => {
      switch (section.type) {
        case "personal":
          total += 6 // fullName, email, phone, location, website, linkedin
          if (section.content.fullName) completed++
          if (section.content.email) completed++
          if (section.content.phone) completed++
          if (section.content.location) completed++
          if (section.content.website) completed++
          if (section.content.linkedin) completed++
          break
        case "summary":
          total += 1
          if (section.content.text && section.content.text.length > 50) completed++
          break
        case "experience":
          total += 1
          if (section.content.items && section.content.items.length > 0) completed++
          break
        case "education":
          total += 1
          if (section.content.items && section.content.items.length > 0) completed++
          break
        case "skills":
          total += 1
          if (section.content.items && section.content.items.length > 2) completed++
          break
        case "projects":
          total += 1
          if (section.content.items && section.content.items.length > 0) completed++
          break
      }
    })

    return Math.round((completed / total) * 100)
  }

  // Calculate word count
  const calculateWordCount = () => {
    let totalWords = 0
    resume.sections.forEach((section) => {
      if (section.content.text) {
        totalWords += section.content.text.split(/\s+/).length
      }
      if (section.content.items) {
        section.content.items.forEach((item: any) => {
          if (item.description) totalWords += item.description.split(/\s+/).length
          if (item.responsibilities) totalWords += item.responsibilities.split(/\s+/).length
        })
      }
    })
    return totalWords
  }

  // Calculate section scores
  const getSectionScores = () => {
    const scores: { name: string; status: "complete" | "partial" | "empty" }[] = []

    resume.sections.forEach((section) => {
      let status: "complete" | "partial" | "empty" = "empty"

      switch (section.type) {
        case "personal":
          const filledFields = [
            section.content.fullName,
            section.content.email,
            section.content.phone,
            section.content.location,
          ].filter(Boolean).length
          status = filledFields >= 4 ? "complete" : filledFields > 0 ? "partial" : "empty"
          break
        case "summary":
          status = section.content.text && section.content.text.length > 100 ? "complete" : 
                   section.content.text ? "partial" : "empty"
          break
        case "experience":
        case "education":
        case "skills":
        case "projects":
          const itemCount = section.content.items?.length || 0
          status = itemCount >= 2 ? "complete" : itemCount > 0 ? "partial" : "empty"
          break
      }

      scores.push({ name: section.title, status })
    })

    return scores
  }

  const completionPercentage = calculateCompletion()
  const wordCount = calculateWordCount()
  const sectionScores = getSectionScores()
  const completedSections = sectionScores.filter(s => s.status === "complete").length
  const totalSections = sectionScores.length

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-400"
    if (percentage >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case "partial":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">Complete</Badge>
      case "partial":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/40">Partial</Badge>
      default:
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/40">Empty</Badge>
    }
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden sticky top-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          Resume Analytics
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Overall Completion */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300">Overall Completion</span>
            <span className={`text-2xl font-bold ${getCompletionColor(completionPercentage)}`}>
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-3 bg-slate-700" />
          <p className="text-xs text-gray-400 mt-2">
            {completedSections} of {totalSections} sections complete
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
            <FileText className="h-5 w-5 text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-white">{wordCount}</div>
            <div className="text-xs text-gray-300">Total Words</div>
          </div>
          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
            <Zap className="h-5 w-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-white">{totalSections}</div>
            <div className="text-xs text-gray-300">Sections</div>
          </div>
        </div>

        {/* Section Status */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Section Status</h4>
          <div className="space-y-2">
            {sectionScores.map((section, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(section.status)}
                  <span className="text-sm text-gray-300">{section.name}</span>
                </div>
                {getStatusBadge(section.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {completionPercentage < 80 && (
          <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-yellow-300 mb-1">Complete Your Resume</h5>
                <p className="text-xs text-gray-300">
                  Fill in all sections to increase your completion score and improve your chances.
                </p>
              </div>
            </div>
          </div>
        )}

        {completionPercentage >= 80 && (
          <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-emerald-300 mb-1">Looking Great!</h5>
                <p className="text-xs text-gray-300">
                  Your resume is well-developed. Consider reviewing for final touches.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
