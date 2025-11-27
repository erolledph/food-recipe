"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { RecentPosts } from "@/components/blog/RecentPosts"

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 w-full text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Discover Delicious Recipes
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
            Explore easy and delicious food recipes for every occasion
          </p>
          
          <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="w-full h-12 rounded-lg border border-input bg-background pl-12 pr-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
            Latest Recipes
          </h2>
        </div>
        <RecentPosts showCTA={false} />
      </div>
    </main>
  )
}
