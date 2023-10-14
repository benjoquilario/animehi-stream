import Banner from "@/components/banner"
import * as React from "react"
import { popular, recent } from "@/lib/consumet"
import Popular from "@/components/popular"
import RecentEpisodes from "@/components/recent-episodes"

export default async function Home() {
  const [recentSettled, popularSettled] = await Promise.allSettled([
    recent(),
    popular(),
  ])

  const recentEpisodes =
    recentSettled.status === "fulfilled" ? recentSettled.value : null
  const popularAnime =
    popularSettled.status === "fulfilled" ? popularSettled.value : null

  return (
    <>
      <section>
        <Banner />
      </section>
      <section className="w-full px-[2%]">
        <div className="flex flex-col md:space-x-4 xl:flex-row">
          <RecentEpisodes recentEpisodes={recentEpisodes?.results} />
          <Popular popularAnime={popularAnime?.results} />
        </div>
      </section>
    </>
  )
}
