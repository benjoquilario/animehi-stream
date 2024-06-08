import Banner from "@/components/banner"
import RecentEpisodes from "@/components/recent-episodes"
import { Suspense } from "react"
import Sharethis from "@/components/sharethis"
import ContinueWatching from "@/components/continue-watching"
import MostView from "@/components/most-view"
import NewestComments from "@/components/comments/newest-comments"
import Seasonal from "@/components/seasonal"
import { Skeleton } from "@/components/ui/skeleton"
import { getSession } from "@/lib/session"
import { getSeason } from "@/lib/utils"

// export const revalidate = 60 * 60 * 3

export default async function Home() {
  const session = await getSession()

  return (
    <>
      <section>
        <Suspense
          fallback={
            <div className="relative h-[350px] w-full animate-pulse bg-background px-[2%] md:h-[500px]">
              <div className="absolute bottom-[50px] top-auto z-[100] w-full max-w-[800px] space-y-3 md:bottom-[109px]">
                <Skeleton className="h-[28px] w-[344px] md:h-[52px] md:w-[512px]" />
                <Skeleton className="h-[42px] w-[344px] md:h-[58px] md:w-[512px]" />
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-[40px] w-[114px]" />
                  <Skeleton className="h-[40px] w-[114px]" />
                </div>
              </div>
            </div>
          }
        >
          <Banner />
        </Suspense>
      </section>
      <section className="w-full px-[2%]">
        <div className="flex flex-col md:space-x-4">
          <div className="relative flex-1 overflow-hidden">
            {session ? (
              <>
                <div className="mt-10 flex scroll-m-20 items-center pb-2 text-base font-semibold tracking-tight transition-colors first:mt-0 md:text-3xl">
                  {/* Welcome, <h2 className="ml-2"> {session.user.name}</h2> */}
                </div>

                <ContinueWatching />
              </>
            ) : null}

            {/* <div className="mt-4 flex flex-col items-start rounded-md py-2">
              <p className="mb-2 pl-3 text-xs text-muted-foreground/90">
                Please help us by sharing the site to your friends
              </p>
              <Sharethis />
            </div> */}

            <Suspense fallback={<div>Loading...</div>}>
              <NewestComments />
            </Suspense>
            <Suspense
              fallback={
                <div className="mt-4 px-[2%]">
                  <div className="grid grid-cols-2 gap-2 md:gap-4 xl:grid-cols-4">
                    <SeasonalSkeleton />
                    <SeasonalSkeleton />
                    <SeasonalSkeleton />
                    <SeasonalSkeleton />
                  </div>
                </div>
              }
            >
              <Seasonal />
            </Suspense>
            <div className="flex flex-col md:space-x-4 xl:flex-row">
              <RecentEpisodes />
              {/* <RecentEpisodes recentEpisodes={recentResponse?.results} /> */}
              <div className="flex flex-row sm:flex-col xl:flex-col">
                <Suspense fallback={<SeasonalSkeleton />}>
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

function SeasonalSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
      <SeasonalCardSkeleton />
    </div>
  )
}

function SeasonalCardSkeleton() {
  return (
    <div className="flex space-x-2">
      <Skeleton className="h-[75px] w-[60px]" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-[35px] w-[108px] md:w-[210px]" />
        <Skeleton className="h-[30px] md:w-[180px]" />
      </div>
    </div>
  )
}
