import { env } from "@/env.mjs"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const LIMIT = 20

export const GET = async function (req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const page = searchParams.get("page")
  const perPage = searchParams.get("perPage")
  const season = searchParams.get("season")
  const format = searchParams.get("format")
  const year = searchParams.get("year")
  const sort = searchParams.get("sort")
  const status = searchParams.get("status")
  const limit = searchParams.get("limit")
  const skip = searchParams.get("cursor")

  const url = `${env.ANIME_API_URI}/meta/anilist/advanced-search?type=ANIME&page=${page}&perPage=${perPage}&season=${season}&format=${format}&year=${year}&sort=["${sort}"]&status=${status}&limit=${limit}&cursor=${skip}`

  const response = await fetch(url)

  const data = await response.json()

  return NextResponse.json({
    nextSkip:
      data.length < Number(limit || 20) ? null : Number(skip) + Number(limit),
    results: data.results,
    hasNextPage: data.hasNextPages,
  })
}
