import Banner from "@/components/banner"
import { popular, recent } from "@/lib/consumet"
import Popular from "@/components/popular"
import RecentEpisodes from "@/components/recent-episodes"
import { Suspense } from "react"
import Sharethis from "@/components/sharethis"
import ContinueWatching from "@/components/continue-watching"

export default async function Home() {
  const [recentSettled, popularSettled] = await Promise.allSettled([
    recent(),
    popular(),
  ])

  const recentEpisodes =
    recentSettled.status === "fulfilled" ? recentSettled.value : null
  const popularResults =
    popularSettled.status === "fulfilled" ? popularSettled.value : null
  return (
    <>
      <section>
        <Banner />
      </section>
      <section className="w-full px-[2%]">
        <div className="flex flex-col md:space-x-4 xl:flex-row">
          <div className="flex-1">
            {/* <Suspense>
              <ContinueWatching />
            </Suspense> */}
            <div className="mt-4 flex flex-col items-start rounded-md py-2">
              <p className="mb-2 pl-3 text-xs text-muted-foreground/90">
                Please help us by sharing the site to your friends
              </p>
              <Sharethis />
            </div>
            <RecentEpisodes recentEpisodes={recentEpisodes?.results} />
          </div>

          <Popular popularResults={popularResults?.results} />
        </div>
      </section>
    </>
  )
}
