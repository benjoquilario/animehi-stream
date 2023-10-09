import { TitleType } from "@/src/../types/types"
import {
  IAnimeInfo,
  IAnimeResult,
  ISearch,
} from "@consumet/extensions/dist/models/types"
import React from "react"
import ColumnSection from "../shared/column-section"

export type PopularProps = {
  popularSeason?: ISearch<IAnimeResult | IAnimeInfo>
  isLoading: boolean
}

const Popular = (props: PopularProps): JSX.Element =>
  !props.isLoading ? (
    <div className="block w-full">
      <h2 className="mb-2 px-4 text-base font-semibold uppercase text-white md:text-[20px]">
        Most Popular Anime
      </h2>

      <div className="bg-background-700">
        <ul>
          {props.popularSeason?.results?.map((anime) => (
            <ColumnSection
              data={anime}
              genres={anime.genres as string[]}
              key={anime.id}
            />
          ))}
          <li>
            <button className="flex w-full items-center justify-center bg-background-900 py-3 text-white">
              View More
            </button>
          </li>
        </ul>
      </div>
    </div>
  ) : (
    <PopularLoading />
  )

const ColumnLoading = () => (
  <div className="h-[88px] w-full animate-pulse odd:bg-background-800 even:bg-background-900"></div>
)

const PopularLoading = () => {
  return (
    <div className="flex h-[824px] w-full flex-col">
      <div className="mb-3 h-[30px] w-[200px] rounded-lg bg-background-900"></div>
      {Array.from(Array(9), (_, i) => (
        <ColumnLoading key={i} />
      ))}
    </div>
  )
}

export default React.memo(Popular)
