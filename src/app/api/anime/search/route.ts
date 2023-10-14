import { NextResponse } from "next/server"
import { search } from "@/lib/consumet"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const query = searchParams.get("q")

  if (!query) return NextResponse.json("Query is required!", { status: 400 })

  const [searchSettled] = await Promise.allSettled([search({ query })])

  if (searchSettled.status === "rejected") {
    return NextResponse.json([], { status: 200 })
  }

  return NextResponse.json(
    searchSettled.value.results.map((data) => data),
    { status: 200 }
  )
}
