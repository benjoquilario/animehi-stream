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

export const transformedTitle = (title: string) =>
  title
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .join("-")
    .toLowerCase()

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

export const getSeason = () => {
  const month = dayjs().month()
  const year = dayjs().year()

  let season = "WINTER"

  if (3 <= month && month <= 5) {
    season = "SPRING"
  }

  if (6 <= month && month <= 8) {
    season = "SUMMER"
  }

  if (9 < month && month <= 11) {
    season = "FALL"
  }

  return {
    season,
    year,
  }
}

export const toBase64 = (str: string) => Buffer.from(str).toString("base64")

export const solidImage = (color: string) => `
  <svg width="1" height="1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect width="1" height="1" style="fill:${color};stroke-width:3;stroke:${color}" />
  </svg>
`

export const base64SolidImage = (color: string) => toBase64(solidImage(color))
