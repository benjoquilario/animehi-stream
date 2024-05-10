"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "./ui/button"
import Login from "./auth/login"
import Register from "./auth/register"
import { signOut, useSession } from "next-auth/react"
import { useAuthStore } from "@/store"
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
import Link from "next/link"
import { ImSpinner8 } from "react-icons/im"

const AuthForm = () => {
  const { data: session, status } = useSession()
  const [isAuthOpen, setIsAuthOpen] = useAuthStore((store) => [
    store.isAuthOpen,
    store.setIsAuthOpen,
  ])
  const [authType, setAuthType] = useState(false)

  if (status === "loading") {
    return (
      <div className={buttonVariants({ size: "sm", variant: "ghost" })}>
        <ImSpinner8 className="h-4 w-4 animate-spin" />
      </div>
    )
  } else
    return (
      <>
        {!session ? (
          <Button size="sm" onClick={() => setIsAuthOpen(true)}>
            Sign in
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                aria-label="toggle dropdown"
                className="relative h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name ?? ""}
                  />
                  <AvatarFallback>
                    <div className="h-full w-full animate-pulse"></div>
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="mr-4 mt-4 w-64"
              align="start"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    className="w-full"
                    href={`/profile/${session?.user?.id}`}
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button
                  onClick={() => signOut()}
                  // variant="ghost"
                  className="relative h-8 w-full justify-start"
                >
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
          <DialogContent className="pb-12 md:pb-6">
            <DialogHeader>
              <DialogTitle>
                {!authType ? "Login" : "Create an account"}
              </DialogTitle>
              <DialogDescription>
                {authType
                  ? "Create an account to enjoy more features"
                  : "Enjoy your favourite anime in high quality for free!"}
              </DialogDescription>
            </DialogHeader>
            {!authType ? <Login /> : <Register />}
            <div className="absolute bottom-4 left-6">
              Don't have an account?
              <button
                className="ml-2 text-primary"
                onClick={() => setAuthType((authType) => !authType)}
              >
                {authType ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
}

export default AuthForm
