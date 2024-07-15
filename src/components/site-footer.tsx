import { Separator } from "./ui/separator"
import Link from "next/link"
import Image from "next/image"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import ThemeToggle from "./theme-toggle"
import { getSeason } from "@/lib/utils"
import { permanentMarker } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export default function SiteFooter() {
  const currentSeason = getSeason()

  return (
    <>
      <footer className="mt-20 flex w-full flex-col border-t">
        {/* <Separator className="my-4" /> */}
        <div className="flex flex-col">
          <div className="mb-5 flex flex-col items-start justify-between gap-5 bg-background/80 px-[3%] pt-9 xl:flex-row xl:items-center">
            <div>
              <Link href="/" className="p-1">
                <div className="flex">
                  <div
                    className={cn(
                      permanentMarker.className,
                      "text-base font-bold uppercase md:text-3xl"
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
              <p className="mt-1 max-w-md text-xs italic text-muted-foreground">
                This site does not store any files on our server, we only linked
                to the media which is hosted on 3rd party services.
              </p>
            </div>
            <nav className="grid grid-cols-2 gap-3" aria-label="others links">
              <ul className="flex flex-col gap-3">
                <li className="text-muted-foreground hover:text-muted-foreground">
                  <Link href="/popular">This Season</Link>
                </li>
                <li className="text-muted-foreground hover:text-muted-foreground">
                  <Link href="/popular">Popular Anime</Link>
                </li>
                <li className="text-muted-foreground hover:text-muted-foreground">
                  <Link href="/popular">Donate</Link>
                </li>
                <li className="text-muted-foreground hover:text-muted-foreground">
                  <Link href="/popular">DMCA</Link>
                </li>
              </ul>

              <ul className="flex flex-col gap-3">
                <li className="text-muted-foreground hover:text-muted-foreground">
                  <Link href="/popular">About</Link>
                </li>
                <li className="text-muted-foreground hover:text-muted-foreground">
                  <Link href="/popular">Privacy & Tos</Link>
                </li>
                <li className="text-muted-foreground hover:text-muted-foreground">
                  <Link href="/popular">Github</Link>
                </li>
                <li className="text-muted-foreground hover:text-muted-foreground">
                  <Link href="/popular">Bug Report</Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mb-1 mt-3 flex flex-col items-start justify-between px-[3%] py-2 xl:flex-row xl:items-center">
            <p className="text-xs text-muted-foreground/70 xl:text-sm">
              © {currentSeason.year} animehi. Made by Benjo Quilario | All
              Rights Reserved.
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
