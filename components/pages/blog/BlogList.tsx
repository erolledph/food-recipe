"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogPostCard } from "@/components/blog/BlogPostCard"
import { BlogPostCardSkeleton } from "@/components/blog/BlogPostCardSkeleton"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  date: string
  author?: string
  tags?: string[]
  image?: string
}

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts")
        if (!response.ok) throw new Error("Failed to fetch posts")
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-24 md:py-32">
          <div className="mb-8">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">Blog</h2>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>Stories</h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">Thoughts, insights, and perspectives from writers on topics that matter</p>
        </div>

        <div className="mx-auto max-w-3xl px-6 lg:px-8 pb-20">
          <div className="space-y-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <BlogPostCardSkeleton key={i} titleSize="medium" showImage={i % 2 === 0} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">{error}</h1>
          </div>
          <div className="text-center">
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-24 md:py-32">
        <div className="mb-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">Blog</h2>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>Stories</h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">Thoughts, insights, and perspectives from writers on topics that matter</p>
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8 pb-20">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-8">No stories published yet</p>
            <Link href="/admin/login">
              <Button size="lg" className="rounded-full px-8 h-12 font-medium">Start writing</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {posts.map((post) => (
              <BlogPostCard
                key={post.id}
                id={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                date={post.date}
                author={post.author}
                tags={post.tags}
                image={post.image}
                titleSize="medium"
                showFullDate={true}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
