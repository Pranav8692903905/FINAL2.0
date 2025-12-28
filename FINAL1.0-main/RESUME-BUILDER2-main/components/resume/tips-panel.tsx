"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, CheckCircle, Target, Sparkles } from "lucide-react"

export function TipsPanel() {
  const tips = [
    {
      icon: <Target className="h-5 w-5 text-blue-400" />,
      category: "Content",
      title: "Quantify Achievements",
      description: "Use numbers and metrics to demonstrate your impact. Instead of 'improved sales,' write 'increased sales by 35%'",
      color: "blue"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-emerald-400" />,
      category: "Formatting",
      title: "Use Action Verbs",
      description: "Start bullet points with strong verbs: Led, Developed, Implemented, Achieved, Optimized",
      color: "emerald"
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-400" />,
      category: "ATS",
      title: "Include Keywords",
      description: "Match keywords from job descriptions to pass ATS scanners. Use industry-standard terms",
      color: "purple"
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-yellow-400" />,
      category: "Length",
      title: "Keep It Concise",
      description: "Aim for 1-2 pages. Use 3-5 bullet points per job. Be clear and direct",
      color: "yellow"
    }
  ]

  const actionVerbs = [
    "Achieved", "Analyzed", "Built", "Created", "Delivered", "Developed",
    "Enhanced", "Established", "Executed", "Generated", "Implemented", "Improved",
    "Increased", "Launched", "Led", "Managed", "Optimized", "Organized",
    "Reduced", "Streamlined", "Transformed", "Upgraded"
  ]

  return (
    <div className="space-y-6">
      {/* Tips Card */}
      <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden sticky top-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_50%)]" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-white">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            Tips & Best Practices
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {tips.map((tip, index) => (
            <div
              key={index}
              className={`bg-${tip.color}-500/10 rounded-xl p-4 border border-${tip.color}-500/20 hover:border-${tip.color}-500/40 transition-all duration-300`}
            >
              <div className="flex items-start gap-3">
                <div className={`bg-${tip.color}-500/20 p-2 rounded-lg border border-${tip.color}-500/40`}>
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`bg-${tip.color}-500/20 text-${tip.color}-300 border-${tip.color}-500/40 text-xs`}>
                      {tip.category}
                    </Badge>
                    <h4 className="text-sm font-semibold text-white">{tip.title}</h4>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Verbs Card */}
      <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)]" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Power Words
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="flex flex-wrap gap-2">
            {actionVerbs.map((verb, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 cursor-pointer transition-all text-xs"
                title="Click to copy"
                onClick={() => navigator.clipboard.writeText(verb)}
              >
                {verb}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Click any word to copy it</p>
        </CardContent>
      </Card>
    </div>
  )
}
