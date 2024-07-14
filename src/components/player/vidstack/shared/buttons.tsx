import {
  CaptionButton,
  FullscreenButton,
  isTrackCaptionKind,
  MuteButton,
  PIPButton,
  PlayButton,
  Tooltip,
  useMediaState,
  type TooltipPlacement,
} from "@vidstack/react"
import {
  ClosedCaptionsIcon,
  ClosedCaptionsOnIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureExitIcon,
  PictureInPictureIcon,
  PlayIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  ReplayIcon,
} from "@vidstack/react/icons"

export interface MediaButtonProps {
  tooltipPlacement: TooltipPlacement
  offset?: number
}

export const buttonClass =
  "group ring-media-focus relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4"

export const tooltipClass =
  "animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white parent-data-[open]:hidden"

export function Play({ tooltipPlacement }: MediaButtonProps) {
  const isPaused = useMediaState("paused")
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className={buttonClass}>
          {isPaused ? (
            <PlayIcon className="h-8 w-8" />
          ) : (
            <PauseIcon className="h-8 w-8" />
          )}
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isPaused ? "Play" : "Pause"}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export function Mute({ tooltipPlacement }: MediaButtonProps) {
  const volume = useMediaState("volume"),
    isMuted = useMediaState("muted")
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <MuteButton className={buttonClass}>
          {isMuted || volume == 0 ? (
            <MuteIcon className="h-8 w-8" />
          ) : volume < 0.5 ? (
            <VolumeLowIcon className="h-8 w-8" />
          ) : (
            <VolumeHighIcon className="h-8 w-8" />
          )}
        </MuteButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isMuted ? "Unmute" : "Mute"}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export function Caption({ tooltipPlacement }: MediaButtonProps) {
  const track = useMediaState("textTrack"),
    isOn = track && isTrackCaptionKind(track)
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <CaptionButton className={buttonClass}>
          {isOn ? (
            <ClosedCaptionsOnIcon className="h-8 w-8" />
          ) : (
            <ClosedCaptionsIcon className="h-8 w-8" />
          )}
        </CaptionButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isOn ? "Closed-Captions Off" : "Closed-Captions On"}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export function PIP({ tooltipPlacement }: MediaButtonProps) {
  const isActive = useMediaState("pictureInPicture")
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className={buttonClass}>
          {isActive ? (
            <PictureInPictureExitIcon className="h-8 w-8" />
          ) : (
            <PictureInPictureIcon className="h-8 w-8" />
          )}
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isActive ? "Exit PIP" : "Enter PIP"}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export function Fullscreen({ tooltipPlacement, offset }: MediaButtonProps) {
  const isActive = useMediaState("fullscreen")
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <FullscreenButton className={buttonClass}>
          {isActive ? (
            <FullscreenExitIcon className="h-8 w-8" />
          ) : (
            <FullscreenIcon className="h-8 w-8" />
          )}
        </FullscreenButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={tooltipClass}
        placement={tooltipPlacement}
      >
        {isActive ? "Exit Fullscreen" : "Enter Fullscreen"}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export function MobilePlayButton({ tooltipPlacement }: MediaButtonProps) {
  const isPaused = useMediaState("paused"),
    ended = useMediaState("ended"),
    Icon = ended ? ReplayIcon : isPaused ? PlayIcon : PauseIcon
  return (
    <PlayButton
      className={` ring-media-focus group relative inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full outline-none`}
    >
      <Icon className="h-8 w-8" />
    </PlayButton>
  )
}

export function DesktopPlayButton({ tooltipPlacement }: MediaButtonProps) {
  const isPaused = useMediaState("paused"),
    ended = useMediaState("ended"),
    Icon = ended ? ReplayIcon : isPaused ? PlayIcon : PauseIcon
  return (
    <PlayButton
      className={`ring-media-focus group relative inline-flex h-16 w-16 cursor-default items-center justify-center rounded-full outline-none media-paused:cursor-pointer`}
    >
      <Icon className="h-10 w-10" />
    </PlayButton>
  )
}
