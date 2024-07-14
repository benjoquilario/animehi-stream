import captionStyles from "./captions.module.css"
import styles from "./video-layout.module.css"

import { Captions, Controls, Gesture, Spinner } from "@vidstack/react"

import * as Buttons from "../shared/buttons"
import * as Menus from "../shared/menus"
import * as Sliders from "../shared/sliders"
import { TimeGroup } from "../shared/time-group"
import { Title } from "../shared/title"

export interface VideoLayoutProps {
  thumbnails?: string
}

export function VideoLayout({ thumbnails }: VideoLayoutProps) {
  return (
    <>
      <Gestures />
      <Captions
        className={`${captionStyles.captions} absolute inset-0 bottom-2 z-10 select-none break-words opacity-0 transition-[opacity,bottom] duration-300 media-captions:opacity-100 media-controls:bottom-[85px] media-preview:opacity-0`}
      />
      <Controls.Root
        hideDelay={1000}
        className={`${styles.controls} absolute inset-0 z-10 flex h-full w-full flex-col bg-gradient-to-t from-black/30 via-transparent to-black/30 opacity-0 transition-opacity duration-200 media-controls:opacity-100 media-paused:bg-primary/10`}
      >
        <Controls.Group className="flex w-full items-center justify-between px-1 pt-1">
          <div className="flex w-full items-center justify-between sm:hidden">
            <div className="flex-1"></div>
            <div className="flex items-center sm:hidden">
              <Menus.Settings
                placement="left start"
                tooltipPlacement="left start"
              />
              <Buttons.Mute offset={10} tooltipPlacement="bottom" />
            </div>
          </div>
        </Controls.Group>
        <Controls.Group
          className={`absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-5 duration-200 ease-out sm:hidden`}
        >
          <div className="bg-black/65 rounded-full shadow backdrop-blur-lg sm:hidden">
            <Buttons.MobilePlayButton tooltipPlacement="top center" />
          </div>
        </Controls.Group>

        <Controls.Group
          className={`bg-black/65 absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 scale-[150%] rounded-full opacity-0 shadow backdrop-blur-lg duration-200 ease-out media-paused:scale-100 media-paused:opacity-100 sm:flex`}
        >
          <Buttons.DesktopPlayButton tooltipPlacement="top center" />
        </Controls.Group>

        {/* LOADING */}
        <div className="pointer-events-none absolute inset-0 z-[100] flex h-full w-full items-center justify-center">
          <Spinner.Root
            className="text-white opacity-0 transition-opacity duration-200 ease-linear media-buffering:animate-spin media-buffering:opacity-100"
            size={88}
          >
            <Spinner.Track className="opacity-25" width={8} />
            <Spinner.TrackFill className="opacity-75" width={8} />
          </Spinner.Root>
        </div>

        {/* Desktop Display */}
        <div className={styles.spacer} />
        <Controls.Group className={`${styles.controlsGroup} mb-[5px]`}>
          <Sliders.Time thumbnails={thumbnails} />
        </Controls.Group>
        <Controls.Group className={`${styles.controlsGroup} pb-[10px]`}>
          <Buttons.Play tooltipPlacement="top start" />
          <Buttons.Mute tooltipPlacement="top" />
          <Sliders.Volume />
          <TimeGroup />
          <Title />
          <div className={styles.spacer} />
          {/* <Buttons.Caption tooltipPlacement="top" /> */}
          <Menus.Settings placement="top end" tooltipPlacement="top end" />
          <Buttons.PIP tooltipPlacement="top" />
          <Buttons.Fullscreen tooltipPlacement="top end" />
        </Controls.Group>

        <Controls.Group className="z-20 mb-[-5px] flex w-full items-center px-1 sm:hidden">
          <div className="z-20 flex w-full items-center justify-between">
            <TimeGroup />
            <div className="flex">
              <Buttons.Fullscreen offset={10} tooltipPlacement="top end" />
            </div>
          </div>
        </Controls.Group>

        <Controls.Group className="z-20 mb-[10px] flex w-full items-center px-1 pb-1 sm:hidden ">
          <Sliders.Time thumbnails={thumbnails} />
        </Controls.Group>
      </Controls.Root>
    </>
  )
}

function Gestures() {
  return (
    <>
      <Gesture
        className={styles.gesture}
        event="pointerup"
        action="toggle:paused"
      />
      <Gesture
        className={styles.gesture}
        event="dblpointerup"
        action="toggle:fullscreen"
      />
      <Gesture
        className={styles.gesture}
        event="pointerup"
        action="toggle:controls"
      />
      <Gesture
        className={styles.gesture}
        event="dblpointerup"
        action="seek:-10"
      />
      <Gesture
        className={styles.gesture}
        event="dblpointerup"
        action="seek:10"
      />
    </>
  )
}
