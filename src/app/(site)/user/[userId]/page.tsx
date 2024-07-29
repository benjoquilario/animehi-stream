import { auth } from "@/auth"
import { queryAnilist } from "@/lib/anilist"
import { profileQuery } from "@/lib/graphql"
import { accessToken } from "@/lib/metrics"
import { notFound } from "next/navigation"
import React from "react"

const Profile = async ({ params }: { params: { userId: string } }) => {
  const userId = params.userId

  if (!userId) notFound()
  const token = await accessToken()

  console.log(token)

  const profile = await queryAnilist(profileQuery, token!, {
    username: userId,
  })

  console.log(profile.data.MediaListCollection.lists)

  return <div>page</div>
}

export default Profile
