import { BlogListServer } from "@/components/pages/blog/BlogListServer"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export const metadata: Metadata = {
  title: "Recipes",
  description: "Explore our collection of delicious and easy-to-follow food recipes.",
  keywords: ["recipes", "food", "cooking", "meals", "breakfast", "lunch", "dinner", "dessert"],
  openGraph: {
    title: "Recipes - The Cook Book",
    description: "Explore our collection of delicious recipes.",
    url: `${siteUrl}/blog`,
    type: "website",
    images: [{
      url: `${siteUrl}/og-image.svg`,
      width: 1200,
      height: 630,
      alt: "The Cook Book Recipes",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recipes - The Cook Book",
    description: "Explore our collection of delicious recipes",
    images: [`${siteUrl}/og-image.svg`],
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
}

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const category = params.category

  return <BlogListServer category={category} />
}
