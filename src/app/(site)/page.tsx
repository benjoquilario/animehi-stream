import Banner from "@/components/banner"
import * as React from "react"
import { popular, recent } from "@/lib/consumet"
import EpisodeCard from "@/components/episode-card"
import Popular from "@/components/popular"

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
          <div className="flex-1">
            <div className="mt-4 flex flex-col items-start rounded-md py-2">
              <p className="mb-2 pl-3 text-xs text-muted-foreground/90">
                Please help us by sharing the site to your friends
              </p>
              <div className="sharethis-inline-share-buttons"></div>
            </div>
            <h3 className="w-full pb-6 pt-2.5 text-left text-2xl font-semibold">
              Recently Updated
            </h3>

            <ul className="relative grid grid-cols-3 gap-3 overflow-hidden md:grid-cols-4 lg:grid-cols-6">
              {recentEpisodes?.results?.map((data) => (
                <li
                  key={data.episodeId}
                  className="col-span-1 overflow-hidden rounded-md"
                >
                  <EpisodeCard data={data} />
                </li>
              ))}
            </ul>
          </div>
          <Popular popularAnime={popularAnime?.results} />
        </div>
      </section>
    </>
  )
}
