"use client"

import { RecentEpisode } from "types/types"
import Sharethis from "./sharethis"
import { motion } from "framer-motion"

type RecentEpisodesProps = {
  recentEpisodes?: RecentEpisode[]
}

import EpisodeCard from "./episode-card"

const RecentEpisodes = ({ recentEpisodes }: RecentEpisodesProps) => {
  return (
    <div className="flex-1">
      <div className="mt-4 flex flex-col items-start rounded-md py-2">
        <p className="mb-2 pl-3 text-xs text-muted-foreground/90">
          Please help us by sharing the site to your friends
        </p>
        <Sharethis />
      </div>
      <h3 className="w-full pb-6 pt-2.5 text-left text-2xl font-semibold">
        Recently Updated
      </h3>
      <motion.div
        key="recent"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <ul className="relative grid grid-cols-3 gap-3 overflow-hidden md:grid-cols-4 lg:grid-cols-6">
          {recentEpisodes?.map((data) => (
            <li
              key={data.episodeId}
              className="col-span-1 overflow-hidden rounded-md"
            >
              <EpisodeCard data={data} />
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}

export default RecentEpisodes
