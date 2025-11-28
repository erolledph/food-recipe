/**
 * Input validation utilities for API endpoints
 * Prevents path traversal, XSS, and other injection attacks
 */

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validate blog post slug
 * Only allows alphanumeric, hyphens, and underscores
 * Prevents path traversal attacks like "../../../etc/passwd"
 */
export function validateSlug(slug: string, maxLength = 100): ValidationResult {
  const errors: string[] = []

  if (!slug || typeof slug !== 'string') {
    errors.push("Slug must be a non-empty string")
    return { valid: false, errors }
  }

  if (slug.length > maxLength) {
    errors.push(`Slug must be at most ${maxLength} characters`)
  }

  // Only allow alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    errors.push("Slug can only contain letters, numbers, hyphens, and underscores")
  }

  // Prevent directory traversal
  if (slug.includes("..") || slug.includes("/") || slug.includes("\\")) {
    errors.push("Slug contains invalid characters")
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate blog post title
 */
export function validateTitle(title: string, maxLength = 200): ValidationResult {
  const errors: string[] = []

  if (!title || typeof title !== 'string') {
    errors.push("Title must be a non-empty string")
    return { valid: false, errors }
  }

  if (title.length > maxLength) {
    errors.push(`Title must be at most ${maxLength} characters`)
  }

  // Check for minimum length
  if (title.length < 3) {
    errors.push("Title must be at least 3 characters")
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate blog post content
 * Prevents massive payloads that could cause memory issues
 */
export function validateContent(content: string, maxLength = 100000): ValidationResult {
  const errors: string[] = []

  if (typeof content !== 'string') {
    errors.push("Content must be a string")
    return { valid: false, errors }
  }

  if (content.length === 0) {
    errors.push("Content cannot be empty")
  }

  if (content.length > maxLength) {
    errors.push(`Content must be at most ${maxLength} characters (~${Math.round(maxLength / 1000)}KB)`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate author name
 */
export function validateAuthor(author: string, maxLength = 100): ValidationResult {
  const errors: string[] = []

  if (!author || typeof author !== 'string') {
    errors.push("Author must be a non-empty string")
    return { valid: false, errors }
  }

  if (author.length > maxLength) {
    errors.push(`Author name must be at most ${maxLength} characters`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate tags array
 */
export function validateTags(tags: any, maxTags = 10, maxTagLength = 50): ValidationResult {
  const errors: string[] = []

  if (!Array.isArray(tags)) {
    errors.push("Tags must be an array")
    return { valid: false, errors }
  }

  if (tags.length > maxTags) {
    errors.push(`Cannot have more than ${maxTags} tags`)
  }

  for (const tag of tags) {
    if (typeof tag !== 'string') {
      errors.push("All tags must be strings")
      break
    }

    if (tag.length > maxTagLength) {
      errors.push(`Tags must be at most ${maxTagLength} characters`)
      break
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate image URL
 */
export function validateImageUrl(imageUrl: string, maxLength = 500): ValidationResult {
  const errors: string[] = []

  if (!imageUrl || typeof imageUrl !== 'string') {
    // Image is optional
    return { valid: true, errors: [] }
  }

  if (imageUrl.length > maxLength) {
    errors.push(`Image URL must be at most ${maxLength} characters`)
  }

  // Basic URL validation
  try {
    new URL(imageUrl)
  } catch {
    errors.push("Image URL must be a valid URL")
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate excerpt
 */
export function validateExcerpt(excerpt: string, maxLength = 500): ValidationResult {
  const errors: string[] = []

  if (excerpt && typeof excerpt !== 'string') {
    errors.push("Excerpt must be a string")
    return { valid: false, errors }
  }

  if (excerpt && excerpt.length > maxLength) {
    errors.push(`Excerpt must be at most ${maxLength} characters`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate entire blog post object
 */
export function validateBlogPost(data: any) {
  const errors: string[] = []

  // Slug validation
  const slugValidation = validateSlug(data.slug)
  if (!slugValidation.valid) {
    errors.push(...slugValidation.errors)
  }

  // Title validation
  const titleValidation = validateTitle(data.title)
  if (!titleValidation.valid) {
    errors.push(...titleValidation.errors)
  }

  // Content validation
  const contentValidation = validateContent(data.content)
  if (!contentValidation.valid) {
    errors.push(...contentValidation.errors)
  }

  // Optional author validation
  if (data.author) {
    const authorValidation = validateAuthor(data.author)
    if (!authorValidation.valid) {
      errors.push(...authorValidation.errors)
    }
  }

  // Optional excerpt validation
  if (data.excerpt) {
    const excerptValidation = validateExcerpt(data.excerpt)
    if (!excerptValidation.valid) {
      errors.push(...excerptValidation.errors)
    }
  }

  // Optional tags validation
  if (data.tags && data.tags.length > 0) {
    const tagsValidation = validateTags(data.tags)
    if (!tagsValidation.valid) {
      errors.push(...tagsValidation.errors)
    }
  }

  // Optional image validation
  if (data.image) {
    const imageValidation = validateImageUrl(data.image)
    if (!imageValidation.valid) {
      errors.push(...imageValidation.errors)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
