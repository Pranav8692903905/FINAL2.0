"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Copy, CheckCircle } from "lucide-react"

export function ContentLibrary() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(id)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const bulletPoints = {
    software: [
      "Developed and maintained scalable web applications serving 100K+ daily users",
      "Implemented RESTful APIs reducing response time by 40% and improving system efficiency",
      "Led migration of legacy systems to modern cloud infrastructure, reducing costs by 30%",
      "Collaborated with cross-functional teams to deliver 15+ features in agile environment",
      "Optimized database queries resulting in 50% faster load times and improved user experience"
    ],
    marketing: [
      "Increased website traffic by 85% through strategic SEO optimization and content marketing",
      "Managed social media campaigns reaching 2M+ impressions and 150K engagements monthly",
      "Executed email marketing campaigns with 35% open rate and 12% conversion rate",
      "Developed brand strategy resulting in 45% increase in customer acquisition",
      "Analyzed marketing metrics to optimize campaigns, improving ROI by 60%"
    ],
    sales: [
      "Exceeded quarterly sales targets by 125% generating $2.5M in annual revenue",
      "Built and maintained relationships with 50+ enterprise clients across multiple industries",
      "Negotiated and closed deals worth $500K+ with Fortune 500 companies",
      "Developed sales presentations and proposals resulting in 40% win rate",
      "Trained and mentored team of 5 junior sales representatives"
    ],
    management: [
      "Led team of 12 professionals across 3 projects, delivering all milestones on time",
      "Implemented agile methodologies improving team productivity by 35%",
      "Managed annual budget of $1.5M while maintaining 95% stakeholder satisfaction",
      "Coordinated with C-level executives to align project goals with business objectives",
      "Reduced project delivery time by 25% through process optimization and automation"
    ]
  }

  const summaryTemplates = {
    software: [
      "Results-driven Software Engineer with 5+ years of experience building scalable web applications. Expertise in full-stack development, cloud architecture, and agile methodologies. Proven track record of delivering high-quality solutions that drive business growth.",
      "Innovative Full-Stack Developer specializing in modern JavaScript frameworks and cloud technologies. Passionate about creating efficient, user-centric applications. Strong problem-solving skills with experience in both startup and enterprise environments."
    ],
    marketing: [
      "Creative Digital Marketing Specialist with expertise in SEO, content marketing, and social media strategy. Proven ability to increase brand awareness and drive customer engagement through data-driven campaigns. 3+ years of experience in B2B and B2C marketing.",
      "Strategic Marketing Professional with strong analytical skills and passion for brand storytelling. Experience managing multi-channel campaigns and optimizing marketing funnels for maximum ROI. Skilled in Google Analytics, SEO, and content creation."
    ],
    sales: [
      "Dynamic Sales Professional with track record of exceeding quotas and building lasting client relationships. 5+ years of B2B sales experience in SaaS and enterprise solutions. Expert in consultative selling and closing complex deals.",
      "High-performing Account Executive specializing in enterprise software sales. Proven ability to identify client needs and deliver tailored solutions. Consistently ranked in top 10% of sales team."
    ]
  }

  const skillsByCategory = {
    technical: [
      "JavaScript/TypeScript", "React.js", "Node.js", "Python", "SQL", "MongoDB",
      "AWS", "Docker", "Kubernetes", "Git", "CI/CD", "REST APIs", "GraphQL",
      "Agile/Scrum", "Test-Driven Development", "System Design"
    ],
    soft: [
      "Leadership", "Communication", "Problem Solving", "Team Collaboration",
      "Project Management", "Time Management", "Critical Thinking", "Adaptability",
      "Stakeholder Management", "Conflict Resolution", "Presentation Skills"
    ],
    tools: [
      "Jira", "Confluence", "Figma", "Adobe Creative Suite", "Salesforce",
      "HubSpot", "Google Analytics", "Tableau", "Power BI", "Slack", "MS Office"
    ]
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_50%)]" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <BookOpen className="h-5 w-5 text-purple-400" />
          Content Library
        </CardTitle>
        <p className="text-xs text-gray-300 mt-2">Click any item to copy it to clipboard</p>
      </CardHeader>

      <CardContent className="relative z-10">
        <Tabs defaultValue="bullets" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-1">
            <TabsTrigger value="bullets" className="text-xs">Bullet Points</TabsTrigger>
            <TabsTrigger value="summaries" className="text-xs">Summaries</TabsTrigger>
            <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="bullets" className="mt-4 space-y-4">
            {Object.entries(bulletPoints).map(([category, points]) => (
              <div key={category}>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 mb-3 capitalize">
                  {category}
                </Badge>
                <div className="space-y-2">
                  {points.map((point, index) => {
                    const id = `bullet-${category}-${index}`
                    return (
                      <div
                        key={index}
                        onClick={() => copyToClipboard(point, id)}
                        className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 hover:border-purple-500/40 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <p className="text-xs text-gray-300 leading-relaxed">{point}</p>
                          </div>
                          {copiedIndex === id ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500 group-hover:text-purple-400 flex-shrink-0 transition-colors" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="summaries" className="mt-4 space-y-4">
            {Object.entries(summaryTemplates).map(([category, templates]) => (
              <div key={category}>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 mb-3 capitalize">
                  {category}
                </Badge>
                <div className="space-y-3">
                  {templates.map((template, index) => {
                    const id = `summary-${category}-${index}`
                    return (
                      <div
                        key={index}
                        onClick={() => copyToClipboard(template, id)}
                        className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-blue-500/40 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <p className="text-sm text-gray-300 leading-relaxed">{template}</p>
                          </div>
                          {copiedIndex === id ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-1" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500 group-hover:text-blue-400 flex-shrink-0 mt-1 transition-colors" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="mt-4 space-y-4">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category}>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 mb-3 capitalize">
                  {category}
                </Badge>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => {
                    const id = `skill-${category}-${index}`
                    return (
                      <Badge
                        key={index}
                        onClick={() => copyToClipboard(skill, id)}
                        className={`${
                          copiedIndex === id
                            ? "bg-emerald-500/30 border-emerald-500/60"
                            : "bg-slate-800/50 border-slate-700 hover:border-emerald-500/40"
                        } text-gray-300 cursor-pointer transition-all text-xs`}
                      >
                        {skill}
                        {copiedIndex === id && (
                          <CheckCircle className="h-3 w-3 ml-1 inline" />
                        )}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
