import { cn } from "@/lib/utils"
import React from "react"

type DisclosureProps = {
  children: React.ReactNode
  open: boolean
}

export default function Disclosure(props: DisclosureProps) {
  return (
    <div>
      <div
        className={cn(
          "absolute left-0 right-0 top-12 w-full space-x-2",
          !props.open && "hidden"
        )}
      >
        {props.children}
      </div>
    </div>
  )
}
