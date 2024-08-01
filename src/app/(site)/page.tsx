import Banner from "@/components/banner"
import RecentEpisodes from "@/components/recent-episodes"
import { Suspense } from "react"
import ContinueWatching from "@/components/continue-watching"
import MostView from "@/components/most-view"
import NewestComments from "@/components/comments/newest-comments"
import Seasonal from "@/components/seasonal"
import { Skeleton } from "@/components/ui/skeleton"
import { auth } from "@/auth"
import Section from "@/components/section"
// export const revalidate = 60 * 60 * 3
import NextImage from "@/components/ui/image"

export default async function Home() {
  const session = await auth()

  return (
    <>
      <section>
        <Banner />
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

            {/* <div className="mt-4 flex flex-col items-start rounded-md py-2">
              <p className="mb-2 pl-3 text-xs text-muted-foreground/90">
                Please help us by sharing the site to your friends
              </p>
              <Sharethis />
            </div> */}
            <Section sectionName="newest-comments" className="relative">
              <div className="flex pt-4">
                <div className="relative hidden h-[280px] w-[280px] shrink-0 md:block">
                  <NextImage
                    fill
                    src="/anime-34.png"
                    alt="anime"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <Suspense
                  fallback={
                    <div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-36 rounded-3xl"></Skeleton>
                        <Skeleton className="h-8 w-36 rounded-3xl"></Skeleton>
                      </div>
                      <div className="flex items-center gap-2 py-8">
                        <Skeleton className="h-36 w-80"></Skeleton>
                        <Skeleton className="hidden h-36 w-80 md:block"></Skeleton>
                        <Skeleton className="hidden h-36 w-80 md:block"></Skeleton>
                        <Skeleton className="hidden h-36 w-80 md:block"></Skeleton>
                      </div>
                    </div>
                  }
                >
                  <NewestComments />
                </Suspense>
              </div>
            </Section>

            <Seasonal />
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
