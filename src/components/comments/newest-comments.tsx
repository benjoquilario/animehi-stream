import { getNewestComments } from "@/lib/metrics"
import React from "react"
import SwiperNewestComments from "./swiper-newest-comments"

const NewestComments = async () => {
  const newestComments = await getNewestComments()

  return <SwiperNewestComments newestComments={newestComments as any} />
}

export default NewestComments
