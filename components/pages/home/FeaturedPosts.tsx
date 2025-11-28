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
  content?: string
}

export function FeaturedPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts")
        if (!response.ok) throw new Error("Failed to fetch posts")
        const data = await response.json()
        setPosts(data.slice(0, 3))
      } catch (err) {
        console.error("Failed to load posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <BlogPostCardSkeleton key={i} titleSize="small" showImage={i === 1} />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No posts yet</p>
        <Link href="/admin/login">
          <Button>Create your first post</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {posts.map((post) => (
        <BlogPostCard
          key={post.id}
          id={post.id}
          title={post.title}
          slug={post.slug}
          image={post.image}
        />
      ))}
    </div>
  )
}
