"use client"
//github.com/Miruro-no-kuon/Miruro/blob/main/src/components/Navigation/SearchFilters.tsx

import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type Options = {
  value: string
  label: string
}

type SelectFilterProps = {
  label: string
  options?: Options[]
  onChange?: (value: any) => void
  value?: any
  isMulti?: boolean
  className?: string
}

const SelectFilter = (props: SelectFilterProps) => {
  const { label, options, onChange, value, isMulti, className } = props

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent
        ref={(ref) =>
          ref?.addEventListener("touchend", (e) => e.preventDefault())
        }
      >
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectFilter
