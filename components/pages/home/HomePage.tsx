"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Sunrise, Sun, Sunset, Dessert, Globe } from "lucide-react"
import { RecentPosts } from "@/components/blog/RecentPosts"

const mealCategories = [
  {
    name: "Breakfast",
    tag: "breakfast",
    icon: Sunrise,
    color: "from-orange-400/20 to-yellow-400/20",
    borderColor: "border-orange-300/50",
    iconColor: "text-orange-500",
  },
  {
    name: "Lunch",
    tag: "lunch",
    icon: Sun,
    color: "from-green-400/20 to-emerald-400/20",
    borderColor: "border-green-300/50",
    iconColor: "text-green-500",
  },
  {
    name: "Dinner",
    tag: "dinner",
    icon: Sunset,
    color: "from-blue-400/20 to-indigo-400/20",
    borderColor: "border-blue-300/50",
    iconColor: "text-blue-500",
  },
  {
    name: "Dessert",
    tag: "dessert",
    icon: Dessert,
    color: "from-pink-400/20 to-rose-400/20",
    borderColor: "border-pink-300/50",
    iconColor: "text-pink-500",
  },
]

const cuisineCategories = [
  { name: "Italian", tag: "italian", flag: "🇮🇹" },
  { name: "Mexican", tag: "mexican", flag: "🇲🇽" },
  { name: "Asian", tag: "asian", flag: "🌏" },
  { name: "American", tag: "american", flag: "🇺🇸" },
]

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
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-primary/5 to-transparent">
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

      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">Browse by Meal</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
            Meal Categories
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {mealCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.tag}
                href={`/blog?category=${category.tag}`}
                className="group"
              >
                <div className={`relative overflow-hidden rounded-xl border ${category.borderColor} bg-gradient-to-br ${category.color} p-6 transition-all hover:shadow-lg hover:scale-105`}>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`${category.iconColor} transition-transform group-hover:scale-110`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground">{category.name}</h4>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">Explore Cuisines</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
            World Cuisines
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {cuisineCategories.map((cuisine) => (
            <Link
              key={cuisine.tag}
              href={`/blog?category=${cuisine.tag}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl border border-shadow-gray bg-card p-6 transition-all hover:shadow-lg hover:scale-105 hover:border-primary">
                <div className="flex flex-col items-center text-center gap-3">
                  <span className="text-4xl transition-transform group-hover:scale-110">{cuisine.flag}</span>
                  <h4 className="text-lg font-bold text-foreground">{cuisine.name}</h4>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">Fresh & New</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
            Latest Recipes
          </h3>
        </div>
        <RecentPosts showCTA={false} />
      </div>
    </main>
  )
}
