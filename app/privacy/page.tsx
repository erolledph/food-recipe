import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for this personal blog.",
  openGraph: {
    title: "Privacy - Your Blog Name",
    description: "Privacy information",
    url: `${siteUrl}/privacy`,
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-2">Privacy Policy</h2>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6" style={{ fontFamily: 'Georgia, serif' }}>Privacy</h1>
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">Short and simple</p>
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8 pb-16">
        <div className="space-y-8 max-w-none">
          <section>
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>The Short Version</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              This is a personal blog. I don't collect your data, I don't track you, I don't sell anything to anyone. You're just here reading my thoughts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Analytics and Tracking</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              This site uses Google Analytics to understand how visitors use this blog. Google Analytics collects information like your browser type, device type, and pages visited. This helps me improve the site and understand what content resonates with readers.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              Google Analytics may set cookies in your browser to collect this information. These are Google's cookies, and you can learn more about how Google uses your data in their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">privacy policy</a>.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics opt-out browser extension</a> or adjusting your browser settings to disable cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Advertising</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              This site uses Google AdSense to display advertisements. Google AdSense may use cookies and other tracking technologies to serve personalized ads based on your browsing activity across the web.
            </p>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              You can control how Google uses your information for advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Newsletter Subscription</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              This site offers a newsletter subscription where you can provide your email address to receive updates about new posts. Your email address is stored securely and used only to send you newsletter updates. You can unsubscribe at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Comments</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              If you leave a comment, your name and email address are stored with your comment. Your email is not publicly displayed. I use this information only to manage comments and respond to your feedback. Comments are moderated before appearing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>What I Don't Do</h2>
            <ul className="space-y-2 mb-6">
              <li className="text-lg text-foreground/90">I don't sell your data to anyone</li>
              <li className="text-lg text-foreground/90">I don't share your data with third parties (except Google Analytics and Google AdSense)</li>
              <li className="text-lg text-foreground/90">I don't have user accounts (except my admin login)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Hosting and Technical Data</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              This site is hosted on Cloudflare Pages. They may collect basic server logs (like IP addresses) for security and performance purposes. Your browser stores a session cookie if you're logged into the admin panel. Learn more in <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cloudflare's privacy policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>Third-Party Services</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              This site uses the following third-party services:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-lg text-foreground/90"><strong>Google Analytics</strong> - Website analytics and traffic monitoring</li>
              <li className="text-lg text-foreground/90"><strong>Google AdSense</strong> - Advertisement serving and display</li>
              <li className="text-lg text-foreground/90"><strong>Firebase</strong> - Backend services for comments and data storage</li>
              <li className="text-lg text-foreground/90"><strong>Cloudflare Pages</strong> - Website hosting</li>
            </ul>
            <p className="text-lg text-foreground/90 leading-relaxed">
              Each of these services has their own privacy policies that govern how they use your data. Please review their privacy policies for more information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Georgia, serif' }}>That's It</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              Seriously, that's it. Read, enjoy, leave. No strings attached.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
