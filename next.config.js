import "./src/env.mjs"
import nextPWA from "next-pwa"
// @ts-check
const withPWA = nextPWA({
  dest: "public",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: false,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co",
      },
      {
        protocol: "https",
        hostname: "gogocdn.net",
      },
    ],
    unoptimized: true,
  },
}

export default withPWA(nextConfig)
