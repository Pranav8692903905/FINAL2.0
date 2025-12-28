"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface ResumeSection {
  id: string
  type: "personal" | "experience" | "education" | "skills" | "projects" | "summary"
  title: string
  content: any
  order: number
}

export interface Resume {
  id: string
  title: string
  template: "modern" | "minimal" | "corporate"
  headerColor?: string
  sections: ResumeSection[]
  createdAt: Date
  updatedAt: Date
}

interface ResumeContextType {
  currentResume: Resume | null
  setCurrentResume: (resume: Resume | null) => void
  updateSection: (sectionId: string, content: any) => void
  addSection: (type: ResumeSection["type"]) => void
  removeSection: (sectionId: string) => void
  reorderSections: (sections: ResumeSection[]) => void
  saveResume: () => void
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [currentResume, setCurrentResume] = useState<Resume | null>(null)

  const updateSection = (sectionId: string, content: any) => {
    if (!currentResume) return

    const updatedSections = currentResume.sections.map((section) =>
      section.id === sectionId ? { ...section, content } : section,
    )

    setCurrentResume({
      ...currentResume,
      sections: updatedSections,
      updatedAt: new Date(),
    })
  }

  const addSection = (type: ResumeSection["type"]) => {
    if (!currentResume) return

    const newSection: ResumeSection = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: getDefaultContent(type),
      order: currentResume.sections.length,
    }

    setCurrentResume({
      ...currentResume,
      sections: [...currentResume.sections, newSection],
      updatedAt: new Date(),
    })
  }

  const removeSection = (sectionId: string) => {
    if (!currentResume) return

    const updatedSections = currentResume.sections.filter((section) => section.id !== sectionId)

    setCurrentResume({
      ...currentResume,
      sections: updatedSections,
      updatedAt: new Date(),
    })
  }

  const reorderSections = (sections: ResumeSection[]) => {
    if (!currentResume) return

    setCurrentResume({
      ...currentResume,
      sections,
      updatedAt: new Date(),
    })
  }

  const saveResume = () => {
    if (!currentResume) return

    // Save to localStorage for now
    const savedResumes = JSON.parse(localStorage.getItem("resumate_resumes") || "[]")
    const existingIndex = savedResumes.findIndex((r: Resume) => r.id === currentResume.id)

    if (existingIndex >= 0) {
      savedResumes[existingIndex] = currentResume
    } else {
      savedResumes.push(currentResume)
    }

    localStorage.setItem("resumate_resumes", JSON.stringify(savedResumes))
  }

  const value: ResumeContextType = {
    currentResume,
    setCurrentResume,
    updateSection,
    addSection,
    removeSection,
    reorderSections,
    saveResume,
  }

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export function useResume() {
  const context = useContext(ResumeContext)
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider")
  }
  return context
}

function getDefaultContent(type: ResumeSection["type"]) {
  switch (type) {
    case "personal":
      return {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        photoUrl: "",
      }
    case "summary":
      return {
        text: "",
      }
    case "experience":
      return [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ]
    case "education":
      return [
        {
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          gpa: "",
        },
      ]
    case "skills":
      return {
        categories: [
          {
            name: "Technical Skills",
            skills: [],
          },
        ],
      }
    case "projects":
      return [
        {
          name: "",
          description: "",
          technologies: [],
          url: "",
        },
      ]
    default:
      return {}
  }
}
