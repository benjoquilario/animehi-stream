import ColumnSection from "@/components/shared/column-section"
import { IAnimeInfo, IAnimeResult, ISearch } from "@consumet/extensions"
import React from "react"
import TitleName from "@/components/shared/title-name"

export type RowProps = {
  animeList?: ISearch<IAnimeResult | IAnimeInfo>
  title: string
  isLoading: boolean
  season?: string
}

const Row = (props: RowProps): JSX.Element =>
  !props.isLoading ? (
    <div className="w-full">
      <div className="md:space-between flex flex-col items-center space-x-0 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="w-full flex-1 bg-background-800 pt-4">
          <TitleName classNames="ml-4" title={props.title} />
          <ul className="w-full">
            {props.animeList?.results?.map((anime) => (
              <ColumnSection
                key={anime.id}
                data={anime}
                genres={anime.genres as string[]}
              />
            ))}
            <li>
              <button className="flex w-full items-center justify-center bg-[#111] py-3 text-white">
                View More
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <RowLoading />
  )

const ColumnLoading = () => (
  <div className="h-[88px] w-full animate-pulse odd:bg-[#0d0d0d] even:bg-[#111]"></div>
)

const RowLoading = () => {
  return (
    <div className="flex h-[520px] w-full flex-col">
      <div className="mb-3 h-[30px] w-[200px] rounded-lg bg-[#111]"></div>
      {Array.from(Array(5), (_, i) => (
        <ColumnLoading key={i} />
      ))}
    </div>
  )
}

export default React.memo(Row)
