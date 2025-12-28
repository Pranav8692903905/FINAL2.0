"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ScoreBreakdownProps {
  data: {
    overallScore: number
    atsCompatibility: number
    keywordMatch: number
    formatting: number
    content: number
    sections: Array<{
      name: string
      score: number
      issues: string[]
    }>
  }
}

export function ScoreBreakdown({ data }: ScoreBreakdownProps) {
  const chartData = [
    { name: "ATS Compatibility", score: data.atsCompatibility },
    { name: "Keywords", score: data.keywordMatch },
    { name: "Formatting", score: data.formatting },
    { name: "Content", score: data.content },
  ]

  const sectionData = data.sections.map((section) => ({
    name: section.name.replace(" ", "\n"),
    score: section.score,
  }))

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-white">Score Categories</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_50%)]" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-white">Section Scores</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)]" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-white">Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Core Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>ATS Compatibility</span>
                    <span className="font-medium">{data.atsCompatibility}%</span>
                  </div>
                  <Progress value={data.atsCompatibility} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Keyword Optimization</span>
                    <span className="font-medium">{data.keywordMatch}%</span>
                  </div>
                  <Progress value={data.keywordMatch} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Formatting Quality</span>
                    <span className="font-medium">{data.formatting}%</span>
                  </div>
                  <Progress value={data.formatting} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Content Quality</span>
                    <span className="font-medium">{data.content}%</span>
                  </div>
                  <Progress value={data.content} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Performance Insights</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span>Strengths</span>
                  <span className="font-medium text-green-600">
                    {chartData.filter((item) => item.score >= 80).length} areas
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span>Needs Improvement</span>
                  <span className="font-medium text-yellow-600">
                    {chartData.filter((item) => item.score >= 60 && item.score < 80).length} areas
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span>Critical Issues</span>
                  <span className="font-medium text-red-600">
                    {chartData.filter((item) => item.score < 60).length} areas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
