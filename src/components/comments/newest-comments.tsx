import { getNewestComments } from "@/lib/metrics"
import React from "react"
import SwiperNewestComments from "./swiper-newest-comments"

export default async function NewestComments() {
  const newestComments = await getNewestComments()

  return <SwiperNewestComments newestComments={newestComments as any} />
}
