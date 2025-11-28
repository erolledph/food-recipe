import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogPostCard } from "@/components/blog/BlogPostCard"
import { fetchPostsFromGitHub } from "@/lib/github"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  date: string
  author?: string
  tags?: string[]
  image?: string
  content: string
}

interface BlogListServerProps {
  category?: string
}

export async function BlogListServer({ category }: BlogListServerProps) {
  let posts: BlogPost[] = []
  let error: string | null = null

  try {
    const owner = process.env.GITHUB_OWNER || ""
    const repo = process.env.GITHUB_REPO || ""
    const token = process.env.GITHUB_TOKEN || ""

    const allPosts = await fetchPostsFromGitHub(owner, repo, token)

    // Filter by category if provided
    if (category) {
      posts = allPosts.filter((post) =>
        post.tags?.some(tag => tag.toLowerCase() === category.toLowerCase())
      )
    } else {
      posts = allPosts
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load posts"
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

  const pageTitle = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Recipes`
    : "All Recipes"

  const pageDescription = category
    ? `Browse our collection of delicious ${category} recipes`
    : "Browse our collection of delicious and easy-to-follow recipes"

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-24 md:py-32">
        <div className="mb-8">
          {category && (
            <Link href="/blog" className="text-sm text-primary hover:underline mb-2 inline-block">
              ← Back to all recipes
            </Link>
          )}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
            {pageTitle}
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">{pageDescription}</p>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 pb-20">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground mb-8">
              {category
                ? `No ${category} recipes found. Try browsing all recipes.`
                : "No recipes published yet"
              }
            </p>
            <Link href={category ? "/blog" : "/"}>
              <Button>{category ? "View All Recipes" : "Back to Home"}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
        )}
      </div>
    </main>
  )
}
