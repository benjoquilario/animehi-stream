import type { MetadataRoute } from "next"

export default function manifest() {
  return json
}

const json = {
  name: "AnimeHi",
  short_name: "AnimeHi",
  description:
    "AnimeHi is an anime streaming service that uses the consumet API. No ads and no vpn required",
  theme_color: "#FFFFFF",
  background_color: "#FFFFFF",
  display: "standalone",
  orientation: "portrait",
  id: "/",
  scope: "/",
  start_url: "/",
  icons: [
    {
      src: "/favicon.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/favicon.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
} satisfies MetadataRoute.Manifest
