import Link from "next/link"
import Image from "next/image"
import Combobox from "./combobox"
import AuthForm from "./auth-form"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/lib/current-user"
import ThemeToggle from "./theme-toggle"
import { buttonVariants } from "./ui/button"

export default async function SiteHeader() {
  const session = await getCurrentUser()

  return (
    <header className="fixed left-0 top-0 z-[99999] h-[52px] w-full bg-background shadow-sm transition-all md:h-[64px] 2xl:h-[75px]">
      <div className="mx-auto flex h-[52px] w-full max-w-screen-2xl items-center justify-between gap-4 px-[2%] md:h-[64px] 2xl:h-[75px]">
        <Link href="/" className="p-1">
          <div className="flex">
            <div className="relative h-[24px] w-[24px] p-2 md:h-[28px] md:w-[28px]">
              <Image fill src="/animehi.svg" alt="animehi" priority />
            </div>
            <span className="text-base font-semibold uppercase md:text-[28px] 2xl:text-[32px]">
              nime
              <span className="text-[28px] font-extrabold md:text-[35px]">
                H
              </span>
              i
            </span>
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
            </ul>
          </div>
        </nav>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Combobox />
          <AuthForm />
          {/* <Button onClick={() => signOut()}>Log out</Button> */}
        </div>
      </div>
    </header>
  )
}
