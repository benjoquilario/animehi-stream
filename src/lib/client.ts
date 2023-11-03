import { publicUrl } from "./consumet"

export const getComments = async ({
  pageParam,
  episodeId,
}: {
  pageParam: string
  episodeId: string
}) => {
  const res = await fetch(
    `${publicUrl}/api/comments/${episodeId}?cursor=${pageParam}`
  )

  return await res.json()
}
