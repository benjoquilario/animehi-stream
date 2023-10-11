"use client"

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  MediaCaptions,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaOutlet,
  MediaPlayButton,
  MediaPlayer,
  MediaSliderThumbnail,
  MediaSliderValue,
  MediaTime,
  MediaTimeSlider,
  MediaTooltip,
  MediaVolumeSlider,
} from "@vidstack/react"
import { TextTrack, type MediaPlayerElement, isHLSProvider } from "vidstack"

import "vidstack/styles/defaults.css"
import { useEffect, useRef } from "react"

export default function Vidstack() {
  const playerRef = useRef(null)

  // useEffect(() => {
  //   playerRef?.current!.addEventListener("")
  // })

  return (
    <MediaPlayer
      aspectRatio={16 / 9}
      crossorigin={"anonymous"}
      // src={{
      //   src: src,
      //   type: "application/x-mpegurl",
      // }}
      ref={playerRef}
    >
      <MediaOutlet>
        <MediaCaptions />
      </MediaOutlet>
    </MediaPlayer>
  )
}
