import { Redis } from "@upstash/redis"

const fetch = async <T>(
  redis: Redis,
  key: string,
  fetcher: () => T,
  expires: number
) => {
  const existing = await get<T>(redis, key)

  if (existing) return existing

  return set(redis, key, fetcher, expires)
}

const get = async (redis: Redis, key: string) => {
  const value = await redis.get(key)

  if (!value) return null as any

  const stringifyResult = JSON.stringify(value)

  return stringifyResult
}

const set = async <T>(
  redis: Redis,
  key: string,
  fetcher: () => T,
  expires: number
) => {
  const value = await fetcher()
  const stringifyResult = JSON.stringify(value)

  await redis.setex(key, expires, stringifyResult)

  return value
}

const del = async (redis: Redis, key: string) => {
  await redis.del(key)
}

export { fetch, set, get, del }
