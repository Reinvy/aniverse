import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AniVerse — Where AI Meets Anime Art",
    template: "%s | AniVerse",
  },
  description:
    "AniVerse is a creative platform for generating, sharing, and discovering AI-powered anime artwork. Create stunning anime art with cutting-edge AI.",
  keywords: [
    "anime",
    "AI art",
    "anime generator",
    "AI anime",
    "art platform",
    "creative AI",
    "AI anime art generator",
    "anime style transfer",
    "anime artwork",
    "AI illustration",
    "anime character generator",
    "AI manga",
    "anime diffusion",
    "Ghibli-style AI",
    "anime portrait generator",
  ],
  openGraph: {
    title: "AniVerse — Where AI Meets Anime Art",
    description:
      "Generate, share, and discover stunning AI-powered anime artwork. Free plan available.",
    type: "website",
    locale: "en_US",
    siteName: "AniVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "AniVerse — Where AI Meets Anime Art",
    description:
      "Generate, share, and discover stunning AI-powered anime artwork.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    applicationCategory: "Multimedia",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free plan with 10 generations/month",
      },
      {
        "@type": "Offer",
        price: "9.99",
        priceCurrency: "USD",
        description: "Pro plan with 100 generations/month",
      },
      {
        "@type": "Offer",
        price: "24.99",
        priceCurrency: "USD",
        description: "Studio plan with unlimited generations",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-100">
        {children}
      </body>
    </html>
  );
}
