import "./globals.css"
import type { Metadata } from "next"
import { Inter as FontSans, Outfit } from "next/font/google"
import { cn } from "@/lib/utils"
import ThemeProvider from "@/components/theme-provider"
import Script from "next/script"
import NextTopLoader from "nextjs-toploader"
import { Toaster } from "@/components/ui/toaster"
import AuthContext from "@/components/auth-context"
import QueryProvider from "@/components/query-provider"

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://animehi-stream.vercel.app"),
  title: {
    default: "AnimeHi - Watch animes without ads",
    template: `%s - AnimeHi`,
  },
  description:
    "Watch anime shows, tv, movies for free without ads in your mobile, tablet or pc",
  keywords: [
    "Next.js",
    "React",
    "Shadcn",
    "Radix UI",
    "Tailwind CSS",
    "Gogoanime",
    "Anilist",
    "Anime Hi",
    "Anime",
    "Watch Anime",
    "Anime Streaming Site",
  ],
  authors: [
    {
      name: "benjoquilario",
      url: "https://github.com/benjoquilario",
    },
  ],
  creator: "benjoquilario",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://animehi-stream.vercel.app/",
    title: "AnimeHI",
    description:
      "Watch anime shows, tv, movies for free without ads in your mobile, tablet or pc",
    siteName: "AnimeHi",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnimeHi",
    description:
      "Watch anime shows, tv, movies for free without ads in your mobile, tablet or pc",
    creator: "@iambenjo",
  },
  icons: {
    icon: "/favicon.png",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen font-sans antialiased", fontSans.variable)}
      >
        <AuthContext>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <NextTopLoader height={4} color="#6d28d9" />
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </AuthContext>
        <Toaster />
        <Script
          type="text/javascript"
          src="https://platform-api.sharethis.com/js/sharethis.js#property=651ea0ee6ee9de001217ae58&product=inline-share-buttons"
          async
        ></Script>
      </body>
    </html>
  )
}
