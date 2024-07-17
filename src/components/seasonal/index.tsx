import React from "react"
import Column from "./column"
import Section from "../section"
import {
  popularThisSeason,
  popularAnime,
  mostfavoriteAnime,
  topAiring,
} from "@/lib/consumet"
import { getSeason } from "@/lib/utils"

export default async function Seasonal() {
  const [popularSeason, popular, mostFavorite, top] = await Promise.all([
    popularThisSeason(),
    popularAnime(),
    mostfavoriteAnime(),
    topAiring(),
  ])

  const currentSeason = getSeason()

  return (
    <Section sectionName="seasonal" className="my-5">
      <div className="grid grid-cols-2 gap-2 md:gap-4 xl:grid-cols-4">
        <Column
          seasonalTitle="Popular This Season"
          results={popularSeason.results}
          browse={`/browse?query=&season=${currentSeason.season}&format=TV&year=${currentSeason.year}&sort=POPULARITY_DESC`}
        />
        <Column
          seasonalTitle="Top Airing"
          results={top.results}
          browse={`/browse?query=&season=${currentSeason.season}&year=${currentSeason.year}&format=TV&sort=SCORE_DESC`}
        />
        <Column
          seasonalTitle="Most Popular Anime"
          results={popular.results}
          browse={`/browse?query=&sort=POPULARITY_DESC&format=TV`}
        />
        <Column
          seasonalTitle="Most Favorite Anime"
          results={mostFavorite.results}
          browse="/browse?query=&sort=FAVOURITES_DESC&format=TV"
        />
      </div>
    </Section>
  )
}
