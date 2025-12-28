"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Copy, Download, RefreshCw } from "lucide-react"

interface CoverLetterData {
  jobTitle: string
  company: string
  hiringManager: string
  tone: "professional" | "enthusiastic" | "creative" | "formal"
  experience: string
  skills: string
  motivation: string
}

export function CoverLetterGenerator() {
  const [formData, setFormData] = useState<CoverLetterData>({
    jobTitle: "",
    company: "",
    hiringManager: "",
    tone: "professional",
    experience: "",
    skills: "",
    motivation: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [activeTab, setActiveTab] = useState("form")

  const generateCoverLetter = async () => {
    setIsGenerating(true)

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock generated cover letter
    const mockLetter = `Dear ${formData.hiringManager || "Hiring Manager"},

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.company}. With my background in ${formData.experience}, I am excited about the opportunity to contribute to your team's success.

In my previous roles, I have developed expertise in ${formData.skills}, which directly aligns with the requirements for this position. ${formData.motivation}

What particularly draws me to ${formData.company} is your commitment to innovation and excellence in the industry. I am eager to bring my passion for technology and problem-solving to help drive your company's continued growth and success.

I have attached my resume for your review and would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team. Thank you for considering my application.

Sincerely,
[Your Name]`

    setGeneratedLetter(mockLetter)
    setActiveTab("result")
    setIsGenerating(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter)
  }

  const downloadLetter = () => {
    const element = document.createElement("a")
    const file = new Blob([generatedLetter], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `cover-letter-${formData.company}-${formData.jobTitle}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI Cover Letter Generator</h2>
        <p className="text-gray-300 text-lg">Create personalized cover letters that stand out to employers</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-slate-800 to-slate-900 p-2 rounded-2xl border border-slate-700">
          <TabsTrigger value="form" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl transition-all duration-300">Input Details</TabsTrigger>
          <TabsTrigger value="result" disabled={!generatedLetter} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300">
            Generated Letter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-6">
          <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white text-xl">Job & Company Information</CardTitle>
              <CardDescription className="text-gray-300">Provide details about the position and company you're applying to</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Google"
                  />
                </div>
                <div>
                  <Label htmlFor="hiringManager">Hiring Manager (Optional)</Label>
                  <Input
                    id="hiringManager"
                    value={formData.hiringManager}
                    onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
                    placeholder="e.g., Ms. Johnson"
                  />
                </div>
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value: any) => setFormData({ ...formData, tone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="experience">Relevant Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Describe your relevant work experience and achievements..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="skills">Key Skills</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="List your key skills relevant to this position..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="motivation">Why This Company/Role?</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="Explain why you're interested in this specific role and company..."
                  rows={3}
                />
              </div>

              <Button
                onClick={generateCoverLetter}
                disabled={!formData.jobTitle || !formData.company || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating Cover Letter...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Generated Cover Letter</CardTitle>
                  <CardDescription>
                    AI-generated cover letter for {formData.jobTitle} at {formData.company}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadLetter}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("form")}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-6 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{generatedLetter}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
