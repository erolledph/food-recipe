/**
 * Submit URLs to IndexNow to notify search engines of new/updated content
 * Use this when publishing new blog posts
 */

export async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean
  message: string
}> {
  try {
    const response = await fetch("/api/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("IndexNow submission failed:", data)
      return {
        success: false,
        message: data.error || "Failed to submit to IndexNow",
      }
    }

    console.log("IndexNow submission successful:", data)
    return {
      success: true,
      message: data.message,
    }
  } catch (error) {
    console.error("Error submitting to IndexNow:", error)
    return {
      success: false,
      message: "Error submitting to IndexNow",
    }
  }
}

/**
 * Submit a single blog post URL to IndexNow
 */
export async function submitBlogPostToIndexNow(slug: string): Promise<{
  success: boolean
  message: string
}> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""
  const url = `${siteUrl}/blog/${slug}`
  return submitToIndexNow([url])
}

/**
 * Submit multiple blog post URLs to IndexNow
 */
export async function submitMultiplePostsToIndexNow(
  slugs: string[]
): Promise<{
  success: boolean
  message: string
}> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""
  const urls = slugs.map((slug) => `${siteUrl}/blog/${slug}`)
  return submitToIndexNow(urls)
}
