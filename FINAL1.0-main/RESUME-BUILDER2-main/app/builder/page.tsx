"use client"

import { ResumeBuilder } from "@/components/resume/resume-builder"
import { ResumeProvider } from "@/components/resume/resume-context"

export default function BuilderPage() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  )
}
