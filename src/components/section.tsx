"use client"

import React from "react"
import { motion } from "framer-motion"
interface SectionProps {
  children: React.ReactNode
  className?: string
  sectionName: string
}

const Section: React.FC<SectionProps> = ({
  children,
  className,
  sectionName,
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      key={sectionName}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default Section
