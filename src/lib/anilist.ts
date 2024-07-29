export async function queryAnilist(
  query: string,
  token: string,
  variables?: any
) {
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: variables,
    }),
  })

  const data = await response.json()
  return data
}
