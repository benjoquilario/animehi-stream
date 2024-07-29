// export const runtime = "edge"

export async function GET(req: Request) {
  try {
    const authorization = req.headers.get("Authorization")

    if (!authorization) {
      return Response.json("Token is Required!", { status: 401 })
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
                }
              }
            `,
      }),
    })
    const data = await response.json()

    const { id, name, avatar } = data.data.Viewer

    return Response.json(
      {
        id: String(id),
        username: name,
        image_url: avatar.large,
        email: `${name}@gmail.com`,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return Response.json(error, { status: 500 })
  }
}
