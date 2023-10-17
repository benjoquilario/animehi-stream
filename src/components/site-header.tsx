import Link from "next/link"
import Image from "next/image"
import Combobox from "./combobox"
import AuthForm from "./auth-form"
import { getSession } from "@/lib/session"
import { getCurrentUser } from "@/lib/current-user"

export default async function SiteHeader() {
  const session = await getCurrentUser()

  return (
    <header className="fixed left-0 top-0 z-[99999] h-[52px] w-full bg-background shadow-sm transition-all md:h-[64px] 2xl:h-[75px]">
      <div className="mx-auto flex h-[52px] w-full max-w-screen-2xl items-center justify-between gap-4 px-[2%] md:h-[64px] 2xl:h-[75px]">
        <Link href="/">
          <div className="flex">
            <div className="relative h-[24px] w-[24px] md:h-[28px] md:w-[28px]">
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
              <Link href="/" className="text-sm">
                Home
              </Link>
            </ul>
          </div>
        </nav>
        <div className="flex items-center space-x-3">
          <Combobox />
          <AuthForm />
          {/* <Button onClick={() => signOut()}>Log out</Button> */}
        </div>
      </div>
    </header>
  )
}
