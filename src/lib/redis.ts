import { Redis } from "@upstash/redis"

function getRedisUrl() {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    return process.env.UPSTASH_REDIS_REST_URL
  }

  throw new Error("Redis URL is undefined")
}

let redis: any

if (getRedisUrl()) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
  })
}

export { redis }
