"use client"

import { memo } from "react"
import { Input } from "./ui/input"

type SearchEpisodeProps = {
  onChange: (episode: string) => void
}

const SearchEpisode = ({ onChange }: SearchEpisodeProps) => {
  return (
    <Input
      type="number"
      placeholder="ep. number"
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default memo(SearchEpisode)
