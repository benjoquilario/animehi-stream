import React, { useEffect, useState } from "react"
import Storage from "@/src/lib/utils/storage"
import DefaultLayout from "@/components/layouts/default"
import { NextSeo } from "next-seo"
import Section from "@/components/shared/section"
import TitleName from "@/components/shared/title-name"
import WatchCard from "@/components/shared/watch-card"
import { TitleType } from "types/types"
import { IAnimeInfo } from "@consumet/extensions/dist/models/types"
import Button from "@/components/shared/button"
import { BsFillTrashFill } from "react-icons/bs"

const Watchlist = () => {
  const [watchList, setWatchList] = useState<IAnimeInfo[] | []>([])
  const storage = new Storage("watchedList")

  useEffect(() => {
    const list =
      typeof window !== "undefined" && storage.find<IAnimeInfo>().reverse()
    setWatchList(list as IAnimeInfo[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deleteWatchList = () => {
    setWatchList([])
    return typeof window !== "undefined" && storage.clear()
  }

  const removeItem = (animeId?: string) => {
    const storage = new Storage("watchedList")

    typeof window !== "undefined" && storage.remove({ id: animeId })
    const list =
      typeof window !== "undefined" && storage.find<IAnimeInfo>().reverse()

    setWatchList(list as IAnimeInfo[])
  }

  return (
    <DefaultLayout>
      <NextSeo
        title="AnimeHi - WatchList"
        description="Watch anime shows, tv, movies for free without ads in your mobile, tablet or pc"
      />
      <Section>
        <main className="mt-[104px] px-[3%]">
          <div className="flex grid-cols-1 flex-col space-y-6 md:grid md:gap-4">
            <div>
              <div className="mb-4 flex w-full justify-between">
                <TitleName title="Watchlist" />
                <Button
                  onClick={deleteWatchList}
                  className="rounded-full p-1 text-[#ededed] transition hover:bg-background-900 md:p-2"
                  aria-label="previous page"
                >
                  <BsFillTrashFill className="h-6 w-6" />
                </Button>
              </div>
              <div className="relative grid grid-cols-2 gap-4 overflow-hidden sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {watchList?.map((list) => (
                  <WatchCard
                    onClick={() => removeItem(list.id)}
                    key={list.id}
                    id={list.id}
                    animeTitle={list.title as string}
                    image={list.image}
                    color={list.color}
                    episodeNumber={list.episodeNumber as number}
                    episodeId={list.episodeId as string}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </Section>
    </DefaultLayout>
  )
}

export default Watchlist
