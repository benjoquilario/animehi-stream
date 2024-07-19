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
    <div key={sectionName} className={className}>
      {children}
    </div>
  )
}
