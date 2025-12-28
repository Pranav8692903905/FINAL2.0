"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Copy, RefreshCw } from "lucide-react"

interface BioData {
  name: string
  currentRole: string
  industry: string
  experience: string
  skills: string
  achievements: string
  tone: "professional" | "casual" | "creative" | "executive"
  length: "short" | "medium" | "long"
}

export function LinkedInBioGenerator() {
  const [formData, setFormData] = useState<BioData>({
    name: "",
    currentRole: "",
    industry: "",
    experience: "",
    skills: "",
    achievements: "",
    tone: "professional",
    length: "medium",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBios, setGeneratedBios] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("form")

  const generateBio = async () => {
    setIsGenerating(true)

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock generated bios
    const mockBios = [
      `${formData.currentRole} with ${formData.experience} in ${formData.industry}. Passionate about ${formData.skills} and driving innovation. ${formData.achievements} 

Let's connect and explore opportunities to collaborate!`,

      `Experienced ${formData.currentRole} specializing in ${formData.industry}. ${formData.experience}

Core expertise: ${formData.skills}

${formData.achievements}

Always excited to connect with like-minded professionals and discuss industry trends.`,

      `${formData.name} | ${formData.currentRole}

🚀 ${formData.experience}
💡 Expertise in ${formData.skills}
🏆 ${formData.achievements}

Open to networking and new opportunities in ${formData.industry}.`,
    ]

    setGeneratedBios(mockBios)
    setActiveTab("result")
    setIsGenerating(false)
  }

  const copyToClipboard = (bio: string) => {
    navigator.clipboard.writeText(bio)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">LinkedIn Bio Generator</h2>
        <p className="text-gray-300 text-lg">Create compelling LinkedIn summaries that attract opportunities</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-slate-800 to-slate-900 p-2 rounded-2xl border border-slate-700">
          <TabsTrigger value="form" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300">Input Details</TabsTrigger>
          <TabsTrigger value="result" disabled={generatedBios.length === 0} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl transition-all duration-300">
            Generated Bios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-6">
          <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_50%)]" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-white text-xl">Professional Information</CardTitle>
              <CardDescription className="text-gray-300">Tell us about your professional background and goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="currentRole">Current Role/Title</Label>
                  <Input
                    id="currentRole"
                    value={formData.currentRole}
                    onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., Technology, Healthcare, Finance"
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
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="length">Bio Length</Label>
                <Select
                  value={formData.length}
                  onValueChange={(value: any) => setFormData({ ...formData, length: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                    <SelectItem value="medium">Medium (3-4 sentences)</SelectItem>
                    <SelectItem value="long">Long (5+ sentences)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience">Professional Experience</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Describe your professional background and experience..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="skills">Key Skills & Expertise</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="List your key skills and areas of expertise..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="achievements">Notable Achievements</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="Highlight your key achievements and accomplishments..."
                  rows={3}
                />
              </div>

              <Button
                onClick={generateBio}
                disabled={!formData.currentRole || !formData.industry || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating LinkedIn Bios...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate LinkedIn Bio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="mt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Choose Your Favorite Bio</h3>
              <p className="text-muted-foreground">We've generated multiple versions for you to choose from</p>
            </div>

            {generatedBios.map((bio, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Version {index + 1}</Badge>
                      <span className="text-sm text-muted-foreground">{bio.length} characters</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(bio)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="text-center">
              <Button variant="outline" onClick={() => setActiveTab("form")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Versions
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
