"use client"
import { Button } from "./ui/button"
import { AiFillForward, AiFillBackward } from "react-icons/ai"

export default function Server() {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          Auto Next <span className="text-primary">Off</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm">
            <AiFillBackward className="h-5 w-5" />
            Prev episode
          </button>
          <button className="flex items-center gap-2 text-sm">
            Next episode
            <AiFillForward className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-primary px-5 py-3 text-center text-sm">
          You are watching
          <div className="font-semibold">Episode 1</div>
          If current server doesnt work please try other servers beside
        </div>
        <div className="flex-1">
          <div className="">
            <Button>Server 1</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
