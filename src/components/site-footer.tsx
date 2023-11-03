import { Separator } from "./ui/separator"
import Link from "next/link"
import Image from "next/image"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import ThemeToggle from "./theme-toggle"

export default function SiteFooter() {
  return (
    <>
      <footer className="mt-8 flex w-full flex-col px-[3%] pt-9">
        <Separator className="my-4" />
        <div className="flex flex-col">
          <div className="mb-5 flex flex-col items-start justify-between gap-5 xl:flex-row xl:items-center">
            <div>
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
              <p className="mt-1 max-w-md text-xs italic text-muted-foreground/70">
                This site does not store any files on our server, we only linked
                to the media which is hosted on 3rd party services.
              </p>
            </div>
            <nav className="" aria-label="others links">
              <ul className="flex gap-3">
                <li className="text-muted-foreground/80 hover:text-muted-foreground">
                  <Link href="/popular">This Season</Link>
                </li>
                <li className="text-muted-foreground/80 hover:text-muted-foreground">
                  <Link href="/popular">Popular Anime</Link>
                </li>
                <li className="text-muted-foreground/80 hover:text-muted-foreground">
                  <Link href="/popular">Donate</Link>
                </li>
                <li className="text-muted-foreground/80 hover:text-muted-foreground">
                  <Link href="/popular">DMCA</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mb-1 mt-3 flex flex-col items-start justify-between xl:flex-row xl:items-center">
            <p className="text-xs text-muted-foreground/70 xl:text-sm">
              © 2023 animehi. Made by Benjo Quilario.
            </p>
            <div className="flex items-center gap-2">
              <Link href="/">
                <GitHubLogoIcon className="h-6 w-6" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
