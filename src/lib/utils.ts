import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Mappings, Source, SourcesResponse } from "types/types"
// dayjs converts a date to a dayjs object

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export const relativeDate = (
  date: string | number | Date | dayjs.Dayjs | null | undefined
): String => {
  return dayjs().to(date)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractUrl = (urlArray?: Source[]) => {
  const videoLink = urlArray?.find((src) => src.quality === "default")?.url
    ? urlArray?.find((src) => src.quality === "default")?.url
    : urlArray?.find((src) => src.quality === "auto")?.url

  return videoLink
}

export function chunk<T>(arr: Array<T>, chunkSize: number) {
  let R = []

  for (var i = 0; i < arr.length; i += chunkSize)
    R.push(arr.slice(i, i + chunkSize))

  return R
}

export function extractId(mappings: Mappings[]) {
  const gogoanime = mappings.find(
    (mapping) => mapping.providerId === "gogoanime"
  )

  if (gogoanime) {
    return `/watch/${gogoanime.id.replace("/category/", "")}`
  }

  return "/"
}

export function extractGogoId(episodeId: string) {
  const str = episodeId.slice(0, -1).replace("-episode-", "")

  return str
}

export function filterAnime(mappings: Mappings[]) {
  const gogoanime = mappings.filter(
    (mapping) => mapping.providerId === "gogoanime"
  )

  return gogoanime
}

export const stripHtml = (str?: string) => str?.replace(/<\/?\w*\\?>/gm, "")
