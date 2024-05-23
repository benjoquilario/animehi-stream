import React from "react"
import Column from "./column"
import {
  IAdvancedInfo,
  SeasonalResponse,
  Seasonal as ISeasonal,
  ConsumetResponse,
} from "types/types"
import Section from "../section"
import {
  popularThisSeason,
  popularAnime,
  mostfavoriteAnime,
  topAiring,
} from "@/lib/consumet"

export default async function Seasonal() {
  const [popularSeason, popular, mostFavorite, top] = await Promise.all([
    popularThisSeason(),
    popularAnime(),
    mostfavoriteAnime(),
    topAiring(),
  ])

  return (
    <Section sectionName="seasonal" className="my-5">
      <div className="grid grid-cols-2 gap-2 md:gap-4 xl:grid-cols-4">
        <Column
          seasonalTitle="Popular This Season"
          results={popularSeason.results}
        />
        <Column seasonalTitle="Top Airing" results={top.results} />
        <Column seasonalTitle="Most Popular Anime" results={popular.results} />
        <Column
          seasonalTitle="Most Favorite Anime"
          results={mostFavorite.results}
        />
      </div>
    </Section>
  )
}
