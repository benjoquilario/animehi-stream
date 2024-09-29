"use client"

import React from "react"
import NextImage from "@/components/ui/image"
import { SiAnilist } from "react-icons/si"
import { Button } from "@/components/ui/button"
import { loginAnilist } from "@/server/auth"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const User = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (session) router.push(`/user/${session?.user?.name}/${session.user.id}`)

  const clickHandler = async (provider: string) => {
    try {
      const res = await loginAnilist(provider)

      if (res?.success) window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="relative flex flex-col px-[2%]">
      <div className="absolute -top-32 left-0 h-[240px] w-full bg-secondary/10"></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="mt-16 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <NextImage
                classnamecontainer="w-24 h-24 relative"
                fill
                src="/placeholder.png"
                className="rounded-full"
                alt=""
                style={{ objectFit: "cover" }}
              />

              <h2 className="-mt-3 text-2xl">Guest</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <SiAnilist />
                <span>Create At: </span>
              </div>
            </div>
          </div>
          <div className="max-h-14 overflow-hidden rounded-md bg-secondary/30 p-3">
            <span>Gues</span>
          </div>
          <div className="flex items-center justify-center gap-3 rounded-md bg-secondary/30 p-3 text-sm">
            <div className="flex flex-col items-center gap-1">
              <span className="text-primary">0</span>
              <span>Total Episodes</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-primary">0</span>
              <span>Total Anime</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-primary">0</span>
              <span>Days Watched</span>
            </div>
          </div>
          <div className="w-full space-y-3">
            <h4 className="text-left text-base md:text-2xl">Bookmark</h4>
            <div className="bg-secondary/30">
              <div className="flex justify-between p-3">
                <div>Title</div>
              </div>
            </div>
          </div>

          {/* <div>{session ? <ContinueWatching /> : null}</div> */}
        </div>
        <div className="mt-4 w-full space-y-3 md:mt-32">
          <h4 className="text-left text-base md:text-2xl">Guest</h4>
          <div className="bg-secondary/30">
            <div className="flex justify-between p-3">
              <div>Title</div>
              <span>Progress</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-3 py-8">
        <div>Sign in to keep track on your list.</div>
        <Button
          onClick={clickHandler.bind(null, "anilist")}
          variant="secondary"
        >
          <SiAnilist className="mr-1" /> Sign in with Anilist
        </Button>
      </div>
    </div>
  )
}

export default User
