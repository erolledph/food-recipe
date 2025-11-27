import { NextResponse } from "next/server"
import { fetchPostsFromGitHub } from "@/lib/github"
import { isAdminAuthenticated } from "@/lib/auth"

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    // For Cloudflare Pages Edge Runtime, use globalThis or request context
    const owner = (globalThis as any).GITHUB_OWNER || process.env.GITHUB_OWNER || ""
    const repo = (globalThis as any).GITHUB_REPO || process.env.GITHUB_REPO || ""
    const token = (globalThis as any).GITHUB_TOKEN || process.env.GITHUB_TOKEN || ""

    console.log("[GET /api/posts] Environment check:", {
      hasOwner: !!owner,
      ownerLength: owner?.length || 0,
      hasRepo: !!repo,
      repoLength: repo?.length || 0,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      ownerPreview: owner ? owner.substring(0, 5) + '...' : 'MISSING',
      repoPreview: repo ? repo.substring(0, 5) + '...' : 'MISSING',
      tokenPreview: token ? token.substring(0, 8) + '...' : 'MISSING',
    })

    if (!owner || !repo || !token) {
      console.error("[GET /api/posts] Missing environment variables!")
      return NextResponse.json({
        error: "GitHub configuration missing",
        details: {
          owner: !!owner,
          repo: !!repo,
          token: !!token
        }
      }, { status: 500 })
    }

    console.log("[GET /api/posts] Fetching posts from GitHub...")
    const posts = await fetchPostsFromGitHub(owner, repo, token)
    console.log("[GET /api/posts] Successfully fetched", posts.length, "posts")
    return NextResponse.json(posts)
  } catch (error) {
    console.error("[GET /api/posts] Error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log("[POST /api/posts] Starting post creation...")

    const authenticated = await isAdminAuthenticated()
    console.log("[POST /api/posts] Authentication check:", authenticated)

    if (!authenticated) {
      console.error("[POST /api/posts] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, author, excerpt, tags, image, content } = await request.json()
    console.log("[POST /api/posts] Post data received:", {
      hasTitle: !!title,
      hasContent: !!content,
      titleLength: title?.length || 0,
      contentLength: content?.length || 0
    })

    if (!title || !content) {
      console.error("[POST /api/posts] Missing required fields")
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Get environment variables - For Cloudflare Pages Edge Runtime
    const owner = (globalThis as any).GITHUB_OWNER || process.env.GITHUB_OWNER || ""
    const repo = (globalThis as any).GITHUB_REPO || process.env.GITHUB_REPO || ""
    const token = (globalThis as any).GITHUB_TOKEN || process.env.GITHUB_TOKEN || ""

    console.log("[POST /api/posts] Environment check:", {
      hasOwner: !!owner,
      ownerLength: owner?.length || 0,
      hasRepo: !!repo,
      repoLength: repo?.length || 0,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      ownerPreview: owner ? owner.substring(0, 5) + '...' : 'MISSING',
      repoPreview: repo ? repo.substring(0, 5) + '...' : 'MISSING',
      tokenPreview: token ? token.substring(0, 8) + '...' : 'MISSING'
    })

    if (!owner || !repo || !token) {
      console.error("[POST /api/posts] Missing environment variables!")
      return NextResponse.json({
        error: "GitHub configuration missing",
        details: {
          owner: !!owner,
          repo: !!repo,
          token: !!token
        }
      }, { status: 500 })
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")

    const date = new Date().toISOString().split("T")[0]
    const filename = `${slug}.md`

    const frontmatter = `---
title: ${title}
date: ${date}
author: ${author || "Admin"}
excerpt: ${excerpt || ""}
tags: ${Array.isArray(tags) ? tags.join(", ") : tags || ""}
image: ${image || ""}
---

${content}
`

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/posts/${filename}`
    console.log("[POST /api/posts] GitHub API URL:", apiUrl)
    console.log("[POST /api/posts] Creating post:", { slug, filename })

    // Convert to base64 using TextEncoder (edge-compatible)
    const encoder = new TextEncoder()
    const data = encoder.encode(frontmatter)

    // Convert Uint8Array to base64 without spreading (edge-compatible)
    let binary = ''
    const len = data.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(data[i])
    }
    const base64Content = btoa(binary)

    console.log("[POST /api/posts] Sending request to GitHub...")
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add post: ${title}`,
        content: base64Content,
        branch: "main",
      }),
    })

    console.log("[POST /api/posts] GitHub response status:", response.status, response.statusText)

    if (!response.ok) {
      const error = await response.json()
      console.error("[POST /api/posts] GitHub API error:", {
        status: response.status,
        statusText: response.statusText,
        error: error
      })
      return NextResponse.json({
        error: "Failed to create post on GitHub",
        details: error,
        status: response.status
      }, { status: 500 })
    }

    const result = await response.json()
    console.log("[POST /api/posts] Post created successfully:", result.content?.path)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[POST /api/posts] Unexpected error:", error)
    return NextResponse.json({
      error: "Failed to create post",
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
