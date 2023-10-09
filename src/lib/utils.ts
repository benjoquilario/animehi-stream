import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Source, SourcesResponse } from "types/types"

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
