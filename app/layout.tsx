import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Your Blog Name - Unfiltered Thoughts & Random Musings',
    template: '%s | Your Blog Name',
  },
  description: 'Personal blog sharing unfiltered thoughts, random musings, and authentic perspectives on life and everything in between',
  keywords: ['personal blog', 'unfiltered thoughts', 'random musings', 'life reflections', 'authentic writing', 'personal stories', 'blogging'],
  applicationName: 'Your Blog Name',
  referrer: 'origin-when-cross-origin',
  creator: 'Your Name',
  publisher: 'Your Name',
  authors: [{ name: 'Your Name', url: siteUrl }],
  openGraph: {
    title: 'Your Blog Name - Unfiltered Thoughts & Random Musings',
    description: 'Personal blog sharing unfiltered thoughts, random musings, and authentic perspectives',
    url: siteUrl,
    siteName: 'Your Blog Name',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'DigitalAxis - Personal Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Blog Name - Unfiltered Thoughts & Random Musings',
    description: 'Personal blog sharing unfiltered thoughts and random musings',
    creator: '@yourTwitterHandle',
    images: [`${siteUrl}/og-image.svg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#45967b" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DigitalAxis" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="author" content="DigitalAxis" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9N7NDX1TRK"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9N7NDX1TRK');
          `
        }} />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
