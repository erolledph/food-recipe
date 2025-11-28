import { NextResponse } from "next/server"
import { fetchPostsFromGitHub } from "@/lib/github"

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim() === "") {
      return NextResponse.json([])
    }

    const owner = process.env.GITHUB_OWNER || ""
    const repo = process.env.GITHUB_REPO || ""
    const token = process.env.GITHUB_TOKEN || ""

    if (!owner || !repo || !token) {
      return NextResponse.json({ error: "GitHub configuration missing" }, { status: 500 })
    }

    const posts = await fetchPostsFromGitHub(owner, repo, token)

    const searchTerm = query.toLowerCase().trim()
    const results = posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(searchTerm)
      const contentMatch = post.content.toLowerCase().includes(searchTerm)
      const excerptMatch = post.excerpt?.toLowerCase().includes(searchTerm)
      const authorMatch = post.author?.toLowerCase().includes(searchTerm)
      const tagsMatch = post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))

      return titleMatch || contentMatch || excerptMatch || authorMatch || tagsMatch
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching posts:", error)
    return NextResponse.json({ error: "Failed to search posts" }, { status: 500 })
  }
}
