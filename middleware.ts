import { type NextRequest, NextResponse } from "next/server"

const ADMIN_SESSION_TOKEN = "admin-session"
const protectedRoutes = ["/admin/dashboard", "/admin/create"]
const publicAdminRoutes = ["/admin/login"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public admin routes don't require authentication
  const isPublicAdminRoute = publicAdminRoutes.some((route) => pathname.startsWith(route))
  if (isPublicAdminRoute) {
    return NextResponse.next()
  }

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Check for valid session cookie
    const sessionCookie = request.cookies.get(ADMIN_SESSION_TOKEN)

    if (!sessionCookie || sessionCookie.value !== "true") {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
