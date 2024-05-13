import { continueWatching } from "@/lib/metrics"
import SwiperContinueWatching from "./swiper-continue-watching"
import Section from "./section"

export default async function ContinueWatching() {
  const results = await continueWatching()

  if (results?.length === 0) return <></>

  return (
    <Section sectionName="recently-watch" className="relative">
      <h3 className="flex w-full pt-2.5 text-left text-2xl font-semibold">
        <div className="mr-2 h-8 w-2 rounded-md bg-primary"></div>
        Recently Watched
      </h3>
      <span className="pb-6 text-xs text-muted-foreground/70">
        Swipe for more
      </span>
      {results ? <SwiperContinueWatching results={results} /> : null}
    </Section>
  )
}
