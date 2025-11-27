import { NextResponse, type NextRequest } from "next/server"
import { setAdminSession, verifyPassword } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rateLimiter"

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('cf-connecting-ip') ||
               request.headers.get('x-forwarded-for') ||
               'unknown'
    
    // Check rate limit: 5 attempts per 15 minutes
    const rateLimit = checkRateLimit(ip, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 60 * 60 * 1000 // 1 hour block
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Too many login attempts. Please try again later.",
          retryAfter: rateLimit.retryAfter
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter)
          }
        }
      )
    }

    const { password } = await request.json()

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      )
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { 
          error: "Invalid password",
          remaining: rateLimit.remaining
        },
        { status: 401 }
      )
    }

    await setAdminSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    )
  }
}
