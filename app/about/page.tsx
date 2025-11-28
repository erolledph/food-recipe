import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

export const metadata: Metadata = {
  title: "About",
  description: "DigitalAxis - A personal blog exploring tech, innovation, and digital insights.",
  openGraph: {
    title: "About - DigitalAxis",
    description: "Exploring tech, innovation, and digital insights",
    url: `${siteUrl}/about`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">About</h2>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6" style={{ fontFamily: 'Georgia, serif' }}>About This Blog</h1>
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">Just me, my thoughts, and a keyboard</p>
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8 pb-16">
        <div className="max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>What is this place?</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              This is my personal blog where I write about whatever's on my mind. No filters, no corporate speak, no marketing jargon. Just raw, unfiltered thoughts and random musings.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed">
              Sometimes it's deep, sometimes it's silly, sometimes it makes sense, sometimes it doesn't. That's the beauty of having your own corner of the internet.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Why I write</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              I write to think, to reflect, to remember, and sometimes just to get things out of my head. If you find something useful or entertaining here, that's a bonus, but honestly, this is mainly for me.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>The tech behind it</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              Built with Next.js and powered by GitHub. I use a simple admin panel to write posts, and everything deploys automatically. Simple, fast, and exactly what I need.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
