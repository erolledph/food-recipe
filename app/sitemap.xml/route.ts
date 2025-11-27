import { NextResponse } from "next/server"
import { fetchPostsFromGitHub } from "@/lib/github"

export const revalidate = 3600 // Revalidate every hour (ISR)

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"
  const owner = process.env.GITHUB_OWNER || ""
  const repo = process.env.GITHUB_REPO || ""
  const token = process.env.GITHUB_TOKEN || ""

  let posts: Array<{
    id: string
    title: string
    slug: string
    date: string
  }> = []

  try {
    if (owner && repo && token) {
      posts = await fetchPostsFromGitHub(owner, repo, token)
    }
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error)
  }

  const blogPosts = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ]

  const allPages = [...staticPages, ...blogPosts]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
