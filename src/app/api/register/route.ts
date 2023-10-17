import { registerValidator } from "@/lib/validations/credentials"
import db from "@/lib/db"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { userName, email, password, confirmPassword } =
    registerValidator.parse(body)
  const isEmailExist = await db.user.findFirst({
    where: { email },
  })

  if (isEmailExist) throw new Error("User already exist")

  const hashedPassword = await bcrypt.hash(password, 12)

  if (password !== confirmPassword) {
    throw new Error("The passwords did not match")
  }

  const createUser = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      userName,
    },
  })

  return NextResponse.json(createUser)
}
