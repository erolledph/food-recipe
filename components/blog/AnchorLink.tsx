"use client"

interface AnchorLinkProps {
  href: string
  children: React.ReactNode
}

export function AnchorLink({ href, children }: AnchorLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.pushState(null, '', href)
    }
  }

  return (
    <a
      href={href}
      className="text-primary hover:underline font-medium"
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
