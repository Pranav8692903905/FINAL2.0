"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollAnimation } from "@/components/scroll-animation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, BarChart3, Calendar, MoreVertical, Target, Zap } from "lucide-react"
import type { Resume } from "@/components/resume/resume-context"
import Link from "next/link"

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([])

  useEffect(() => {
    // Load saved resumes
    const savedResumes = JSON.parse(localStorage.getItem("resumate_resumes") || "[]")
    setResumes(savedResumes)
  }, [])

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('large.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgba(2,6,23,0.6)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.14),transparent_35%)] blur-3xl" />

      {/* Header */}
      <header className="relative z-10 border-b border-primary/20 bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-900/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                ResuMate
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Welcome to your dashboard</div>
          </div>
        </div>
      </header>

        {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
            Your Dashboard
          </h1>
          <p className="text-gray-300 text-lg">Manage your resumes and track your job search progress</p>
        </div>

        

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/builder">
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 via-slate-800/80 to-blue-600/10 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer hover:scale-105 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.2),transparent_50%)]" />
              <CardHeader className="relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Create Resume</CardTitle>
                    <CardDescription className="text-gray-300 text-xs">Build from scratch</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/analyzer">
            <Card className="border-0 bg-gradient-to-br from-purple-500/10 via-slate-800/80 to-purple-600/10 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer hover:scale-105 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.2),transparent_50%)]" />
              <CardHeader className="relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Analyze Resume</CardTitle>
                    <CardDescription className="text-gray-300 text-xs">ATS score & tips</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/matcher">
            <Card className="border-0 bg-gradient-to-br from-emerald-500/10 via-slate-800/80 to-emerald-600/10 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-emerald-500/30 transition-all duration-300 cursor-pointer hover:scale-105 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_50%)]" />
              <CardHeader className="relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Job Matcher</CardTitle>
                    <CardDescription className="text-gray-300 text-xs">Match against jobs</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/ai-tools">
            <Card className="border-0 bg-gradient-to-br from-cyan-500/10 via-slate-800/80 to-cyan-600/10 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-cyan-500/30 transition-all duration-300 cursor-pointer hover:scale-105 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.2),transparent_50%)]" />
              <CardHeader className="relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 animate-pulse">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                      AI Tools
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-xs">Letters, bios & more</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Resumes */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary via-accent to-purple-400 bg-clip-text text-transparent">
              Your Resumes
            </h2>
            <Link href="/builder">
              <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-6 text-lg">
                <Plus className="h-5 w-5 mr-2" />
                New Resume
              </Button>
            </Link>
          </div>

          {resumes.length === 0 ? (
            <Card className="text-center py-16 border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)]" />
              <CardContent className="relative z-10">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">No resumes yet</h3>
                <p className="text-gray-300 mb-6 text-lg">Create your first professional resume to get started</p>
                <Link href="/builder">
                  <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-6 text-lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Resume
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className="border-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-md shadow-2xl overflow-hidden hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_50%)]" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-white">{resume.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2 mt-2 text-gray-300">
                          <Calendar className="h-3 w-3 text-blue-400" />
                          <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="hover:bg-blue-500/20 text-blue-300">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="capitalize bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/40"
                      >
                        {resume.template}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-500/40 hover:bg-blue-500/20 text-blue-300 bg-transparent"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-500/40 hover:bg-purple-500/20 text-purple-300 bg-transparent"
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Centered example header above images (uppercase + separators) */}
        <div className="w-full flex flex-col items-center my-12">
          <hr className="w-1/4 border-t border-primary/20 mb-4" />
          <h2 className="text-3xl font-bold text-center text-primary uppercase tracking-wide"> some example of resume</h2>
          <hr className="w-1/4 border-t border-primary/20 mt-4" />
        </div>

        {/* Image left + bold writeup right */}
        <div className="mt-10 w-full">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <img src="/example.avif" alt="Dashboard visual" className="h-80 w-56 rounded-lg shadow-lg object-cover" />
            </div>
            <ScrollAnimation animation="fadeInRight" delay={100} className="flex-1">
              <h3 className="text-2xl font-bold text-primary mb-2">Craft stronger resumes</h3>
              <p className="font-bold text-lg text-muted-foreground">
                Highlight achievements, tailor your resume to job descriptions, and optimize for ATS compatibility.
                Use ResuMate to create polished, professional resumes that get noticed.
              </p>
            </ScrollAnimation>
          </div>
        </div>

        {/* Final section: writeup left + image right */}
        <div className="mt-12">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
            <ScrollAnimation animation="fadeInLeft" delay={100} className="flex-1 text-left">
              <h3 className="text-2xl font-extrabold text-primary mb-2">Improve Your Resume</h3>
              <p className="text-muted-foreground mb-4 font-semibold">
                Tailor your resume to each job, highlight measurable achievements, and include keywords that match the role.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 font-medium">
                <li><strong>Highlight achievements:</strong> Prefer numbers and outcomes over vague duties.</li>
                <li><strong>Customize for role:</strong> Mirror job keywords and prioritize relevant skills.</li>
                <li><strong>Keep it concise:</strong> One to two pages with clear section headings.</li>
              </ul>
            </ScrollAnimation>
            <div className="flex-shrink-0">
              <img
                src="/example 2.webp"
                alt="Second dashboard image"
                className="rounded-lg shadow-lg object-cover"
                style={{ width: 240, height: 300 }}
              />
            </div>
          </div>
        </div>
        
        {/* Example 3: image left + writeup right (responsive) */}
        <div className="mt-6">
          <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src="/example 3.jpg"
                alt="Example 3"
                className="rounded-lg shadow-lg object-cover"
                style={{ width: 240, height: 300 }}
              />
            </div>
            <ScrollAnimation animation="fadeInRight" delay={100} className="flex-1 text-left md:text-right md:pl-4">
              <h3 className="text-2xl font-extrabold text-primary mb-2">Resume Tips & Best Practices</h3>
              <p className="text-muted-foreground mb-3 font-semibold">
                Make your resume stand out with clear formatting, measurable achievements, and tailored keywords.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 font-medium">
                <li><strong>Quantify achievements:</strong> Use numbers to show impact.</li>
                <li><strong>Tailor per role:</strong> Mirror job keywords and prioritize relevant skills.</li>
                <li><strong>Concise & clean:</strong> Use clear headings and bullet points.</li>
              </ul>
            </ScrollAnimation>
          </div>
        </div>
        

        {/* Footer: About / Content / Privacy + name & year */}
        <footer className="border-t border-primary/20 bg-slate-900/80 mt-8">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
              <div className="mb-2 md:mb-0">
                <span className="text-primary font-medium">ResuMate</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/about" className="hover:text-primary">About</Link>
                <Link href="/content-policy" className="hover:text-primary">Content</Link>
                <Link href="/privacy" className="hover:text-primary">Privacy</Link>
              </div>
              <div className="mt-2 md:mt-0 text-xs text-muted-foreground/80">
                ResuMate • © {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
