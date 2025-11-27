import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-shadow-gray bg-background">
      <div className="mx-auto px-6 lg:px-8 h-16 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl font-bold tracking-tight text-center" style={{ fontFamily: 'Georgia, serif' }}>
            The Cook Book
          </span>
        </Link>
      </div>
    </header>
  )
}
