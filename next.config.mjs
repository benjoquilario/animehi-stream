import "./src/env.mjs"

import nextPWA from "next-pwa"

const withPWA = nextPWA({
  dest: "public",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default process.env.NODE_ENV === "development"
  ? nextConfig
  : withPWA(nextConfig)
