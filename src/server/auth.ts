"use server"
import db from "@/lib/db"
import {
  Credentials,
  credentialsValidator,
  registerValidator,
  type Register,
} from "@/lib/validations/credentials"
import bcrypt from "bcrypt"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { isRedirectError } from "next/dist/client/components/redirect"

export async function login(values: Credentials) {
  const validatedFields = credentialsValidator.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields",
    }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    return {
      ok: true,
      message: "Signed in successfully",
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid Credentials",
          }
        default:
          return {
            error: "Something went wrong",
          }
      }
    }

    throw error
  }
}

export async function register(values: Register) {
  const validatedFields = registerValidator.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields",
    }
  }

  const { userName, email, password, confirmPassword } = validatedFields.data

  const isEmailExist = await db.user.findFirst({
    where: { email },
  })

  if (isEmailExist) {
    return {
      error: "User already exist",
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const randomNumber = Math.floor(Math.random() * 6) + 1

  if (password !== confirmPassword) {
    return {
      error: "The passwords did not match",
    }
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      userName,
      image: `/avatar-${randomNumber}.png`,
    },
  })

  return {
    ok: true,
    message: "Account Created",
  }
}

export async function loginAnilist(provider: string) {
  try {
    await signIn(provider)

    return {
      success: true,
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
  }
}

export async function logout() {
  await signOut()
}
