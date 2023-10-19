import { getContinueWatching } from "@/lib/metrics"

export default async function ContinueWatching() {
  const results = await getContinueWatching()

  return (
    <div>
      {results?.map((result) => <div className="">{result.animeId}</div>)}
    </div>
  )
}
