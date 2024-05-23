import EpisodeCard from "./episode-card"
import Section from "./section"
import {
  ConsumetResponse as TConsumetResponse,
  RecentEpisode as TRecentEpisode,
} from "types/types"
import { recent } from "@/lib/consumet"

export default async function RecentEpisodes() {
  const recentResponse = (await recent()) as TConsumetResponse<TRecentEpisode>

  return (
    <Section sectionName="recent">
      <h3 className="flex w-full pb-6 pt-2.5 text-left text-[15px] font-semibold md:text-2xl">
        <div className="mr-2 h-6 w-2 rounded-md bg-primary md:h-8"></div>
        Recently Updated
      </h3>
      <ul className="relative grid grid-cols-3 gap-3 overflow-hidden md:grid-cols-4 lg:grid-cols-5">
        {recentResponse.results.map((result) => (
          <li key={result.id} className="col-span-1 overflow-hidden rounded-md">
            <EpisodeCard animeResult={result} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
