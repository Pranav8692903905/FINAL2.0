"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface MatchResultsProps {
  overallMatch: number
  skillsMatch: number
  experienceMatch: number
  keywordMatch: number
}

export function MatchResults({ overallMatch, skillsMatch, experienceMatch, keywordMatch }: MatchResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Job Match Results</CardTitle>
            <CardDescription>How well your resume matches this job description</CardDescription>
          </div>
          <Badge variant={getScoreVariant(overallMatch)} className="text-lg px-3 py-1">
            {overallMatch}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(overallMatch)}`}>{overallMatch}%</div>
            <p className="text-sm text-muted-foreground">Overall Match</p>
            <Progress value={overallMatch} className="mt-2" />
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(skillsMatch)}`}>{skillsMatch}%</div>
            <p className="text-sm text-muted-foreground">Skills Match</p>
            <Progress value={skillsMatch} className="mt-2" />
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(experienceMatch)}`}>{experienceMatch}%</div>
            <p className="text-sm text-muted-foreground">Experience Match</p>
            <Progress value={experienceMatch} className="mt-2" />
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(keywordMatch)}`}>{keywordMatch}%</div>
            <p className="text-sm text-muted-foreground">Keywords Match</p>
            <Progress value={keywordMatch} className="mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
