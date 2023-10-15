import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const authorization = req.headers.get("Authorization")

    if (!authorization) {
      return NextResponse.json("Token is Required!", { status: 401 })
    }

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
                Viewer {
                  id
                  name
                  avatar {
                    large
                    medium
                  }
                  bannerImage
                }
              }
            `,
      }),
    })
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
