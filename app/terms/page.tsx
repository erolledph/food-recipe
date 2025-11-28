import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for this blog.",
  openGraph: {
    title: "Terms - DigitalAxis",
    description: "Terms of use",
    url: `${siteUrl}/terms`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">Terms of Use</h2>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6" style={{ fontFamily: 'Georgia, serif' }}>Terms</h1>
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">Keep it simple</p>
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8 pb-16">
        <div className="space-y-8 max-w-none">
          <section>
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>The Basics</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              This is my personal blog. You're free to read anything here. That's about it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>My Content</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              Everything I write here is mine. Feel free to share links to posts, but don't copy my content wholesale and claim it as yours. That's not cool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>No Guarantees</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              These are my personal thoughts and opinions. They might be wrong, they might change, they might not make sense later. Don't take anything here as professional advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Be Cool</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              Don't try to hack the site, don't be malicious, don't do anything illegal. Just... be cool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Changes</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              I might update these terms if needed. Or I might not. This is a personal blog, not a corporation.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
