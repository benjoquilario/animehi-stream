"use server"
import db from "@/lib/db"
import { type Register } from "@/lib/validations/credentials"
import bcrypt from "bcrypt"
import { getCurrentUser } from "@/lib/current-user"

type SaveWatchList = {
  animeId: string
  image: string
  title: string
}

export const saveWatchList = async ({
  animeId,
  image,
  title,
}: SaveWatchList) => {
  const currentUser = await getCurrentUser()

  if (!currentUser) throw new Error("Unauthenticated")

  await db.watchlist.create({
    data: {
      animeId,
      image,
      title,
      userId: currentUser.id,
    },
  })
}

export const register = async ({
  confirmPassword,
  password,
  userName,
  email,
}: Register) => {
  const isEmailExist = await db.user.findFirst({
    where: { email },
  })

  if (isEmailExist) throw new Error("User already exist")

  const hashedPassword = await bcrypt.hash(password, 12)

  if (password !== confirmPassword) {
    throw new Error("The passwords did not match")
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  })
}
