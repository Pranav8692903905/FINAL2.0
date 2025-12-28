"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface AnalysisResultsProps {
  score: number
  category: string
  details: string[]
  recommendations: string[]
}

export function AnalysisResults({ score, category, details, recommendations }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
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
          <div className="flex items-center space-x-3">
            {getScoreIcon(score)}
            <div>
              <CardTitle className="text-lg">{category}</CardTitle>
              <CardDescription>Analysis results and recommendations</CardDescription>
            </div>
          </div>
          <Badge variant={getScoreVariant(score)} className="text-lg px-3 py-1">
            {score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={score} className="w-full" />

        {details.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Analysis Details</h4>
            <ul className="space-y-1">
              {details.map((detail, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="w-2 h-2 bg-secondary rounded-full mt-2 mr-2 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
