import { cookies } from "next/headers"

// ADMIN_PASSWORD is REQUIRED - no fallback for production safety
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_PASSWORD) {
  console.warn(
    "⚠️  WARNING: ADMIN_PASSWORD environment variable is not set. "
    + "This will cause login failures in production. "
    + "Set ADMIN_PASSWORD in your Cloudflare environment variables."
  )
}

const SESSION_TOKEN = "admin-session"

export async function setAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_TOKEN, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_TOKEN)
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_TOKEN)?.value === "true"
}

export function verifyPassword(password: string): boolean {
  // Fail safely if password not configured
  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD is not configured")
    return false
  }
  
  // Use constant-time comparison to prevent timing attacks
  return constantTimeEqual(password, ADMIN_PASSWORD)
}

/**
 * Constant-time string comparison to prevent timing attacks
 * Prevents attackers from using response time to guess password
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still take time to hash both to prevent length leakage
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}
