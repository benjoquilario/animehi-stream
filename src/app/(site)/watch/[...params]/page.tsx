import { animeInfo } from "@/lib/consumet"
import Sharethis from "@/components/sharethis"
import type { Metadata } from "next"
import Comments from "@/components/comments/comments"
import type { IAnilistInfo } from "types/types"
import BreadcrumbWatch from "@/components/breadcrumb-watch"
import { getCurrentUser } from "@/lib/current-user"
import VideoPlayer from "@/components/player/oplayer/csr"

type Params = {
  params: {
    params: string[]
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: {
    params: string[]
  }
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata | undefined> {
  const [animeId, anilistId] = params.params

  const episode = searchParams.episode

  const animeResponse = (await animeInfo(anilistId)) as IAnilistInfo

  if (!animeResponse) {
    return
  }

  const title = animeResponse.title.english ?? animeResponse.title.romaji
  const description = animeResponse.description
  const imageUrl = animeResponse.cover ?? animeResponse.image

  return {
    title,
    description,
    openGraph: {
      title: `Watch ${title} | AnimeHi`,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/watch/${animeId}/${anilistId}?episode=${episode}`,
      images: [
        {
          url: `${imageUrl}`,
          width: 600,
          height: 400,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${imageUrl}`,
          width: 600,
          height: 400,
        },
      ],
    },
  }
}

export default async function Watch({
  params: { params },
  searchParams,
}: Params) {
  const [animeId, anilistId] = params as string[]
  const animeResponse = (await animeInfo(anilistId)) as IAnilistInfo

  const currentUser = await getCurrentUser()

  return (
    <div className="mt-2 flex-1">
      <BreadcrumbWatch animeId={anilistId} animeTitle={animeId} />
      <VideoPlayer
        animeResponse={animeResponse}
        animeId={animeId}
        anilistId={anilistId}
        currentUser={currentUser}
      />

      {/* <VideoPlayer animeId={animeId} episodeNumber={episodeNumber} /> */}
      {/* <Suspense>

      </Suspense> */}
    </div>
  )
}
