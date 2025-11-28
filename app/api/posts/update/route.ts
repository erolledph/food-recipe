import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/auth"
import { validateBlogPost } from "@/lib/validation"
import { clearCacheByNamespace } from "@/lib/cache"

export const runtime = 'edge'

export async function PUT(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, title, author, excerpt, tags, image, content } = await request.json()

    console.log("[PUT /api/posts/update] Received data:", {
      slug,
      titleLength: title?.length,
      authorLength: author?.length,
      excerptLength: excerpt?.length,
      tagsType: typeof tags,
      tagsLength: Array.isArray(tags) ? tags.length : tags?.length,
      imageLength: image?.length,
      contentLength: content?.length,
    })

    // Default author to DigitalAxis if empty
    const finalAuthor = author?.trim() || "DigitalAxis"

    // Validate input
    const validation = validateBlogPost({
      slug,
      title,
      author: finalAuthor,
      excerpt,
      tags,
      image,
      content
    })

    console.log("[PUT /api/posts/update] Validation result:", validation)

    if (!validation.valid) {
      console.error("[PUT /api/posts/update] Validation errors:", validation.errors)
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

    // Parse the existing content to get the date (edge-compatible)
    const base64Content = fileData.content.replace(/\s/g, '')
    const binaryString = atob(base64Content)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const decoder = new TextDecoder()
    const existingContent = decoder.decode(bytes)
    const dateMatch = existingContent.match(/date:\s*(.+)/)
    const existingDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split("T")[0]

    // Create frontmatter with existing date
    const frontmatter = `---
title: ${title}
date: ${existingDate}
author: ${finalAuthor}
excerpt: ${excerpt || ""}
tags: ${tags && Array.isArray(tags) ? tags.join(", ") : ""}
image: ${image || ""}
---

${content}
`

    // Update the file
    // Convert to base64 using TextEncoder (edge-compatible)
    const encoder = new TextEncoder()
    const data = encoder.encode(frontmatter)

    // Convert Uint8Array to base64 without spreading (edge-compatible)
    let binary = ''
    const len = data.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(data[i])
    }
    const base64Frontmatter = btoa(binary)

    const updateResponse = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Update post: ${title}`,
        content: base64Frontmatter,
        sha,
        branch: "main",
      }),
    })

    if (!updateResponse.ok) {
      const error = await updateResponse.json()
      console.error("GitHub API error:", error)
      return NextResponse.json({ error: "Failed to update post on GitHub" }, { status: 500 })
    }

    // Invalidate cache when post is updated
    clearCacheByNamespace("github")

    const result = await updateResponse.json()
    return NextResponse.json({ success: true, data: result, message: "Post updated successfully" })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}
