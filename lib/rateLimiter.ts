/**
 * Simple in-memory rate limiter for edge runtime
 * Uses a Map to track request attempts per key (IP address or user identifier)
 * 
 * For production with multiple instances, consider using:
 * - Cloudflare Durable Objects
 * - Redis
 * - External rate limiting service
 */

interface RateLimitEntry {
  attempts: number[]
  blocked: boolean
  blockedUntil?: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  maxAttempts?: number
  windowMs?: number
  blockDurationMs?: number
  keyGenerator?: (request: Request) => string
}

const DEFAULT_CONFIG: Required<RateLimitConfig> = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (request: Request) => {
    // Extract IP from Cloudflare headers or fallback
    const forwarded = request.headers.get('cf-connecting-ip') ||
                      request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'
    return forwarded.split(',')[0].trim()
  }
}

/**
 * Check if a request is rate limited
 * @param key - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = {}
): {
  allowed: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
} {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  const now = Date.now()

  // Clean up old entries to prevent memory leak
  if (rateLimitStore.size > 10000) {
    for (const [k, entry] of rateLimitStore.entries()) {
      const recentAttempts = entry.attempts.filter(
        (time: number) => now - time < mergedConfig.windowMs
      )
      if (recentAttempts.length === 0 && !entry.blocked) {
        rateLimitStore.delete(k)
      }
    }
  }

  let entry = rateLimitStore.get(key)

  // Check if currently blocked
  if (entry?.blocked && entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000)
    }
  }

  // Initialize or update entry
  if (!entry) {
    entry = { attempts: [], blocked: false }
    rateLimitStore.set(key, entry)
  }

  // Remove attempts outside the window
  entry.attempts = entry.attempts.filter(
    (timestamp: number) => now - timestamp < mergedConfig.windowMs
  )

  // Check if limit exceeded
  const remaining = Math.max(0, mergedConfig.maxAttempts - entry.attempts.length)

  if (entry.attempts.length >= mergedConfig.maxAttempts) {
    entry.blocked = true
    entry.blockedUntil = now + mergedConfig.blockDurationMs
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      retryAfter: Math.ceil(mergedConfig.blockDurationMs / 1000)
    }
  }

  // Record this attempt
  entry.attempts.push(now)
  entry.blocked = false

  return {
    allowed: true,
    remaining,
    resetTime: now + mergedConfig.windowMs
  }
}

/**
 * Create a rate limit middleware for API routes
 */
export function createRateLimitMiddleware(config: RateLimitConfig = {}) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  return (request: Request) => {
    const key = mergedConfig.keyGenerator(request)
    return checkRateLimit(key, mergedConfig)
  }
}

/**
 * Reset rate limit for a specific key (useful for admin cleanup)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}

/**
 * Get rate limit status for debugging (admin only)
 */
export function getRateLimitStatus(key?: string) {
  if (key) {
    const entry = rateLimitStore.get(key)
    return {
      key,
      status: entry ? 'tracked' : 'not-found',
      attempts: entry?.attempts.length || 0,
      blocked: entry?.blocked || false,
      blockedUntil: entry?.blockedUntil
    }
  }

  return {
    totalKeys: rateLimitStore.size,
    entries: Array.from(rateLimitStore.entries()).map(([k, v]) => ({
      key: k,
      attempts: v.attempts.length,
      blocked: v.blocked
    }))
  }
}
