"use server"
import db from "@/lib/db"
import { auth } from "@/auth"

export async function increment(animeId: string, latestEpisodeNumber: number) {
  const data = await db.viewCounter.findFirst({
    where: {
      animeId,
    },
  })

  if (!data) return

  const view = data.view

  await db.viewCounter.update({
    where: {
      id: data.id,
    },
    data: {
      view: view + 1,
      latestEpisodeNumber,
    },
  })

  return
}

type CreateWatchList = {
  animeId: string
  image: string
  title: string
  episodeNumber: string
  anilistId: string
}

export async function createWatchlist({
  animeId,
  image,
  title,
  episodeNumber,
  anilistId,
}: CreateWatchList) {
  const session = await auth()

  if (!session) return

  const checkEpisode = await db.watchlist.findFirst({
    where: {
      animeId,
      userId: session.user.id,
    },
  })

  if (checkEpisode) {
    return
  } else
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        watchlists: {
          create: [
            {
              episodeId: `${animeId}-episode-${episodeNumber}`,
              episodeNumber: Number(episodeNumber),
              image,
              title,
              animeId,
              anilistId,
            },
          ],
        },
      },
    })

  return
}

export async function createViewCounter({
  animeId,
  image,
  title,
  latestEpisodeNumber,
  anilistId,
}: {
  animeId: string
  image: string
  title: string
  latestEpisodeNumber: number
  anilistId: string
}) {
  const isAnimeIdExist = await db.viewCounter.findFirst({
    where: {
      animeId: animeId,
    },
  })

  if (isAnimeIdExist) return

  await db.viewCounter.create({
    data: {
      image,
      title,
      animeId,
      view: 1,
      latestEpisodeNumber,
      anilistId,
    },
  })

  return
}

type UpdateWatchlist = {
  episodeId: string
  episodeNumber: string
  animeId: string
  image: string
}

export async function updateWatchlist({
  episodeId,
  episodeNumber,
  animeId,
  image,
}: UpdateWatchlist) {
  const session = await auth()

  if (!session) return

  const checkAnime = await db.watchlist.findFirst({
    where: {
      animeId,
      userId: session.user.id,
    },
  })

  if (checkAnime)
    await db.watchlist.update({
      where: {
        id: checkAnime.id,
        userId: session.user.id,
      },
      data: {
        episodeId,
        episodeNumber: +episodeNumber,
        updatedAt: new Date(),
        image,
      },
    })

  return
}

export async function deleteWatchlist({ id }: { id: string }) {
  const session = await auth()

  if (!session) return

  await db.watchlist.delete({
    where: {
      id,
    },
  })

  return {
    message: "Success",
  }
}

export async function deleteBookmark({
  animeId,
  id,
}: {
  animeId: string
  id: string
}) {
  const session = await auth()

  if (!session) return

  const checkAnime = await db.bookmark.findFirst({
    where: {
      userId: session.user.id,
      animeId,
    },
  })

  if (checkAnime) {
    await db.bookmark.delete({
      where: {
        id,
        animeId,
      },
    })
  }

  return
}

export async function createBookmark({
  animeId,
  image,
  title,
  anilistId,
}: {
  animeId: string
  image: string
  title: string
  anilistId: string
}) {
  const session = await auth()

  if (!session) return

  const checkAnime = await db.bookmark.findFirst({
    where: {
      userId: session.user.id,
      animeId,
    },
  })

  if (checkAnime) return

  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bookMarks: {
        create: [
          {
            animeId,
            image,
            title,
            anilistId,
          },
        ],
      },
    },
  })

  return
}
