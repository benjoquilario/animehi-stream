"use client"

import SwiperContinueWatching from "./swiper-continue-watching"
import Section from "./section"
import { useQuery } from "@tanstack/react-query"
import { publicUrl } from "@/lib/consumet"

export default function ContinueWatching() {
  const { data, isLoading } = useQuery({
    queryKey: ["watching"],
    queryFn: () => fetch(`/api/user/watching`).then((res) => res.json()),
  })

  return (
    <Section sectionName="recently-watch" className="relative">
      <h3 className="flex w-full pt-2.5 text-left text-2xl font-semibold">
        <div className="mr-2 h-8 w-2 rounded-md bg-primary"></div>
        Recently Watched
      </h3>
      <span className="pb-6 text-xs text-muted-foreground/70">
        Swipe for more
      </span>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <SwiperContinueWatching results={data} />
      )}
    </Section>
  )
}
