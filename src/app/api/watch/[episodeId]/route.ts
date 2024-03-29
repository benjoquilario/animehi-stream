import { url2 } from "@/lib/consumet"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { episodeId: string } }
) {
  const episodeId = params.episodeId

  const response = await fetch(`${url2}/watch/${episodeId}`)

  if (!response.ok) throw new Error("Failed to fetch recent episodes.")

  const watch = await response.json()
  // const watchReferer = watch.headers.Referer

  return NextResponse.json(watch)
}
