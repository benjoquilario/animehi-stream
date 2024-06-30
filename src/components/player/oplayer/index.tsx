// "use client"

// import { type SourcesResponse, IAnilistInfo } from "types/types"
// import { AspectRatio } from "@/components/ui/aspect-ratio"
// import { useSession } from "next-auth/react"
// import { useWatchStore } from "@/store"
// import Episodes from "@/components/episode/episodes"
// import ButtonAction from "@/components/button-action"
// import RelationWatch from "@/components/watch/relation"
// import Comments from "@/components/comments/comments"
// import useVideoSource from "@/hooks/useVideoSource"
// import useEpisodes from "@/hooks/useEpisodes"
// import useLastPlayed from "@/hooks/useLastPlayed"
// import {
//   increment,
//   createViewCounter,
//   createWatchlist,
//   updateWatchlist,
// } from "@/server/anime"
// import { notFound, useRouter } from "next/navigation"
// import { useRef, useEffect, useMemo, useCallback } from "react"
// import VideoPlayer from "./player"
// import Server from "@/components/server"

// export type WatchProps = {
//   animeId: string
//   anilistId: string
//   currentUser: any
//   animeResponse: IAnilistInfo
// }

// const OPlayer = (props: WatchProps) => {
//   const { animeId, anilistId, animeResponse, currentUser } = props
//   const [lastEpisode, lastDuration, update] = useLastPlayed(anilistId)

//   const {
//     data: videoSource,
//     isLoading: videoSourceLoading,
//     isError: sourceError,
//   } = useVideoSource<SourcesResponse>(`${animeId}-episode-${lastEpisode}`)
//   const download = useMemo(() => videoSource?.download, [videoSource])

//   const sources = useMemo(
//     () => (!videoSource ? null : videoSource?.sources),
//     [videoSource]
//   )

//   console.log(sourceError, videoSource)

//   const { data: episodes, isLoading, isError } = useEpisodes(anilistId)

//   const currentEpisode = useMemo(
//     () => episodes?.find((episode) => episode.number === lastEpisode),
//     [episodes, lastEpisode]
//   )

//   const latestEpisodeNumber = useMemo(
//     () =>
//       episodes?.length !== 0
//         ? episodes?.length ??
//           animeResponse.currentEpisode ??
//           animeResponse.nextAiringEpisode.episode - 1
//         : 1,
//     [animeResponse, episodes]
//   )

//   return (
//     <>
//       {sourceError ? (
//         <AspectRatio ratio={16 / 9}>
//           <div className="flex h-full items-center justify-center text-3xl uppercase">
//             Source Not Found
//           </div>
//         </AspectRatio>
//       ) : (
//         <VideoPlayer
//           animeId={animeId}
//           anilistId={anilistId}
//           animeResponse={animeResponse}
//           currentUser={currentUser}
//           lastEpisode={lastEpisode}
//           latestEpisodeNumber={latestEpisodeNumber}
//           currentEpisode={currentEpisode}
//           videoSource={videoSource}
//           episodes={episodes}
//           sources={sources}
//           update={update}
//         />
//       )}

//       <Server
//         download={download ?? ""}
//         animeResult={animeResponse}
//         animeId={animeId}
//         anilistId={anilistId}
//         currentUser={currentUser}
//         lastEpisode={lastEpisode}
//       >
//         <ButtonAction
//           isLoading={isLoading}
//           latestEpisodeNumber={latestEpisodeNumber}
//           anilistId={anilistId}
//           update={update}
//           lastEpisode={lastEpisode}
//           animeTitle={animeId}
//         />
//       </Server>

//       {isError || episodes?.length === 0 ? (
//         <div className="mt-4">
//           <div>No Episodes found</div>
//         </div>
//       ) : (
//         <Episodes
//           episodes={episodes}
//           isLoading={isLoading}
//           update={update}
//           animeId={anilistId}
//           episodeId={`${animeId}-episode-${lastEpisode}`}
//           isWatch={true}
//           lastEpisode={lastEpisode}
//         />
//       )}

//       <RelationWatch relations={animeResponse.relations} />
//       {/* <Sharethis /> */}
//       <Comments
//         anilistId={anilistId}
//         animeId={animeId}
//         episodeNumber={`${lastEpisode}`}
//       />
//     </>
//   )
// }

// export default OPlayer
console.log("")
