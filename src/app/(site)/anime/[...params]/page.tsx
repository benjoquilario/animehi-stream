import Anime from "@/components/anime/anime-info"
import type { Metadata } from "next"
import type { IAnilistInfo } from "types/types"
import { animeInfo } from "@/lib/consumet"

type AnimeProps = {
  params: {
    params: string[]
  }
}

export async function generateMetadata({
  params,
}: {
  params: {
    params: string[]
  }
}): Promise<Metadata | undefined> {
  const [slug, animeId] = params.params

  const animeResponse = (await animeInfo(animeId)) as IAnilistInfo

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
      title: `${title} - AnimeHi`,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/anime/${slug}/${animeId}`,
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

export default function AnimePage({ params }: AnimeProps) {
  const [slug, animeId] = params.params as string[]

  return <Anime animeId={animeId} slug={slug} />
}
