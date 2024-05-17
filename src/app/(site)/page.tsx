import Banner from "@/components/banner"
import { recent, seasonal } from "@/lib/consumet"
import RecentEpisodes from "@/components/recent-episodes"
import { Suspense } from "react"
import Sharethis from "@/components/sharethis"
import ContinueWatching from "@/components/continue-watching"
import { getSession } from "@/lib/session"
import MostView from "@/components/most-view"
import NewestComments from "@/components/comments/newest-comments"
import Seasonal from "@/components/seasonal"

export default async function Home() {
  const [recentSettled, seasonSettled] = await Promise.allSettled([
    recent(),
    seasonal(),
  ])

  const recentResponse =
    recentSettled.status === "fulfilled" ? recentSettled.value : null
  const seasonalResponse =
    seasonSettled.status === "fulfilled" ? seasonSettled.value : null

  const session = await getSession()

  return (
    <>
      <section>
        <Suspense fallback={<div>Loading...</div>}>
          <Banner />
        </Suspense>
      </section>
      <section className="w-full px-[2%]">
        <div className="flex flex-col md:space-x-4">
          <div className="relative flex-1 overflow-hidden">
            {session ? (
              <>
                <div className="mt-10 flex scroll-m-20 items-center pb-2 text-base font-semibold tracking-tight transition-colors first:mt-0 md:text-3xl">
                  Welcome, <h2 className="ml-2"> {session.user.name}</h2>
                </div>

                <ContinueWatching />
              </>
            ) : null}

            <div className="mt-4 flex flex-col items-start rounded-md py-2">
              <p className="mb-2 pl-3 text-xs text-muted-foreground/90">
                Please help us by sharing the site to your friends
              </p>
              <Sharethis />
            </div>

            <Suspense fallback={<div>Loading...</div>}>
              <NewestComments />
            </Suspense>
            <Seasonal seasonalResults={seasonalResponse} />
            <div className="flex flex-col md:space-x-4 xl:flex-row">
              <RecentEpisodes recentEpisodes={recentResponse?.results} />
              <div className="flex flex-row sm:flex-col xl:flex-col">
                <Suspense>
                  <MostView />
                </Suspense>
                {/* <Popular popularResults={popularResults?.results} /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
