import { Separator } from "./ui/separator"
import Link from "next/link"
import Image from "next/image"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import ThemeToggle from "./theme-toggle"

export default function SiteFooter() {
  return (
    <>
      <footer className="flex w-full flex-col px-[3%]">
        <Separator className="my-8" />
        <div className="flex flex-col">
          <div className="mb-5 flex flex-col items-start justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <Link href="/">
                <div className="flex">
                  <div className="relative h-[20px] w-[20px] md:h-[24px] md:w-[24px]">
                    <Image fill src="/animehi.svg" alt="animehi" priority />
                  </div>
                  <span className="2xl:[30px] text-sm font-semibold uppercase md:text-[20px]">
                    nimeHi
                  </span>
                </div>
              </Link>
              <p className="mt-1 text-xs italic text-muted-foreground/70">
                This site does not store any files on our server, we only linked
                to the media which is hosted on 3rd party services.
              </p>
            </div>
            <nav className="" aria-label="others links">
              <ul>
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
          <Separator className="my-2" />

          <div className="xlitems-center mb-1 flex flex-col items-start justify-between xl:flex-row">
            <p className="text-xs text-muted-foreground/70 xl:text-sm">
              © 2023 animehi | Website Made by Benjo Quilario
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
