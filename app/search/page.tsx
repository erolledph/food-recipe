"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogPostCard } from "@/components/blog/BlogPostCard"
import { BlogPostCardSkeleton } from "@/components/blog/BlogPostCardSkeleton"
import { Search } from "lucide-react"

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

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function searchPosts() {
      if (!query.trim()) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error("Failed to search posts")
        const data = await response.json()
        setResults(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search posts")
      } finally {
        setLoading(false)
      }
    }

    searchPosts()
  }, [query])

  if (!query.trim()) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Search Recipes</h1>
            <p className="text-lg text-muted-foreground mb-8">Enter a search term to find recipes</p>
            <Link href="/blog">
              <Button>Browse all recipes</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Search Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Searching for "{query}"...
            </p>
          </div>

          <div className="space-y-12 border-t border-shadow-gray pt-8">
            {[1, 2, 3].map((i) => (
              <BlogPostCardSkeleton key={i} titleSize="medium" showImage={i % 2 === 0} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{error}</h1>
            <Link href="/blog">
              <Button>Back to Recipes</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Search Results
          </h1>
          <p className="text-lg text-muted-foreground">
            Found {results.length} {results.length === 1 ? 'recipe' : 'recipes'} for "{query}"
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16 border-t border-shadow-gray">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No recipes found</h2>
            <p className="text-muted-foreground mb-6">Try adjusting your search terms</p>
            <Link href="/blog">
              <Button>Browse all recipes</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 border-t border-shadow-gray pt-8">
            {results.map((post) => (
              <BlogPostCard
                key={post.id}
                id={post.id}
                title={post.title}
                slug={post.slug}
                image={post.image}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Search Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Loading...
            </p>
          </div>

          <div className="space-y-12 border-t border-shadow-gray pt-8">
            {[1, 2, 3].map((i) => (
              <BlogPostCardSkeleton key={i} titleSize="medium" showImage={i % 2 === 0} />
            ))}
          </div>
        </div>
      </main>
    }>
      <SearchResults />
    </Suspense>
  )
}
