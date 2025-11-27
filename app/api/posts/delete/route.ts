import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth"
import { validateSlug } from "@/lib/validation"
import { clearCacheByNamespace } from "@/lib/cache"

export const runtime = 'edge'

export async function DELETE(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = await request.json()

    // Validate slug format to prevent path traversal
    const validation = validateSlug(slug)
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      )
    }

    const owner = process.env.GITHUB_OWNER || ""
    const repo = process.env.GITHUB_REPO || ""
    const token = process.env.GITHUB_TOKEN || ""

    if (!owner || !repo || !token) {
      return NextResponse.json({ error: "GitHub configuration missing" }, { status: 500 })
    }

    const filename = `${slug}.md`
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/posts/${filename}`

    // First, get the file SHA
    const getResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!getResponse.ok) {
      if (getResponse.status === 404) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
      }
      return NextResponse.json({ error: "Failed to fetch post from GitHub" }, { status: 500 })
    }

    const fileData = await getResponse.json()
    const sha = fileData.sha

    // Delete the file
    const deleteResponse = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Delete post: ${slug}`,
        sha,
        branch: "main",
      }),
    })

    if (!deleteResponse.ok) {
      const error = await deleteResponse.json()
      console.error("GitHub API error:", error)
      return NextResponse.json({ error: "Failed to delete post on GitHub" }, { status: 500 })
    }

    // Invalidate cache when post is deleted
    clearCacheByNamespace("github")

    return NextResponse.json({ success: true, message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
