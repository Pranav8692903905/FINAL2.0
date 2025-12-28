"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useResume } from "./resume-context"

export function ResumePreview() {
  const { currentResume } = useResume()

  if (!currentResume) return null

  const personalSection = currentResume.sections.find((s) => s.type === "personal")
  const summarySection = currentResume.sections.find((s) => s.type === "summary")
  const experienceSection = currentResume.sections.find((s) => s.type === "experience")
  const headerColor = currentResume.headerColor || "#3b82f6"
  const template = currentResume.template

  // Modern Template - Full width colored header with centered content
  const renderModernHeader = () => (
    <div style={{ backgroundColor: headerColor, padding: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
        {personalSection?.content.photoUrl && (
          <img
            src={personalSection.content.photoUrl}
            alt="Profile"
            style={{
              width: "112px",
              height: "112px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid white",
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "white", margin: "0 0 8px 0" }}>
            {personalSection?.content.fullName || "Your Name"}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
            {personalSection?.content.email && <span>{personalSection.content.email}</span>}
            {personalSection?.content.phone && <span>{personalSection.content.phone}</span>}
            {personalSection?.content.location && <span>{personalSection.content.location}</span>}
            {personalSection?.content.website && <span>{personalSection.content.website}</span>}
            {personalSection?.content.linkedin && <span>{personalSection.content.linkedin}</span>}
          </div>
        </div>
      </div>
    </div>
  )

  // Minimal Template - Simple header with side-by-side photo and text
  const renderMinimalHeader = () => (
    <div style={{ padding: "32px", borderBottom: `3px solid ${headerColor}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {personalSection?.content.photoUrl && (
          <img
            src={personalSection.content.photoUrl}
            alt="Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "8px",
              objectFit: "cover",
              border: `3px solid ${headerColor}`,
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold", color: headerColor, margin: "0 0 12px 0" }}>
            {personalSection?.content.fullName || "Your Name"}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "13px", color: "#4b5563" }}>
            {personalSection?.content.email && <span>📧 {personalSection.content.email}</span>}
            {personalSection?.content.phone && <span>📱 {personalSection.content.phone}</span>}
            {personalSection?.content.location && <span>📍 {personalSection.content.location}</span>}
            {personalSection?.content.website && <span>🌐 {personalSection.content.website}</span>}
            {personalSection?.content.linkedin && <span>💼 {personalSection.content.linkedin}</span>}
          </div>
        </div>
      </div>
    </div>
  )

  // Corporate Template - Professional header with color accent bar
  const renderCorporateHeader = () => (
    <div>
      <div style={{ backgroundColor: headerColor, height: "8px" }} />
      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "24px" }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#1f2937", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
              {personalSection?.content.fullName || "Your Name"}
            </h1>
            <div style={{ height: "2px", width: "60px", backgroundColor: headerColor, margin: "8px 0 16px 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", fontSize: "13px", color: "#4b5563" }}>
              {personalSection?.content.email && <span>✉ {personalSection.content.email}</span>}
              {personalSection?.content.phone && <span>☎ {personalSection.content.phone}</span>}
              {personalSection?.content.location && <span>⌖ {personalSection.content.location}</span>}
              {personalSection?.content.website && <span>⚲ {personalSection.content.website}</span>}
              {personalSection?.content.linkedin && <span>⚐ {personalSection.content.linkedin}</span>}
            </div>
          </div>
          {personalSection?.content.photoUrl && (
            <img
              src={personalSection.content.photoUrl}
              alt="Profile"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "4px",
                objectFit: "cover",
                border: `2px solid ${headerColor}`,
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardContent className="p-0">
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "white", color: "#000" }}>
          {/* Render header based on template */}
          {personalSection && (
            <>
              {template === "modern" && renderModernHeader()}
              {template === "minimal" && renderMinimalHeader()}
              {template === "corporate" && renderCorporateHeader()}
            </>
          )}

          {/* Main content */}
          <div style={{ padding: "32px" }}>
            {/* Professional Summary */}
            {summarySection && summarySection.content.text && (
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600", color: headerColor, margin: "0 0 12px 0" }}>
                  Professional Summary
                </h2>
                <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>{summarySection.content.text}</p>
              </div>
            )}

            {/* Work Experience */}
            {experienceSection && experienceSection.content.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600", color: headerColor, margin: "0 0 16px 0" }}>
                  Work Experience
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {experienceSection.content.map((exp: any, index: number) => (
                    <div key={index} style={{ borderLeft: `2px solid ${headerColor}33`, paddingLeft: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div>
                          <h3 style={{ fontWeight: "600", margin: "0 0 4px 0" }}>{exp.position || "Position"}</h3>
                          <p style={{ fontWeight: "500", color: headerColor, margin: 0 }}>{exp.company || "Company"}</p>
                        </div>
                        <div style={{ fontSize: "12px", color: "#4b5563", textAlign: "right" }}>
                          {exp.startDate && (
                            <span>
                              {new Date(exp.startDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                          {exp.startDate && exp.endDate && " - "}
                          {exp.endDate && (
                            <span>
                              {new Date(exp.endDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                          {exp.current && " - Present"}
                        </div>
                      </div>
                      {exp.description && <p style={{ color: "#374151", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {currentResume.sections.find((s) => s.type === "education") && currentResume.sections.find((s) => s.type === "education")!.content.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600", color: headerColor, margin: "0 0 16px 0" }}>
                  Education
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {currentResume.sections.find((s) => s.type === "education")!.content.map((edu: any, index: number) => (
                    <div key={index} style={{ borderLeft: `2px solid ${headerColor}33`, paddingLeft: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div>
                          <h3 style={{ fontWeight: "600", margin: "0 0 4px 0" }}>{edu.degree || "Degree"}</h3>
                          <p style={{ fontWeight: "500", color: headerColor, margin: "0 0 4px 0" }}>{edu.institution || "Institution"}</p>
                          {edu.field && <p style={{ fontSize: "12px", color: "#4b5563", margin: 0 }}>{edu.field}</p>}
                        </div>
                        <div style={{ fontSize: "12px", color: "#4b5563", textAlign: "right" }}>
                          {edu.startDate && (
                            <span>
                              {new Date(edu.startDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                          {edu.startDate && edu.endDate && " - "}
                          {edu.endDate && (
                            <span>
                              {new Date(edu.endDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      {edu.gpa && <p style={{ fontSize: "12px", color: "#374151", margin: 0 }}>GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {currentResume.sections.find((s) => s.type === "skills") && currentResume.sections.find((s) => s.type === "skills")!.content.categories?.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "600", color: headerColor, margin: "0 0 16px 0" }}>
                  Skills
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {currentResume.sections.find((s) => s.type === "skills")!.content.categories.map((category: any, index: number) => (
                    category.skills && category.skills.length > 0 && (
                      <div key={index}>
                        <h3 style={{ fontWeight: "500", color: headerColor, margin: "0 0 8px 0" }}>{category.name}</h3>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {category.skills.map((skill: string, skillIndex: number) => (
                            <span
                              key={skillIndex}
                              style={{
                                padding: "6px 12px",
                                fontSize: "12px",
                                borderRadius: "20px",
                                color: "white",
                                backgroundColor: headerColor,
                                display: "inline-block",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {currentResume.sections.find((s) => s.type === "projects") && currentResume.sections.find((s) => s.type === "projects")!.content.length > 0 && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "600", color: headerColor, margin: "0 0 16px 0" }}>
                  Projects
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {currentResume.sections.find((s) => s.type === "projects")!.content.map((project: any, index: number) => (
                    <div key={index} style={{ borderLeft: `2px solid ${headerColor}33`, paddingLeft: "16px" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <h3 style={{ fontWeight: "600", margin: "0 0 4px 0" }}>{project.name || "Project Name"}</h3>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: "12px", color: headerColor, textDecoration: "none" }}
                          >
                            {project.url}
                          </a>
                        )}
                      </div>
                      {project.description && <p style={{ color: "#374151", fontSize: "14px", lineHeight: "1.5", margin: "0 0 8px 0" }}>{project.description}</p>}
                      {project.technologies && project.technologies.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {project.technologies.map((tech: string, techIndex: number) => (
                            <span
                              key={techIndex}
                              style={{
                                padding: "4px 8px",
                                fontSize: "11px",
                                borderRadius: "4px",
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                display: "inline-block",
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
