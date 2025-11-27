import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Calculate reading time based on word count
 * Uses standard reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): string {
  if (!content) return "< 1 min read"
  
  // Remove markdown syntax and count words
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/[#*_[\]()]/g, '') // Remove markdown syntax
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
  
  const wordCount = cleanContent.split(' ').filter(word => word.length > 0).length
  
  if (wordCount === 0) return "< 1 min read"
  
  const readingTimeMinutes = Math.ceil(wordCount / 200)
  
  if (readingTimeMinutes === 1) {
    return "1 min read"
  }
  
  return `${readingTimeMinutes} min read`
}
