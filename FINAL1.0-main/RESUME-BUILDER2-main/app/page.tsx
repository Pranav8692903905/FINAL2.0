"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, BarChart3, Target, Zap, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import { ScrollAnimation } from "@/components/scroll-animation"

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Glow Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Blue glow top-left */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse opacity-50" />
        {/* Green glow top-right */}
        <div className="absolute -top-20 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse opacity-40 animation-delay-2000" />
        {/* Purple glow bottom-left */}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-50 animation-delay-4000" />
        {/* Pink glow bottom-right */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse opacity-40 animation-delay-1000" />
        {/* Center radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/30 to-background" />
      </div>
      {/* Header */}
      <header className="relative z-10 border-b border-primary/20 bg-gradient-to-r from-card/90 via-card/95 to-card/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-br from-primary via-secondary to-accent rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ResuMate
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Features
            </Link>
            <Link
              href="#templates"
              className="text-muted-foreground hover:text-secondary transition-colors font-medium"
            >
              Templates
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-accent transition-colors font-medium">
              About
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-accent hover:via-primary hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.12),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto text-center max-w-4xl relative">
          <ScrollAnimation>
            <Badge
              variant="secondary"
              className="mb-4 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30 shadow-lg"
            >
              AI-Powered Resume Builder
            </Badge>
          </ScrollAnimation>

          <ScrollAnimation delay={100}>
            <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6">
              Create Professional Resumes in{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
                Minutes
              </span>
            </h1>
          </ScrollAnimation>

          <ScrollAnimation delay={200}>
            <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
              Build ATS-friendly resumes with AI-powered analysis, get instant feedback, and match your skills to job
              descriptions for better opportunities.
            </p>
          </ScrollAnimation>

          <ScrollAnimation delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/builder">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-gradient-to-r from-primary via-secondary to-accent hover:from-accent hover:via-primary hover:to-secondary shadow-xl hover:shadow-2xl transition-all duration-300 color-pulse"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Build Resume Now
                </Button>
              </Link>
              <Link href="/analyzer">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 bg-transparent text-primary hover:text-primary shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analyze Existing Resume
                </Button>
              </Link>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={400}>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Free templates • Instant results
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative z-10 bg-gradient-to-b from-card/50 via-muted/30 to-transparent">
        <div className="container mx-auto">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Everything You Need to Land Your Dream Job
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered platform provides comprehensive tools to create, analyze, and optimize your resume.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollAnimation animation="fadeInLeft" delay={100}>
              <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl group glass-effect">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 group-hover:from-secondary group-hover:to-accent transition-all duration-300 shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-primary">Smart Resume Builder</CardTitle>
                  <CardDescription>
                    Drag-and-drop interface with AI-powered suggestions for content, formatting, and keywords.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      Professional templates
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                      Auto-suggestions
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-accent mr-2" />
                      Real-time preview
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeInUp" delay={200}>
              <Card className="border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl group glass-effect">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:from-accent group-hover:to-primary transition-all duration-300 shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-secondary">ATS Score Analysis</CardTitle>
                  <CardDescription>
                    Get instant feedback on your resume's compatibility with Applicant Tracking Systems.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      ATS compatibility score
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                      Keyword optimization
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-accent mr-2" />
                      Improvement suggestions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeInRight" delay={300}>
              <Card className="border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-xl group glass-effect">
                <CardHeader>
                  <div className="h-12 w-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4 group-hover:from-primary group-hover:to-secondary transition-all duration-300 shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-accent">Job Match Analysis</CardTitle>
                  <CardDescription>
                    Compare your resume against job descriptions and get tailored recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      Skill gap analysis
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                      Match percentage
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-accent mr-2" />
                      Custom recommendations
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 px-4 relative z-10">
        <div className="container mx-auto">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Professional Templates for Every Industry
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose from our collection of ATS-friendly templates designed by professionals.
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollAnimation animation="fadeInLeft" delay={100}>
              <Card className="group hover:shadow-2xl transition-all duration-300 border-primary/20 hover:border-primary/40 glass-effect">
                <CardHeader>
                  <div className="h-48 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-lg mb-4 flex items-center justify-center group-hover:from-primary/30 group-hover:via-secondary/20 group-hover:to-accent/30 transition-all duration-300 shadow-inner">
                    <FileText className="h-16 w-16 text-primary group-hover:text-secondary transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-primary">Modern</CardTitle>
                  <CardDescription>Clean, contemporary design perfect for tech and creative roles.</CardDescription>
                </CardHeader>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeInUp" delay={200}>
              <Card className="group hover:shadow-2xl transition-all duration-300 border-secondary/20 hover:border-secondary/40 glass-effect">
                <CardHeader>
                  <div className="h-48 bg-gradient-to-br from-secondary/20 via-accent/10 to-primary/20 rounded-lg mb-4 flex items-center justify-center group-hover:from-secondary/30 group-hover:via-accent/20 group-hover:to-primary/30 transition-all duration-300 shadow-inner">
                    <FileText className="h-16 w-16 text-secondary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-secondary">Minimal</CardTitle>
                  <CardDescription>Simple, elegant layout that focuses on content and readability.</CardDescription>
                </CardHeader>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation animation="fadeInRight" delay={300}>
              <Card className="group hover:shadow-2xl transition-all duration-300 border-accent/20 hover:border-accent/40 glass-effect">
                <CardHeader>
                  <div className="h-48 bg-gradient-to-br from-accent/20 via-primary/10 to-secondary/20 rounded-lg mb-4 flex items-center justify-center group-hover:from-accent/30 group-hover:via-primary/20 group-hover:to-secondary/30 transition-all duration-300 shadow-inner">
                    <FileText className="h-16 w-16 text-accent group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-accent">Corporate</CardTitle>
                  <CardDescription>Traditional, professional format ideal for business and finance.</CardDescription>
                </CardHeader>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-bg relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative">
          <ScrollAnimation>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Build Your Perfect Resume?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have successfully landed their dream jobs with ResuMate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Building Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 border-white/30 hover:bg-white/10 bg-transparent text-white hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Examples
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section id="about" className="py-16 px-4 relative z-10 bg-gradient-to-br from-card/80 via-muted/50 to-card/80">
        <div className="container mx-auto">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About the Developer
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ResuMate was crafted with passion and precision to help job seekers succeed in their career journey.
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={200}>
            <Card className="max-w-2xl mx-auto border-primary/20 hover:border-primary/40 transition-all duration-300 glass-effect shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="h-20 w-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold text-white">PV</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">Pranav Vishwakarma</h3>
                  <p className="text-secondary font-medium mb-4">Full Stack Developer & AI Enthusiast</p>
                  <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
                    Passionate about creating innovative solutions that bridge technology and user experience.
                    Specialized in building AI-powered applications that solve real-world problems.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/30 hover:bg-primary/10 bg-transparent text-primary hover:text-primary"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-secondary/30 hover:bg-secondary/10 bg-transparent text-secondary hover:text-secondary"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-accent/30 hover:bg-accent/10 bg-transparent text-accent hover:text-accent"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary/20 bg-gradient-to-r from-card/90 via-card/95 to-card/90 backdrop-blur-sm py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-6 w-6 bg-gradient-to-br from-primary via-secondary to-accent rounded flex items-center justify-center shadow-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                ResuMate
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-secondary transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-accent transition-colors">
                Support
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary/20 text-center text-sm text-muted-foreground">
            <p>© 2024 ResuMate. All rights reserved.</p>
            <p className="mt-1">
              Developed with dedication by{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">
                Pranav Vishwakarma
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
