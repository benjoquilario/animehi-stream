"use client"

import type { Popular } from "types/types"
import Column from "./column-card"
import { motion } from "framer-motion"

type PopularProps = {
  popularAnime?: Popular[]
}

export default function Popular({ popularAnime }: PopularProps) {
  return (
    <motion.div
      key="trending"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full pt-5 md:w-80"
    >
      <div className="block w-full">
        <h3 className="mb-2 pr-4 text-2xl font-semibold">Trending Anime</h3>
        <div className="bg-background">
          <ul className="">
            {popularAnime?.map((data, index) => (
              <Column
                key={data.id}
                data={data}
                rank={index + 1}
                className="pl-2"
              />
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
