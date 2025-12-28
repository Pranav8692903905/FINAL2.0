"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, XCircle, Info, TrendingUp } from "lucide-react"

interface Suggestion {
  type: "critical" | "warning" | "info"
  category: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
}

interface ImprovementSuggestionsProps {
  suggestions: Suggestion[]
}

export function ImprovementSuggestions({ suggestions }: ImprovementSuggestionsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const impactOrder = { high: 3, medium: 2, low: 1 }
    return impactOrder[b.impact] - impactOrder[a.impact]
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white">Improvement Suggestions</h3>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-gray-300">{suggestions.length} suggestions</span>
        </div>
      </div>

      {sortedSuggestions.map((suggestion, index) => (
        <Card key={index} className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-l-4 border-l-blue-500/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_50%)]" />
          <CardHeader className="pb-3 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/40">{getIcon(suggestion.type)}</div>
                <div>
                  <CardTitle className="text-base text-white">{suggestion.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-300">{suggestion.category}</CardDescription>
                </div>
              </div>
              <Badge className={`${getImpactColor(suggestion.impact)} border-0`} variant="secondary">
                {suggestion.impact} impact
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <p className="text-sm text-gray-300 leading-relaxed">{suggestion.description}</p>
          </CardContent>
        </Card>
      ))}

      {suggestions.length === 0 && (
        <Card className="text-center py-8 border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_50%)]" />
          <CardContent className="relative z-10">
            <TrendingUp className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-emerald-300 mb-2">Excellent Work!</h3>
            <p className="text-gray-300">Your resume looks great! No major improvements needed at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
