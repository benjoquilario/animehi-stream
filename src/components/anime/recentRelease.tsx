import useSWR from "swr"
import Thumbnail from "@/components/shared/thumbnail"
import React, { useState, useEffect } from "react"
import { EnimeType } from "@/src/../types/types"
import Pagination from "@/components/shared/pagination"
import TitleName from "@/components/shared/title-name"
import { ENIME_URL } from "@/lib/constant"

interface RecentResults {
  sources: {
    id: string
    priority: number
    subtitle: boolean
    url: string
    website: string
  }[]
  createdAt: string
  number: number
  title: string
  description: string
  anime: EnimeType
  image: string
}

const RecentRelease = (): JSX.Element => {
  const [recent, setRecent] = useState<RecentResults[] | []>([])
  const [pageNumber, setPageNumber] = useState(1)

  const fetcher = async (page: number) =>
    fetch(`${ENIME_URL}recent?page=${page}&perPage=12&language=JP`).then(
      (res) => res.json()
    )

  const { data, error } = useSWR([pageNumber], fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  })

  useEffect(() => {
    if (!data && !error) return

    setRecent(data?.data)
  }, [pageNumber, error, data])

  return (
    <div>
      <div className="flex items-center justify-between text-white">
        <TitleName title="Latest Releases" />
        <Pagination
          className="rounded-full p-1 text-[#ededed] transition hover:bg-background-900 md:p-2"
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </div>
      <div
        // ref={rowRef}
        className="relative grid grid-cols-3 gap-2 overflow-hidden md:grid-cols-4 lg:grid-cols-6"
      >
        {!data && !error
          ? Array.from(Array(12), (_, i) => <RecentLoading key={i} />)
          : recent?.map(
              ({
                anime,
                sources,
                number,
                description,
                image,
                title,
                createdAt,
              }) => (
                <Thumbnail
                  key={sources?.[0]?.id}
                  episodeNumber={number}
                  description={description}
                  data={anime}
                  isRecent={true}
                  image={anime.coverImage || anime.bannerImage}
                  episodePoster={
                    (image && `https://images.weserv.nl/?url=${image}`) ||
                    anime.bannerImage ||
                    anime.coverImage
                  }
                  episodeTitle={title}
                  episodeId={sources?.[0]?.id}
                  genres={anime.genre}
                  createdAt={createdAt}
                />
              )
            )}
      </div>
    </div>
  )
}

const RecentLoading = () => (
  <div className="relatve flex animate-pulse flex-col">
    <div className="h-[160px] min-h-[160px] rounded-lg bg-[#141313] md:h-[210px] md:min-h-[221px] md:w-[187px] md:min-w-[187px] lg:w-[155px] lg:min-w-[155px] 2xl:w-[180px] 2xl:min-w-[180px]"></div>
    <div className="mt-2 h-4 w-full rounded-lg bg-[#141313]"></div>
  </div>
)

export default React.memo(RecentRelease)
