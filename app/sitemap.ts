import { MetadataRoute } from "next"
import { fetchPostsFromGitHub } from "@/lib/github"

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ]

  return [...staticPages, ...blogPosts]
}
