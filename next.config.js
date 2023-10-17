/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["s4.anilist.co", "gogocdn.net", "images.weserv.nl"],
  },
}

module.exports = nextConfig
