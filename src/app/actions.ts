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
}

export async function createWatchlist({
  animeId,
  image,
  title,
  episodeNumber,
  nextEpisode,
}: CreateWatchList) {
  const session = await getSession()

  if (!session) throw new Error("Unauthenticated")

  const isEpisodeIdExist = await db.watchlist.findFirst({
    where: {
      episodeId: `${animeId}-episode-${episodeNumber}`,
    },
  })

  if (isEpisodeIdExist) return

  await db.watchlist.create({
    data: {
      episodeId: `${animeId}-episode-${episodeNumber}`,
      episodeNumber: Number(episodeNumber),
      image,
      title,
      animeId,
      userId: session.user.id,
      nextEpisode,
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
