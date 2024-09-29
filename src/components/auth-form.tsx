"use client"
import React, { useTransition } from "react"
import { Button, buttonVariants } from "./ui/button"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAuthStore } from "@/store"

import Link from "next/link"
import { logout } from "@/server/auth"
import { useSession } from "next-auth/react"
import { ImSpinner8 } from "react-icons/im"
import { toast } from "sonner"
import { loginAnilist } from "@/server/auth"

const AuthForm = () => {
  const { data: session, status } = useSession()
  const [isAuthOpen, setIsAuthOpen] = useAuthStore((store) => [
    store.isAuthOpen,
    store.setIsAuthOpen,
  ])
  const [isAnilistLoading, startTransitionAnilist] = useTransition()

  const [isLogin, setIsLogin] = useAuthStore((store) => [
    store.isLogin,
    store.setIsLogin,
  ])

  if (status === "loading") {
    return (
      <div className={buttonVariants({ size: "sm", variant: "ghost" })}>
        <ImSpinner8 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  const clickHandler = async (provider: string) => {
    try {
      const res = await loginAnilist(provider)

      if (res?.success) window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="toggle dropdown"
          className="relative h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                `${session ? session.user.image : "/placeholder.png"}` ??
                "/placeholder.png"
              }
              alt={`${session ? session.user.name : ""}` ?? ""}
            />
            <AvatarFallback>
              <div className="h-full w-full animate-pulse"></div>
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 mt-4 w-64" align="start" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            {session ? (
              <Link
                className="w-full"
                href={`/user/${session?.user?.name}/${session.user.id}`}
              >
                Profile
              </Link>
            ) : (
              <Link className="w-full" href={`/user`}>
                Profile
              </Link>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          {session ? (
            <button
              onClick={() => logout()}
              // variant="ghost"
              className="relative h-8 w-full justify-start"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={clickHandler.bind(null, "anilist")}
              className="relative h-8 w-full justify-start"
            >
              Sign in
            </button>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AuthForm
