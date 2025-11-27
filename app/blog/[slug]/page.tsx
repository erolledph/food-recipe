import { BlogPost } from "@/components/pages/blog/BlogPost"
import { fetchPostsFromGitHub } from "@/lib/github"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  try {
    const owner = process.env.GITHUB_OWNER || ""
    const repo = process.env.GITHUB_REPO || ""
    const token = process.env.GITHUB_TOKEN || ""

    const posts = await fetchPostsFromGitHub(owner, repo, token)
    const post = posts.find((p) => p.slug === slug)

    if (!post) {
      return {
        title: "Post Not Found",
      }
    }

    return {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      authors: post.author ? [{ name: post.author }] : undefined,
      keywords: [...(post.tags || []), "blog", "tech", "innovation"],
      openGraph: {
        title: post.title,
        description: post.excerpt || post.content.substring(0, 160),
        url: `${siteUrl}/blog/${slug}`,
        type: "article",
        publishedTime: post.date,
        modifiedTime: post.date,
        authors: post.author ? [post.author] : undefined,
        tags: post.tags,
        images: post.image ? [{
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }] : [{
          url: `${siteUrl}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: "DigitalAxis - Tech & Innovation",
        }],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.content.substring(0, 160),
        creator: "@digitalaxis",
        images: post.image ? [post.image] : [`${siteUrl}/og-image.svg`],
      },
      alternates: {
        canonical: `${siteUrl}/blog/${slug}`,
      },
    }
  } catch (error) {
    return {
      title: "Blog Post",
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const owner = process.env.GITHUB_OWNER || ""
  const repo = process.env.GITHUB_REPO || ""
  const token = process.env.GITHUB_TOKEN || ""

  const posts = await fetchPostsFromGitHub(owner, repo, token)
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
          </div>
        </div>
      </main>
    )
  }

  // Breadcrumb structured data for SEO
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${slug}`,
      },
    ],
  }

  const blogPostingData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    url: `${siteUrl}/blog/${slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author || "Admin",
      url: `${siteUrl}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "DigitalAxis",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
      },
    },
    image: {
      "@type": "ImageObject",
      url: post.image || `${siteUrl}/og-image.svg`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
    keywords: post.tags?.join(", ") || "",
    articleBody: post.content,
    wordCount: post.content.split(/\s+/).length,
    inLanguage: "en-US",
  }

  return (
    <>
      <BlogPost post={post} siteUrl={siteUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingData),
        }}
        suppressHydrationWarning
      />
    </>
  )
}
