"use client"

import { useWatchStore } from "@/store"
import { Button } from "../ui/button"
import React, { useCallback } from "react"

const Sub = () => {
  const setSourceType = useWatchStore((store) => store.setSourceType)

  const handleChangeType = useCallback(
    (type: string) => {
      setSourceType(type)
    },
    [setSourceType]
  )

  return (
    <div className="flex items-center gap-2">
      <div className="">
        <Button
          onChange={() => handleChangeType("default")}
          size="sm"
          className="text-sm"
        >
          default
        </Button>
      </div>
      {/* <div className="">
        <Button
          onChange={() => handleChangeType("gogo")}
          size="sm"
          className="text-sm"
        >
          Gogo Server
        </Button>
      </div>
      <div className="">
        <Button
          onChange={() => handleChangeType("vidstreaming")}
          size="sm"
          className="text-sm"
        >
          Vidstreaming
        </Button>
      </div> */}
    </div>
  )
}

export default Sub
