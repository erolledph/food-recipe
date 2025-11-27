interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  type: "file" | "dir"
  content?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  date: string
  author?: string
  tags?: string[]
  image?: string
}

const GITHUB_API = "https://api.github.com"

// Import cache utilities
import { getCached, setCached, clearCacheByNamespace } from "./cache"

export async function fetchPostsFromGitHub(
  owner: string,
  repo: string,
  token: string,
  postsDir = "posts",
): Promise<BlogPost[]> {
  try {
    if (process.env.NODE_ENV === "development" && typeof window === "undefined") {
      try {
        const fs = await import("fs/promises")
        const path = await import("path")

        const localPostsDir = path.join(process.cwd(), "posts")

        try {
          const files = await fs.readdir(localPostsDir)
          const mdFiles = files.filter((f: string) => f.endsWith(".md"))

          const posts: BlogPost[] = []

          for (const file of mdFiles) {
            const filePath = path.join(localPostsDir, file)
            const content = await fs.readFile(filePath, "utf-8")
            const post = parseMarkdownPost(file, content)
            posts.push(post)
          }

          return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        } catch (localError) {
          console.log("Local posts not found, falling back to GitHub")
        }
      } catch (importError) {
        console.log("Node.js fs/path modules not available in Edge Runtime, using GitHub")
      }
    }

    // Check cache first (5 minute TTL for production)
    const cacheKey = `github:posts:${owner}:${repo}`
    const cached = getCached<BlogPost[]>(cacheKey)
    if (cached) {
      console.log("[Cache HIT] GitHub posts list")
      return cached
    }

    console.log("[Cache MISS] GitHub posts list - fetching from API")

    const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${postsDir}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) throw new Error("Failed to fetch posts directory")

    const files = (await response.json()) as GitHubFile[]
    const mdFiles = files.filter((f) => f.type === "file" && f.name.endsWith(".md"))

    const posts: BlogPost[] = []

    for (const file of mdFiles) {
      const contentResponse = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${file.path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (!contentResponse.ok) continue

      const data = (await contentResponse.json()) as GitHubFile
      if (!data.content) continue

      // Edge-compatible base64 decoding
      const base64Content = data.content.replace(/\s/g, '')
      const binaryString = atob(base64Content)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const decoder = new TextDecoder()
      const content = decoder.decode(bytes)

      const post = parseMarkdownPost(file.name, content)
      posts.push(post)
    }

    const sorted = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Cache the results (5 minutes = 300000ms)
    setCached(cacheKey, sorted, { ttl: 5 * 60 * 1000 })

    return sorted
  } catch (error) {
    console.error("GitHub fetch error:", error)
    return []
  }
}

function parseMarkdownPost(filename: string, content: string): BlogPost {
  const slug = filename.replace(".md", "")

  // Parse frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  const frontmatter: Record<string, string> = {}
  let body = content

  if (match) {
    const frontmatterStr = match[1]
    body = match[2]

    // Simple YAML parsing
    frontmatterStr.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split(":")
      if (key && valueParts.length > 0) {
        frontmatter[key.trim()] = valueParts.join(":").trim()
      }
    })
  }

  const title = frontmatter.title || slug
  const excerpt = frontmatter.excerpt || body.substring(0, 160).replace(/[#*`]/g, "")
  const date = frontmatter.date || new Date().toISOString()
  const author = frontmatter.author || "Anonymous"
  const tags = frontmatter.tags ? frontmatter.tags.split(",").map((t) => t.trim()) : []
  const image = frontmatter.image || ""

  return {
    id: slug,
    title,
    slug,
    content: body,
    excerpt,
    date,
    author,
    tags,
    image,
  }
}
