import { type NextRequest, NextResponse } from "next/server"
import { fetchPostsFromGitHub } from "@/lib/github"

export const runtime = 'edge'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    const owner = process.env.GITHUB_OWNER || ""
    const repo = process.env.GITHUB_REPO || ""
    const token = process.env.GITHUB_TOKEN || ""

    if (!owner || !repo || !token) {
      return NextResponse.json({ error: "GitHub configuration missing" }, { status: 500 })
    }

    const posts = await fetchPostsFromGitHub(owner, repo, token)
    const post = posts.find((p) => p.slug === slug)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}
