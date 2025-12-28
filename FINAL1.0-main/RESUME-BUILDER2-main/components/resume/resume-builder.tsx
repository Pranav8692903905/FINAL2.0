"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Download, Eye } from "lucide-react"
import { ResumeEditor } from "./resume-editor"
import { ResumePreview } from "./resume-preview"
import { TemplateSelector } from "./template-selector"
import { ResumeAnalytics } from "./resume-analytics"
import { TipsPanel } from "./tips-panel"
import { ContentLibrary } from "./content-library"
import { useResume } from "./resume-context"
import type { Resume } from "./resume-context"

declare global {
  interface Window {
    html2pdf?: any
  }
}

export function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("edit")
  const { currentResume, setCurrentResume, saveResume } = useResume()

  const calculateCompletion = () => {
    if (!currentResume) return 0
    let completed = 0
    let total = 0

    currentResume.sections.forEach((section) => {
      switch (section.type) {
        case "personal":
          total += 4
          if (section.content.fullName) completed++
          if (section.content.email) completed++
          if (section.content.phone) completed++
          if (section.content.location) completed++
          break
        case "summary":
          total += 1
          if (section.content.text && section.content.text.length > 50) completed++
          break
        case "experience":
        case "education":
        case "skills":
        case "projects":
          total += 1
          if (section.content.items && section.content.items.length > 0) completed++
          break
      }
    })

    return Math.round((completed / total) * 100)
  }

  const completionPercentage = calculateCompletion()

  const handleCreateNew = (template: "modern" | "minimal" | "corporate") => {
    const newResume: Resume = {
      id: Math.random().toString(36).substr(2, 9),
      title: "Untitled Resume",
      template,
      sections: [
        {
          id: "personal",
          type: "personal",
          title: "Personal Information",
          content: {
            fullName: "",
            email: "",
            phone: "",
            location: "",
            website: "",
            linkedin: "",
          },
          order: 0,
        },
        {
          id: "summary",
          type: "summary",
          title: "Professional Summary",
          content: { text: "" },
          order: 1,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setCurrentResume(newResume)
  }

  const handleSave = () => {
    saveResume()
    // Show success message
  }

  const handleDownload = async () => {
    try {
      const element = document.getElementById("resume-download")
      if (!element) {
        alert("Resume element not found")
        return
      }

      // Check if html2pdf is available
      if (!window.html2pdf) {
        // Fallback: Create a simple print-to-PDF
        const printWindow = window.open("", "_blank")
        if (printWindow) {
          printWindow.document.write(element.innerHTML)
          printWindow.document.close()
          setTimeout(() => {
            printWindow.print()
          }, 250)
        }
        return
      }

      const opt = {
        margin: 10,
        filename: `${currentResume?.title || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      }

      window.html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download PDF. Please try again.")
    }
  }

  if (!currentResume) {
    return (
      <div className="min-h-screen bg-background p-6 relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
            style={{ backgroundImage: "url('/resume.avif')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/90 to-background/80" />
        </div>
        
        {/* Content */}
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Choose a Template
            </h1>
            <p className="text-muted-foreground text-lg">Select a professional template to get started with your resume</p>
          </div>
          <TemplateSelector onSelect={handleCreateNew} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: "url('/resume.avif')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/90 to-background/80" />
      </div>
      
      {/* Header */}
      <header className="border-b border-border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-sm sticky top-0 z-50 relative shadow-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-white">{currentResume.title}</h1>
              <div className="flex items-center gap-2">
                <Progress value={completionPercentage} className="w-24 h-2" />
                <span className="text-xs text-gray-300 font-medium">{completionPercentage}%</span>
              </div>
              <Badge 
                variant="secondary" 
                className="capitalize bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-300"
              >
                {currentResume.template}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                className="border-slate-600 text-white hover:bg-slate-800 transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="border-emerald-600 text-emerald-300 hover:bg-emerald-500/20 transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveTab("preview")}
                className="border-purple-600 text-purple-300 hover:bg-purple-500/20 transition-all duration-300"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-800 to-slate-900 p-2 rounded-2xl border border-slate-700">
            <TabsTrigger 
              value="edit"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Edit
            </TabsTrigger>
            <TabsTrigger 
              value="preview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                <ResumeEditor />
              </div>
              <div className="hidden lg:block space-y-6">
                <ResumeAnalytics resume={currentResume} />
              </div>
              <div className="hidden lg:block space-y-6">
                <Card className="sticky top-24 border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.1),transparent_50%)]" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
                      <Eye className="h-4 w-4 text-purple-400" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="scale-50 origin-top-left w-[200%] h-[600px] overflow-hidden rounded-lg border border-slate-700">
                      <ResumePreview />
                    </div>
                  </CardContent>
                </Card>
                <div className="sticky top-[520px]">
                  <TipsPanel />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <div id="resume-download" className="mb-4">
                <ResumePreview />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white">Resume Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  <div>
                    <label className="text-sm font-medium text-white">Template</label>
                    <TemplateSelector
                      onSelect={(template) => {
                        if (currentResume) {
                          setCurrentResume({ ...currentResume, template })
                        }
                      }}
                      selectedTemplate={currentResume.template}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium block text-white">Header Color</label>
                    <p className="text-xs text-gray-300 mb-3">Choose a color for your resume header and section titles</p>
                    <div className="grid grid-cols-8 gap-3">
                      {[
                        { name: "Blue", value: "#3b82f6" },
                        { name: "Indigo", value: "#6366f1" },
                        { name: "Purple", value: "#8b5cf6" },
                        { name: "Pink", value: "#ec4899" },
                        { name: "Red", value: "#ef4444" },
                        { name: "Orange", value: "#f97316" },
                        { name: "Green", value: "#10b981" },
                        { name: "Teal", value: "#14b8a6" },
                        { name: "Cyan", value: "#06b6d4" },
                        { name: "Navy", value: "#1e40af" },
                        { name: "Slate", value: "#475569" },
                        { name: "Black", value: "#000000" },
                      ].map((color) => (
                        <button
                          key={color.value}
                          onClick={() => {
                            if (currentResume) {
                              setCurrentResume({ ...currentResume, headerColor: color.value })
                            }
                          }}
                          className={`w-12 h-12 rounded-lg transition-all hover:scale-110 border-2 ${
                            currentResume.headerColor === color.value
                              ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-blue-500 border-blue-500"
                              : "hover:ring-2 hover:ring-offset-2 hover:ring-offset-slate-900 hover:ring-gray-400 border-slate-700"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                      <input
                        type="color"
                        value={currentResume.headerColor || "#3b82f6"}
                        onChange={(e) => {
                          if (currentResume) {
                            setCurrentResume({ ...currentResume, headerColor: e.target.value })
                          }
                        }}
                        className="w-12 h-12 rounded-lg cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-white">Custom Color</p>
                        <p className="text-xs text-gray-400">{currentResume.headerColor || "#3b82f6"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Footer Content Library */}
          <div className="mt-10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Content Library
              </h2>
              <ContentLibrary />
            </div>
          </div>
        </Tabs>

        {/* Privacy & Information Footer */}
        <footer className="mt-16 border-t border-slate-700/50 bg-gradient-to-b from-transparent to-slate-900/50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                  About Resume Builder
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Create professional, ATS-friendly resumes with our intuitive builder. Choose from modern templates, 
                  get real-time analytics, and access curated content to make your resume stand out.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                  Your Privacy Matters
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  All your resume data is stored locally in your browser. We don't upload, track, or share your personal 
                  information with any third parties. Your data stays private and secure on your device.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
                  Features at a Glance
                </h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Multiple professional templates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Real-time completion tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Content library & power words
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                    Export to PDF instantly
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-800/50 text-center">
              <p className="text-xs text-gray-500">
                © 2025 Resume Builder. All rights reserved. • Your privacy is protected - all data stored locally.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
