import Link from "next/link"
import React from "react"

type DetailLinkProps = {
  animeId: string
  animeTitle: string
  episodeNumber: number
}

const DetailLinks = ({
  animeId,
  animeTitle,
  episodeNumber,
}: DetailLinkProps): JSX.Element => (
  <div className="mb-4 hidden w-full items-center gap-2 text-left text-xs text-white md:flex">
    <Link href="/">
      <a>Home</a>
    </Link>
    <span className={`inline-block h-1 w-1 rounded-full bg-white`}></span>
    <Link href={`/anime/${animeId}`}>
      <a className="normal-case">{animeTitle}</a>
    </Link>
    <span className={`inline-block h-1 w-1 rounded-full bg-white`}></span>
    <span>Episode {episodeNumber}</span>
  </div>
)

export default DetailLinks
