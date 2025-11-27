import { BlogListServer } from "@/components/pages/blog/BlogListServer"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export const metadata: Metadata = {
  title: "Blog",
  description: "Explore my latest blog posts featuring unfiltered thoughts, random musings, and authentic perspectives on life and technology.",
  keywords: ["blog", "posts", "articles", "unfiltered thoughts", "personal musings", "tech insights"],
  openGraph: {
    title: "Blog - Unfiltered Thoughts & Musings",
    description: "Explore my latest blog posts featuring unfiltered thoughts and random musings.",
    url: `${siteUrl}/blog`,
    type: "website",
    images: [{
      url: `${siteUrl}/og-image.svg`,
      width: 1200,
      height: 630,
      alt: "Your Blog Name Blog",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Unfiltered Thoughts & Musings",
    description: "Explore my latest blog posts",
    images: [`${siteUrl}/og-image.svg`],
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
}

export default function BlogPage() {
  return <BlogListServer />
}
