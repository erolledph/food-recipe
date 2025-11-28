import Link from "next/link"
import { ChefHat } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-shadow-gray bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ChefHat className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            The Cook Book
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            All Recipes
          </Link>
          <Link href="/blog?category=breakfast" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Breakfast
          </Link>
          <Link href="/blog?category=lunch" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Lunch
          </Link>
          <Link href="/blog?category=dinner" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Dinner
          </Link>
        </nav>
      </div>
    </header>
  )
}
