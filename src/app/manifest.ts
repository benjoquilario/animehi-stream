import type { MetadataRoute } from "next"

export default function manifest() {
  return json
}

const json = {
  name: "AnimeHi",
  short_name: "AnimeHi",
  description:
    "AnimeHi is an anime streaming service that uses the consumet API. No ads and no vpn required",
  theme_color: "#000",
  background_color: "#000",
  display: "standalone",
  orientation: "portrait",
  id: "/",
  scope: "/",
  start_url: "/",
  icons: [
    {
      src: "/anime-192x192.png",
      sizes: "any",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/anime-512x512.png",
      sizes: "any",
      type: "image/png",
    },
  ],
} satisfies MetadataRoute.Manifest
