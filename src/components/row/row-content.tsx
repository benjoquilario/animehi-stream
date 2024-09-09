import React from "react"
import { getSeason } from "@/lib/utils"
import {
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchTopAiringAnime,
  fetchTopAnime,
  fetchUpcomingSeasons,
  fetchMostPopularAnime,
  fetchMostFavoriteAnime,
} from "@/lib/consumet"
import Row from "./content"

const RowContent = async () => {
  const currentSeason = getSeason()

  const [
    trending,
    popular,
    mostPopular,
    mostFavorite,
    topRated,
    topAiring,
    Upcoming,
  ] = await Promise.all([
    fetchTrendingAnime(1, 20),
    fetchPopularAnime(1, 20),
    fetchMostPopularAnime(1, 20),
    fetchMostFavoriteAnime(1, 20),
    fetchTopAnime(1, 20),
    fetchTopAiringAnime(1, 20),
    fetchUpcomingSeasons(1, 20),
  ])

  return (
    <div>
      <Row
        seasonalTitle="Popular This Season"
        results={popular.results}
        browse={`/browse?query=&season=${currentSeason.season}&format=TV&year=${currentSeason.year}&sort=POPULARITY_DESC`}
      />

      <Row
        seasonalTitle="Top Airing"
        results={topRated.results}
        browse={`/browse?query=&season=${currentSeason.season}&year=${currentSeason.year}&format=TV&sort=SCORE_DESC`}
      />

      <Row
        seasonalTitle="Most Popular Anime"
        results={mostPopular.results}
        browse={`/browse?query=&sort=POPULARITY_DESC&format=TV`}
      />

      <Row
        seasonalTitle="Most Favorite Anime"
        results={mostFavorite.results}
        browse="/browse?query=&sort=FAVOURITES_DESC&format=TV"
      />
    </div>
  )
}

export const RowUpComing = async () => {
  const upcoming = await fetchUpcomingSeasons(1, 20)

  return (
    <div>
      <Row
        seasonalTitle="Next Season"
        results={upcoming.results}
        browse="/browse?query=&sort=FAVOURITES_DESC&format=TV"
        isNextSeason={true}
      />
    </div>
  )
}

export default RowContent
