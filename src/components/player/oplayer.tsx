"use client"

import type { Player, PlayerEvent, PlayerOptions } from "@oplayer/core"
import { isMobile, isIOS } from "@oplayer/core"
import hls from "@oplayer/hls"
import ReactPlayer from "@oplayer/react"
import ui from "@oplayer/ui"
import React, { useImperativeHandle, useMemo, useRef } from "react"

interface OPlayerProps extends PlayerOptions {
  playerIsPlaying?: boolean
  duration?: number
  autoplay?: boolean
  onEvent?: (event: PlayerEvent) => void
}

export type { PlayerEvent, Player }

export { isMobile }

const OPlayer = ({
  playerIsPlaying,
  duration,
  onEvent,
  autoplay,
  ...rest
}: OPlayerProps) => {
  const plugins = [
    ui({
      speeds: [],
      pictureInPicture: true,
      keyboard: { global: true },
      forceLandscapeOnFullscreen: true,
      subtitle: { background: true, shadow: "none" },
      theme: {
        controller: {
          header: {},
          slideToSeek: "always",
          displayBehavior: "delay",
        },
        progress: { position: isIOS ? "top" : "auto" },
      },
    }),
    hls({ forceHLS: true }),
  ]

  return (
    <ReactPlayer
      {...rest}
      plugins={plugins}
      onEvent={onEvent}
      autoplay={autoplay}
      duration={duration}
      playing={playerIsPlaying}
    />
  )
}

export default OPlayer
