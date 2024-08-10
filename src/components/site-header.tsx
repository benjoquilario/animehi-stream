"use client"

import Link from "next/link"
import Combobox from "./combobox"
import AuthForm from "./auth-form"
import { cn } from "@/lib/utils"
import ThemeToggle from "./theme-toggle"
import { buttonVariants } from "./ui/button"
import { useState, useEffect } from "react"
import { permanentMarker } from "@/lib/fonts"
import ClientOnly from "./ui/client-only"

export default function SiteHeader() {
  const [isFixed, setIsFixed] = useState(false)

  useEffect(() => {
    const doc = document.documentElement

    let currScroll: number
    let prevScroll = window.scrollY || doc.scrollTop
    let currDirection = 0
    let prevDirection = 0

    let threshold = 200
    let toggle: boolean

    const toggleHeader = () => {
      if (currDirection === 2 && currScroll > threshold) {
        setIsFixed(true)
      } else if (currDirection === 1) {
        setIsFixed(false)
      } else {
        toggle = false
      }

      return toggle
    }

    const checkScroll = () => {
      currScroll = window.scrollY || doc.scrollTop

      if (currScroll > prevScroll) {
        currDirection = 2
      } else {
        currDirection = 1
      }

      if (currDirection !== prevDirection) {
        toggle = toggleHeader()
      }

      if (toggle) {
        prevDirection = currDirection
      }

      prevScroll = currScroll
    }

    window.addEventListener("scroll", checkScroll)

    return () => window.removeEventListener("scroll", checkScroll)
  })

  return (
    <header
      className={cn(
        isFixed ? "top-[-56px]" : "top-0",
        "fixed left-0 z-[99999] h-[52px] w-full bg-background shadow-sm transition-all md:h-[64px] 2xl:h-[75px]"
      )}
    >
      <div className="mx-auto flex h-[52px] w-full max-w-screen-2xl items-center justify-between gap-4 bg-background px-[2%] md:h-[64px] 2xl:h-[75px]">
        <Link href="/" className="p-1 active:scale-95">
          <div className="flex">
            <div
              className={cn(
                permanentMarker.className,
                "text-base font-bold uppercase text-foreground md:text-3xl"
              )}
            >
              <span className="text-base font-extrabold text-primary md:text-4xl">
                A
              </span>
              nime
              <span className="text-base font-extrabold text-primary md:text-4xl">
                H
              </span>
              I
            </div>
          </div>
        </Link>
        <nav className="hidden flex-1 md:block">
          <div>
            <ul className="flex gap-4 text-muted-foreground/90">
              <li>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "linkHover", size: "sm" })
                  )}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "linkHover", size: "sm" })
                  )}
                >
                  Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/browse?query=&sort=POPULARITY_DESC"
                  className={cn(
                    buttonVariants({ variant: "linkHover", size: "sm" })
                  )}
                >
                  Browse
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="flex items-center space-x-3">
          <ClientOnly>
            <>
              <ThemeToggle />
              <Combobox />
              <AuthForm />
            </>
          </ClientOnly>
          {/* <Button onClick={() => signOut()}>Log out</Button> */}
        </div>
      </div>
    </header>
  )
}
