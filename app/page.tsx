import { HomePage } from "@/components/pages/home/HomePage"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ""

export const metadata: Metadata = {
  title: "The Cook Book - Delicious Food Recipes for Every Meal",
  description: "Discover easy and delicious food recipes for breakfast, lunch, dinner, and dessert. From quick weeknight meals to impressive dishes.",
  keywords: ["recipes", "food", "cooking", "easy recipes", "food blog", "meal ideas", "cooking tips", "breakfast", "lunch", "dinner", "dessert"],
  authors: [{ name: "The Cook Book" }],
  openGraph: {
    title: "The Cook Book - Delicious Food Recipes",
    description: "Discover easy and delicious food recipes for every meal and occasion",
    url: siteUrl,
    siteName: "The Cook Book",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "The Cook Book - Food Recipes",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Cook Book - Delicious Food Recipes",
    description: "Easy and delicious food recipes for every meal",
    images: [`${siteUrl}/og-image.svg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function Page() {
  return <HomePage />
}
