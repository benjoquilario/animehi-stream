"use client"

import React from "react"
import { motion } from "framer-motion"

type SectionProps = {
  children: React.ReactNode
  className?: string
  sectionName: string
}

export default function Section({
  children,
  className,
  sectionName,
}: SectionProps) {
  return (
    <motion.div
      key={sectionName}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
