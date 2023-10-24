import Banner from "@/components/banner"
import { popular, recent } from "@/lib/consumet"
import Popular from "@/components/popular"
import RecentEpisodes from "@/components/recent-episodes"
import { Suspense } from "react"
import Sharethis from "@/components/sharethis"
import ContinueWatching from "@/components/continue-watching"
import { getSession } from "@/lib/session"
import MostView from "@/components/most-view"

export default async function Home() {
  const [recentSettled, popularSettled] = await Promise.allSettled([
    recent(),
    popular(),
  ])

  const recentEpisodes =
    recentSettled.status === "fulfilled" ? recentSettled.value : null
  const popularResults =
    popularSettled.status === "fulfilled" ? popularSettled.value : null

  const session = await getSession()

  return (
    <>
      <section>
        <Banner />
      </section>
      <section className="w-full px-[2%]">
        <div className="flex flex-col md:space-x-4 xl:flex-row">
          <div className="relative flex-1 overflow-hidden">
            {session ? (
              <>
                <div className="mt-10 flex scroll-m-20 items-center pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  Welcome, <h2 className="ml-2"> {session.user.name}</h2>
                </div>
                <Suspense>
                  <ContinueWatching />
                </Suspense>
              </>
            ) : null}

            <div className="mt-4 flex flex-col items-start rounded-md py-2">
              <p className="mb-2 pl-3 text-xs text-muted-foreground/90">
                Please help us by sharing the site to your friends
              </p>
              <Sharethis />
            </div>
            <RecentEpisodes recentEpisodes={recentEpisodes?.results} />
          </div>
          <div>
            <Suspense>
              <MostView />
            </Suspense>
            <Popular popularResults={popularResults?.results} />
          </div>
        </div>
      </section>
    </>
  )
}
