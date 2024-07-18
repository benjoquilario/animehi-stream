import { animeInfo } from "@/lib/consumet"
import type { Metadata } from "next"
import type { IAnilistInfo } from "types/types"
import { getCurrentUser } from "@/lib/current-user"
import VideoPlayer from "@/components/player/vidstack"
import { Suspense } from "react"

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
  const id = searchParams.id as string
  const slug = searchParams.slug as string
  const ep = searchParams.ep as string

  const animeResponse = (await animeInfo(id)) as IAnilistInfo

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
      url: `${process.env.NEXT_PUBLIC_APP_URL}/watch?id=${id}&slug=${slug}?ep=${ep}`,
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
  const id = searchParams.id as string
  const slug = searchParams.slug as string
  const ep = searchParams.ep as string

  const animeResponse = (await animeInfo(id)) as IAnilistInfo

  const currentUser = await getCurrentUser()

  return (
    <div className="mt-2 flex-1">
      <VideoPlayer
        anilistId={id}
        animeId={slug}
        animeResponse={animeResponse}
        currentUser={currentUser}
        ep={ep}
      />
    </div>
  )
}
