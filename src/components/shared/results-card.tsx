import React from "react"
import Thumbnail from "./thumbnail"
import TitleName from "./title-name"
import { TitleType } from "types/types"
import { IAnimeInfo } from "@consumet/extensions/dist/models/types"

type ResultsCardProps = {
  isLoading: boolean
  title?: string
  animeList?: IAnimeInfo[]
}

const ResultsCard = (props: ResultsCardProps): JSX.Element => (
  <div>
    {props.title ? <TitleName title={props.title} /> : null}
    <div className="relative grid grid-cols-2 gap-4 overflow-hidden sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {props.isLoading
        ? Array.from(Array(12), (_, i) => <SkeletonLoading key={i} />)
        : props.animeList?.map((anime) => (
            <Thumbnail
              key={anime.id}
              data={anime}
              isRecent={false}
              image={anime.image}
              episodePoster={anime.cover}
              genres={anime.genres}
            />
          ))}
    </div>
  </div>
)

const SkeletonLoading = () => (
  <div className="relatve flex animate-pulse flex-col">
    <div className="h-[210px] rounded-lg bg-[#141313] md:h-[235px] md:w-[144px] md:min-w-[153px] xl:w-[190px] xl:min-w-[190px]"></div>
    <div className="mt-2 h-4 w-full rounded-lg bg-[#141313]"></div>
  </div>
)

export default React.memo(ResultsCard)
