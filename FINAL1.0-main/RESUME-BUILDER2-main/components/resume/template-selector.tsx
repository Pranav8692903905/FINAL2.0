"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Check } from "lucide-react"

interface TemplateSelectorProps {
  onSelect: (template: "modern" | "minimal" | "corporate") => void
  selectedTemplate?: "modern" | "minimal" | "corporate"
}

export function TemplateSelector({ onSelect, selectedTemplate }: TemplateSelectorProps) {
  const templates = [
    {
      id: "modern" as const,
      name: "Modern",
      description: "Clean, contemporary design perfect for tech and creative roles",
      gradient: "from-blue-500/10 via-cyan-500/10 to-blue-600/10",
      borderColor: "border-blue-500/30",
      hoverShadow: "hover:shadow-blue-500/30",
      iconGradient: "from-blue-400 to-cyan-400",
      badge: "bg-blue-500",
    },
    {
      id: "minimal" as const,
      name: "Minimal",
      description: "Simple, elegant layout that focuses on content and readability",
      gradient: "from-purple-500/10 via-pink-500/10 to-purple-600/10",
      borderColor: "border-purple-500/30",
      hoverShadow: "hover:shadow-purple-500/30",
      iconGradient: "from-purple-400 to-pink-400",
      badge: "bg-purple-500",
    },
    {
      id: "corporate" as const,
      name: "Corporate",
      description: "Traditional, professional format ideal for business and finance",
      gradient: "from-emerald-500/10 via-teal-500/10 to-emerald-600/10",
      borderColor: "border-emerald-500/30",
      hoverShadow: "hover:shadow-emerald-500/30",
      iconGradient: "from-emerald-400 to-teal-400",
      badge: "bg-emerald-500",
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`group border-0 bg-gradient-to-br ${template.gradient} backdrop-blur-md shadow-2xl overflow-hidden transition-all duration-500 cursor-pointer relative hover:scale-105 ${template.hoverShadow} ${
            selectedTemplate === template.id ? `ring-2 ring-offset-2 ring-offset-slate-900 ${template.borderColor.replace('border-', 'ring-')}` : ""
          }`}
          onClick={() => onSelect(template.id)}
        >
          {/* Background glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-50 blur-xl transition-opacity group-hover:opacity-100`} />
          
          {selectedTemplate === template.id && (
            <div className={`absolute top-4 right-4 ${template.badge} text-white rounded-full p-2 shadow-lg z-20 animate-pulse`}>
              <Check className="h-4 w-4" />
            </div>
          )}
          
          <CardHeader className="relative z-10">
            {/* Template preview area */}
            <div className={`h-56 bg-gradient-to-br ${template.gradient} rounded-2xl mb-6 flex flex-col items-center justify-center border ${template.borderColor} overflow-hidden relative group-hover:border-opacity-60 transition-all duration-300`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shimmer" />
              </div>
              
              {/* Icon with gradient */}
              <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${template.iconGradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <FileText className="h-10 w-10 text-white" />
              </div>
              
              {/* Mini document preview */}
              <div className="space-y-2 w-2/3 opacity-60">
                <div className="h-2 bg-white/40 rounded-full w-full" />
                <div className="h-2 bg-white/30 rounded-full w-4/5" />
                <div className="h-2 bg-white/20 rounded-full w-3/5" />
              </div>
            </div>
            
            <CardTitle className="text-white text-2xl font-bold">{template.name}</CardTitle>
            <CardDescription className="text-gray-300 mt-2">{template.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <Button
              variant={selectedTemplate === template.id ? "default" : "outline"}
              className={`w-full py-6 text-base font-semibold transition-all duration-300 ${
                selectedTemplate === template.id 
                  ? `bg-gradient-to-r ${template.iconGradient} hover:opacity-90 shadow-lg` 
                  : `${template.borderColor} text-white hover:bg-white/10`
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(template.id)
              }}
            >
              {selectedTemplate === template.id ? (
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Selected
                </span>
              ) : (
                "Select Template"
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
