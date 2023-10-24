"use server"
import db from "@/lib/db"
import { type Register } from "@/lib/validations/credentials"
import bcrypt from "bcrypt"
import { getCurrentUser } from "@/lib/current-user"
import { getSession } from "@/lib/session"

export async function increment(animeId: string) {
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
    },
  })

  return
}

type CreateWatchList = {
  animeId: string
  image: string
  title: string
  episodeNumber: string
  nextEpisode: string
  prevEpisode: string
}

export async function createWatchlist({
  animeId,
  image,
  title,
  episodeNumber,
  nextEpisode,
  prevEpisode,
}: CreateWatchList) {
  const session = await getSession()

  if (!session) return

  const checkEpisode = await db.watchlist.findFirst({
    where: {
      animeId,
      userId: session.user.id,
    },
  })

  if (checkEpisode) {
    return null
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
              nextEpisode,
              prevEpisode,
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
}: {
  animeId: string
  image: string
  title: string
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
    },
  })

  return
}

type UpdateWatchlist = {
  episodeId: string
  episodeNumber: string
  nextEpisode: string
  prevEpisode: string
  animeId: string
}

export async function updateWatchlist({
  episodeId,
  episodeNumber,
  nextEpisode,
  prevEpisode,
  animeId,
}: UpdateWatchlist) {
  const session = await getSession()

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
        nextEpisode,
        prevEpisode,
        episodeNumber: Number(episodeNumber),
        updatedAt: new Date(),
      },
    })

  return
}

export async function createBookmark({
  animeId,
  image,
  title,
}: {
  animeId: string
  image: string
  title: string
}) {
  const session = await getSession()

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
          },
        ],
      },
    },
  })

  return
}
