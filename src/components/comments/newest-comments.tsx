import { getNewestComments } from "@/lib/metrics"
import React from "react"
import SwiperNewestComments from "./swiper-newest-comments"
import Section from "../section"

export default async function NewestComments() {
  const newestComments = await getNewestComments()

  // console.log(newestComments)
  return (
    <Section sectionName="newest-comments" className="relative">
      <div className="flex pt-4">
        <SwiperNewestComments newestComments={newestComments as any} />
      </div>
    </Section>
  )
}
