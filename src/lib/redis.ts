import { Redis } from "@upstash/redis"
import { env } from "@/env.mjs"

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL as string,
  token: env.UPSTASH_REDIS_REST_TOKEN as string,
})

export { redis }
