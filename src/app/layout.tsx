import "./globals.css"
import type { Metadata, Viewport } from "next"
import { cn } from "@/lib/utils"
import ThemeProvider from "@/components/theme-provider"
import HolyLoader from "holy-loader"
import { Toaster } from "@/components/ui/toaster"
import AuthContext from "@/components/auth-context"
import QueryProvider from "@/components/query-provider"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { fontSans } from "@/lib/fonts"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],

  colorScheme: "dark light",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://animehi-stream.vercel.app"),
  title: "AnimeHi - Watch anime online with SUB and DUB without ads",
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
    "Anime - Hi",
    "Anime",
    "Watch AnimeHi",
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
  manifest: "/manifest.ts",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body
        className={cn(
          "font-geist-sans min-h-screen antialiased",
          fontSans.variable
        )}
      >
        <h1 className="sr-only">
          AnimeHi - Watch anime online with SUB and DUB without ads
        </h1>
        <p className="sr-only">
          AnimeHi is a Free anime streaming website which you can watch English
          Subbed and Dubbed Anime online for free without ads in your mobile,
          tablet or pc.
        </p>
        <AuthContext>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {/* <NextTopLoader height={4} color="#6d28d9" /> */}
            <HolyLoader
              color="#6d28d9"
              height="4px"
              speed={250}
              easing="linear"
              showSpinner
            />
            <QueryProvider>
              <div className="flex min-h-full flex-col">
                <SiteHeader />
                <main className="flex-1 pt-16">{children}</main>
                <SiteFooter />
              </div>
            </QueryProvider>
          </ThemeProvider>
        </AuthContext>
        <Toaster />
      </body>
    </html>
  )
}
