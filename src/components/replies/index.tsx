"use client"

import React from "react"
import { motion } from "framer-motion"
import { variants } from "@/lib/variants"
import CreateReplyComment from "./create-replies"

type RepliesProps = {
  commentId: string
}

const Replies = (props: RepliesProps) => {
  const { commentId } = props

  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate="visible"
      exit="hidden"
      className="relative rounded"
    >
      <CreateReplyComment commentId={commentId} />
    </motion.div>
  )
}

export default Replies
