import Link from "next/link"
import Image from "next/image"
import { Button, buttonVariants } from "./ui/button"
import { Badge } from "./ui/badge"
import { AiOutlineSearch } from "react-icons/ai"
import ThemeToggle from "./theme-toggle"

export default function SiteHeader() {
  return (
    <header className="fixed left-0 top-0 z-[99999] h-[52px] w-full bg-background shadow-sm transition-all md:h-[64px] 2xl:h-[75px]">
      <div className="mx-auto flex h-[52px] w-full max-w-screen-2xl items-center gap-4 px-[2%] md:h-[64px] 2xl:h-[75px]">
        <Link href="/">
          <div className="flex">
            <div className="relative h-[20px] w-[20px] md:h-[24px] md:w-[24px]">
              <Image fill src="/animehi.svg" alt="animehi" priority />
            </div>
            <span className="text-sm font-semibold uppercase md:text-[20px] 2xl:text-[30px]">
              nimeHi
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
          <Button variant="outline" className="space-x-6">
            <div className="flex items-center space-x-2">
              <AiOutlineSearch className="h-6 w-6" />
              Search anime...
            </div>
            <Badge>Ctrl K</Badge>
          </Button>
          <Link href="/" className={buttonVariants()}>
            Sign in
          </Link>
          {/* <ThemeToggle /> */}
        </div>
      </div>
    </header>
  )
}
