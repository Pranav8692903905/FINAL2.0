"use client"

interface CharacterCounterProps {
  text: string
  maxLength?: number
  showWords?: boolean
}

export function CharacterCounter({ text, maxLength = 500, showWords = true }: CharacterCounterProps) {
  const charCount = text?.length || 0
  const wordCount = text ? text.trim().split(/\s+/).filter(Boolean).length : 0
  const percentage = (charCount / maxLength) * 100

  const getColor = () => {
    if (percentage >= 90) return "text-red-400"
    if (percentage >= 70) return "text-yellow-400"
    return "text-emerald-400"
  }

  const getRecommendation = () => {
    if (charCount < 50) return "Too short - add more details"
    if (charCount > maxLength) return "Too long - try to be more concise"
    if (percentage >= 70 && percentage < 90) return "Good length"
    return "Perfect!"
  }

  return (
    <div className="flex items-center justify-between text-xs mt-2">
      <span className={`${getColor()} font-medium`}>
        {charCount}/{maxLength} characters
        {showWords && ` • ${wordCount} words`}
      </span>
      <span className="text-gray-400">{getRecommendation()}</span>
    </div>
  )
}
