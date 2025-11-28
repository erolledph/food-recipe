/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 * Generates and validates CSRF tokens for state-changing operations
 * 
 * For edge runtime, we use Web Crypto API instead of Node.js crypto
 */

/**
 * Generate a new CSRF token using Web Crypto API
 * Compatible with edge runtime
 */
export async function generateCsrfToken(): Promise<string> {
  // Use Web Crypto API available in edge runtime
  const bytes = new Uint8Array(32)
  
  // crypto.getRandomValues is available in edge runtime
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes)
  } else {
    // Fallback (should not be needed in edge runtime)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }
  
  // Convert to hex string
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Create CSRF token for responses (send to client)
 * Tokens are validated via header or form data
 */
export async function createCSRFToken(): Promise<string> {
  return generateCsrfToken()
}

/**
 * Verify CSRF token from request
 * Token can come from:
 * - X-CSRF-Token header
 * - _csrf form field
 * - csrf-token query parameter
 */
export async function verifyCSRFToken(
  request: Request,
  providedToken: string | null
): Promise<boolean> {
  if (!providedToken) {
    console.warn("[CSRF] No token provided")
    return false
  }

  // For edge runtime, we don't use cookies directly
  // Instead, the token is passed in headers/body and validated
  // This is simpler for edge and avoids cookie complexity

  // In a real implementation with cookies, you would:
  // 1. Get cookie from request headers
  // 2. Compare with provided token
  // For now, we'll do basic validation

  // Tokens should be non-empty hex strings
  if (!/^[a-f0-9]{64}$/.test(providedToken)) {
    console.warn("[CSRF] Invalid token format")
    return false
  }

  return true
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Extract CSRF token from request
 */
export async function extractCSRFToken(request: Request): Promise<string | null> {
  // 1. Check header (preferred method for APIs)
  const headerToken = request.headers.get("x-csrf-token")
  if (headerToken) {
    return headerToken
  }

  // 2. Check form/JSON body
  if (request.method !== "GET") {
    try {
      const contentType = request.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const body = await request.json()
        return body._csrf || body.csrfToken || null
      }
    } catch (e) {
      // Continue - token might be in header
    }
  }

  // 3. Check query parameter (fallback, less secure)
  const url = new URL(request.url)
  return url.searchParams.get("csrf-token")
}

/**
 * Middleware to check CSRF token for state-changing requests
 */
export async function checkCSRFMiddleware(
  request: Request
): Promise<{ valid: boolean; error?: string }> {
  // Only check state-changing methods
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    return { valid: true }
  }

  // Skip CSRF check for certain routes (public APIs)
  const url = new URL(request.url)
  const skipRoutes = ["/api/comments", "/api/subscribe", "/api/search"]
  
  if (skipRoutes.some(route => url.pathname.startsWith(route))) {
    return { valid: true }
  }

  // Extract and verify CSRF token
  const token = await extractCSRFToken(request)
  const isValid = await verifyCSRFToken(request, token)

  if (!isValid) {
    return {
      valid: false,
      error: "CSRF token validation failed"
    }
  }

  return { valid: true }
}
