import React, { useEffect, useState } from "react"
import Storage from "@/src/lib/utils/storage"
import { Swiper, SwiperSlide } from "swiper/react"
import { RecentType } from "types/types"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FreeMode, Pagination } from "swiper"
import Button from "@/components/shared/button"
import TitleName from "@/components/shared/title-name"
import WatchCard from "@/components/shared/watch-card"
import { BsFillTrashFill } from "react-icons/bs"

const breakpoints = {
  1280: {
    slidesPerView: 6,
  },
  1024: {
    slidesPerView: 6,
  },
  768: {
    slidesPerView: 4,
  },
  640: {
    slidesPerView: 3,
  },
  0: {
    slidesPerView: 3,
  },
}

const ContinueWatching = () => {
  const [recentWatched, setRecentWatched] = useState<RecentType[] | []>([])
  const storage = new Storage("recentWatched")

  useEffect(() => {
    const list =
      typeof window !== "undefined" && storage.find<RecentType>().reverse()
    setRecentWatched(list as RecentType[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteRecentWatched = () => {
    setRecentWatched([])
    return typeof window !== "undefined" && storage.clear()
  }

  const removeItem = (animeId?: string) => {
    typeof window !== "undefined" && storage.remove({ id: animeId })
    const list =
      typeof window !== "undefined" && storage.find<RecentType>().reverse()

    setRecentWatched(list as RecentType[])
  }

  return recentWatched.length > 0 ? (
    <div className="relative">
      <div className="flex items-center justify-between text-white">
        <TitleName title="Continue Watching" />
        <Button
          onClick={deleteRecentWatched}
          className="rounded-full p-1 text-[#ededed] transition hover:bg-background-900 md:p-2"
          aria-label="previous page"
        >
          <BsFillTrashFill className="h-6 w-6" />
        </Button>
      </div>
      <Swiper
        breakpoints={breakpoints}
        spaceBetween={8}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        {recentWatched?.map((anime) => (
          <SwiperSlide key={anime.id}>
            <WatchCard
              onClick={() => removeItem(anime.id)}
              id={anime.id}
              animeTitle={anime.animeTitle}
              image={anime.image}
              color={anime.color}
              episodeNumber={anime.episodeNumber}
              episodeId={anime.episodeId}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  ) : null
}

export default React.memo(ContinueWatching)
