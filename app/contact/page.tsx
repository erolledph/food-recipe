import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me.",
  openGraph: {
    title: "Contact - Your Blog Name",
    description: "Get in touch",
    url: `${siteUrl}/contact`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">Contact</h2>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6" style={{ fontFamily: 'Georgia, serif' }}>Get In Touch</h1>
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">Want to reach out?</p>
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8 pb-16">
        <div className="space-y-8 max-w-none">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Say hello</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-8">
              If you want to say hello, share thoughts on a post, or just chat, feel free to reach out. I can't promise I'll reply quickly, but I do read everything.
            </p>
                        <div className="rounded-lg border border-shadow-gray p-6 bg-muted/20 inline-block">
              <p className="text-muted-foreground mb-2">Drop me an email:</p>
              <a href="mailto:cedrickgkc2024@gmail.com" className="text-primary hover:underline text-lg">
                cedrickgkc2024@gmail.com
              </a>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Find Me Online</h2>
            <p className="text-lg text-foreground/90 mb-6">
              I'm occasionally active on these platforms:
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.facebook.com/cedrick1022" className="text-primary hover:underline">Facebook</a>
              <span className="text-muted-foreground">•</span>
              <a href="https://github.com/cedrick1022" className="text-primary hover:underline">GitHub</a>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
