import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <FileQuestion className="w-16 h-16 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>404</h1>

        <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Page Not Found
        </h2>

        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="rounded-full w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>

          <Link href="/blog">
            <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto">
              Browse Stories
            </Button>
          </Link>
        </div>

                <div className="mt-12 pt-8 border-t border-shadow-gray">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <Link href="/about" className="text-primary hover:underline">
              About Us
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-primary hover:underline">
              Contact
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/blog" className="text-primary hover:underline">
              Blog
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/admin/login" className="text-primary hover:underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
