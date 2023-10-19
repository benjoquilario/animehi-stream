"use client"

import { RecentEpisode } from "types/types"
import Sharethis from "./sharethis"
// import ViewCounter from "./view-counter"
import EpisodeCard from "./episode-card"
import Section from "./section"

type RecentEpisodesProps = {
  recentEpisodes?: RecentEpisode[]
}

export default function RecentEpisodes({
  recentEpisodes,
}: RecentEpisodesProps) {
  return (
    <Section>
      <h3 className="w-full border-l-2 border-primary pb-6 pt-2.5 text-left text-2xl font-semibold">
        Recently Updated
      </h3>
      <ul className="relative grid grid-cols-3 gap-3 overflow-hidden md:grid-cols-4 lg:grid-cols-6">
        {recentEpisodes?.map((result) => (
          <li
            key={result.episodeId}
            className="col-span-1 overflow-hidden rounded-md"
          >
            <EpisodeCard animeResult={result} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
