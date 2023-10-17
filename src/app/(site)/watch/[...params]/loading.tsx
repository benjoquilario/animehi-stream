"use client"
import React from "react"

import { ImSpinner8 } from "react-icons/im"

const Loading = () => {
  return (
    <div className="w-ful flex min-h-[calc(100vh-64px)] items-center justify-center px-[2%]">
      <div className="flex flex-col items-center justify-center">
        <ImSpinner8 className="h-10 w-10 animate-spin" />
        <p className="mt-2">Loading...</p>
      </div>
    </div>
  )
}

export default Loading
