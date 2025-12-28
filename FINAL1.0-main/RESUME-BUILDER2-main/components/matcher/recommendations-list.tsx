"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Award, Code, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface Recommendation {
  type: "skill" | "experience" | "keyword" | "certification"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  impact: string
}

interface RecommendationsListProps {
  recommendations: Recommendation[]
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "skill":
        return <Code className="h-5 w-5 text-blue-500" />
      case "experience":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "keyword":
        return <Info className="h-5 w-5 text-purple-500" />
      case "certification":
        return <Award className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
        <Badge variant="secondary">{recommendations.length} recommendations</Badge>
      </div>

      {sortedRecommendations.map((rec, index) => (
        <Card key={index} className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-l-4 border-l-blue-500/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_50%)]" />
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/40">{getIcon(rec.type)}</div>
                <div>
                  <CardTitle className="text-base text-white">{rec.title}</CardTitle>
                  <CardDescription className="text-sm capitalize text-gray-300">{rec.type} Recommendation</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getPriorityIcon(rec.priority)}
                <Badge className={getPriorityColor(rec.priority)} variant="secondary">
                  {rec.priority} priority
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{rec.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">{rec.impact}</span>
              </div>
              <Button size="sm" variant="outline">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {recommendations.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-600 mb-2">Perfect Match!</h3>
            <p className="text-muted-foreground">
              Your resume is well-aligned with this job description. No major improvements needed.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
