import React from "react"
import Link from "next/link"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper"
import Icon from "@/components/shared/icon"
import Genre from "@/components/shared/genre"
import { PlayIcon, InformationCircleIcon } from "@heroicons/react/solid"
import { TitleType } from "@/src/../types/types"
import { episodesTitle, stripHtml } from "@/src/lib/utils/index"
import {
  IAnimeInfo,
  IAnimeResult,
  ISearch,
} from "@consumet/extensions/dist/models/types"
import { title } from "@/lib/helper"
import { LoadingBanner } from "../shared/loading"

export interface BannerResult extends IAnimeResult {
  title: TitleType
  genres: string[]
}

export type BannerProps = {
  animeList?: ISearch<IAnimeInfo | IAnimeResult>
  isLoading: boolean
}

const Banner = ({ animeList, isLoading }: BannerProps): JSX.Element =>
  !isLoading ? (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {animeList?.results?.map((anime) => (
        <SwiperSlide key={anime.id}>
          <div className="relative h-[326px] min-h-[326px] w-full md:h-[450px] md:min-h-[450px] 2xl:h-[620px] 2xl:min-h-[620px]">
            <div className="relative flex h-full w-full shrink-0 items-center">
              <span className="banner-linear absolute left-0 top-0 z-[20] h-[101%] w-full"></span>
              <div className="absolute bottom-[15%] left-0 z-[20] w-[80%] pl-[4%] pr-[1rem] md:w-[40%] md:pl-0">
                <h1 className="line-clamp-2 text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
                  {title(anime.title as TitleType)}
                </h1>

                <p className="mt-2 line-clamp-2 text-sm font-extralight leading-6 text-slate-300 md:text-base">
                  {stripHtml(`${anime?.description}`)}
                </p>
                <div className="mr-2 mt-2 hidden flex-wrap gap-2 md:flex">
                  {/* @ts-ignore */}
                  {anime?.genres?.map((genre: string) => (
                    <div className="flex items-center gap-2" key={genre}>
                      <Genre genre={genre} />
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/watch/${anime?.id}?episode=${episodesTitle(
                      /* @ts-ignore */
                      anime?.title?.romaji as string
                    )}-episode-1`}
                  >
                    <a className="mt-4 flex items-center justify-center gap-2 rounded-md rounded-sm bg-primary px-4 py-2 font-semibold text-gray-200 transition-all ease-in-out hover:scale-105 hover:bg-primary">
                      <Icon icon={PlayIcon} text={`Play Now`} />
                    </a>
                  </Link>
                  <Link href={`/anime/${anime?.id}`}>
                    <a className="mt-4 flex items-center justify-center gap-2 rounded-md rounded-sm bg-[#6e6f74] px-4 py-2 font-semibold text-gray-200 transition-all ease-in-out hover:scale-105 hover:bg-primary">
                      <Icon icon={InformationCircleIcon} text={`Read More`} />
                    </a>
                  </Link>
                </div>
              </div>

              <div className="absolute right-0 z-[2] h-full w-full grow md:z-40 md:h-[320px] md:w-[60%]">
                <div
                  style={{
                    backgroundImage: `url("${anime?.cover || anime?.image}")`,
                  }}
                  className="relative mt-6 h-full	w-full	overflow-hidden rounded-md bg-cover bg-center bg-no-repeat"
                ></div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  ) : (
    <LoadingBanner />
  )

export default React.memo(Banner)
