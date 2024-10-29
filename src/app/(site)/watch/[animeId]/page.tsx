import { animeInfo } from "@/lib/consumet"
import type { Metadata } from "next"
import type { IAnilistInfo } from "types/types"
import { getCurrentUser } from "@/lib/current-user"
import VideoPlayer from "@/components/player/vidstack"
import { notFound } from "next/navigation"
import { getAnimeViews } from "@/lib/metrics"

type Params = {
  params: {
    animeId: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
  params,
  searchParams,
}: Params): Promise<Metadata | undefined> {
  const animeId = params.animeId
  const ep = searchParams.ep as string

  const animeResponse = (await animeInfo(animeId)) as IAnilistInfo

  if (!animeResponse) {
    return
  }

  const title = animeResponse.title.english ?? animeResponse.title.romaji
  const description = animeResponse.description
  const imageUrl = animeResponse.cover ?? animeResponse.image

  return {
    title: `Watch ${title} Episode ${ep} - AnimeHi`,
    description,
    openGraph: {
      title: `Watch ${title} Episode ${ep} - AnimeHi`,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/watch/${animeId}?ep=${ep}`,
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

export default async function Watch({ params, searchParams }: Params) {
  const animeId = params.animeId
  const animeResponse = (await animeInfo(animeId)) as IAnilistInfo
  const currentUser = await getCurrentUser()

  const animeViews = await getAnimeViews(animeId)

  if (!animeResponse || !animeId) notFound()

  console.log(animeViews)

  return (
    <div className="mt-2 flex-1">
      <VideoPlayer
        anilistId={animeId}
        animeResponse={animeResponse}
        currentUser={currentUser}
        views={animeViews?.view as number}
      />
    </div>
  )
}
