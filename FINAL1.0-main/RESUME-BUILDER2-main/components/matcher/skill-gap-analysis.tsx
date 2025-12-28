"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, TrendingUp } from "lucide-react"

interface SkillGapAnalysisProps {
  matchingSkills: string[]
  missingSkills: string[]
}

export function SkillGapAnalysis({ matchingSkills, missingSkills }: SkillGapAnalysisProps) {
  const totalSkills = matchingSkills.length + missingSkills.length
  const matchPercentage = Math.round((matchingSkills.length / totalSkills) * 100)

  return (
    <div className="space-y-6">
      <div className="text-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_50%)] rounded-2xl" />
        <div className="relative z-10">
          <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2 animate-pulse">{matchPercentage}%</div>
          <p className="text-white text-lg font-semibold">Skills Match Rate</p>
          <p className="text-sm text-gray-300 mt-2">
            {matchingSkills.length} of {totalSkills} required skills found
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-emerald-500/20 transition-all duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)]" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center text-emerald-300">
              <CheckCircle className="h-5 w-5 mr-2" />
              Matching Skills ({matchingSkills.length})
            </CardTitle>
            <CardDescription className="text-gray-300">Skills you already have that match the job requirements</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-wrap gap-2">
              {matchingSkills.map((skill) => (
                <Badge key={skill} variant="default" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
            {matchingSkills.length === 0 && <p className="text-sm text-gray-400">No matching skills found.</p>}
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-red-500/20 transition-all duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.1),transparent_50%)]" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center text-red-300">
              <XCircle className="h-5 w-5 mr-2" />
              Missing Skills ({missingSkills.length})
            </CardTitle>
            <CardDescription className="text-gray-300">Skills mentioned in the job description that you should consider adding</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <Badge key={skill} variant="destructive" className="bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all">
                  <XCircle className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
            {missingSkills.length === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-emerald-400 font-medium">All required skills found!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {missingSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Skill Development Priority
            </CardTitle>
            <CardDescription>Focus on these skills to improve your job match score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {missingSkills.slice(0, 3).map((skill, index) => (
                <div key={skill} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{skill}</span>
                  </div>
                  <Badge variant="secondary">High Priority</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
