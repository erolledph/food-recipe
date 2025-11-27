import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

const BING_API_URL = "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch"
const BING_API_KEY = process.env.BING_WEBMASTER_API_KEY || ""
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ""

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls } = body

    // Validate input
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "URLs array is required and must not be empty" },
        { status: 400 }
      )
    }

    if (!BING_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Bing API key not configured. Please set BING_WEBMASTER_API_KEY environment variable.",
        },
        { status: 500 }
      )
    }

    console.log("[Bing Submit] Submitting to Bing URL API:", {
      siteUrl: SITE_URL,
      urlCount: urls.length,
      urls: urls,
    })

    // Send to Bing
    const response = await fetch(`${BING_API_URL}?apikey=${BING_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "DigitalAxis-Blog/1.0",
      },
      body: JSON.stringify({
        siteUrl: SITE_URL,
        urlList: urls,
      }),
    })

    const statusCode = response.status
    const responseText = await response.text()

    console.log("[Bing Submit] Response:", {
      status: statusCode,
      body: responseText,
    })

    // Handle response
    if (statusCode === 200) {
      return NextResponse.json(
        {
          success: true,
          message: `Successfully submitted ${urls.length} URL(s) to Bing`,
          urls: urls,
        },
        { status: 200 }
      )
    } else if (statusCode === 400) {
      return NextResponse.json(
        {
          error: "Bad request - Invalid format or API key",
          details: responseText,
        },
        { status: 400 }
      )
    } else if (statusCode === 401) {
      return NextResponse.json(
        {
          error: "Unauthorized - Invalid API key",
          details: responseText,
        },
        { status: 401 }
      )
    } else if (statusCode === 403) {
      return NextResponse.json(
        {
          error: "Forbidden - Access denied",
          details: responseText,
        },
        { status: 403 }
      )
    } else if (statusCode === 429) {
      return NextResponse.json(
        {
          error: "Rate limited by Bing - daily quota exceeded",
          retryAfter: "Tomorrow at midnight UTC",
          details: responseText,
        },
        { status: 429 }
      )
    } else {
      return NextResponse.json(
        {
          error: `Unexpected response status: ${statusCode}`,
          details: responseText,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[Bing Submit] Submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit to Bing", details: String(error) },
      { status: 500 }
    )
  }
}
