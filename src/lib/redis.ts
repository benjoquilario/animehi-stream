import { Redis } from "ioredis"
import { RateLimiterRedis } from "rate-limiter-flexible"

function getRedisUrl() {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL
  }

  throw new Error("Redis URL is undefined")
}

let redis: any
let rateLimiterRedis: any
let rateLimitStrict: any

if (getRedisUrl()) {
  redis = new Redis(getRedisUrl())
  // Seems to be node related...

  // Listen to 'error' events to the Redis connection
  redis.on("error", (error: any) => {
    // @ts-ignore
    if (error.code === "ECONNRESET") {
      console.log("Connection to Redis Session Store timed out")
      // @ts-ignore
    } else if (error.code === "ECONNREFUSED") {
      console.log("Connection to Redis Session Store refused")
    } else console.log(error)
  })

  // Listen to 'reconnecting' event to Redis
  // @ts-ignore
  redis.on("reconnecting", (err) => {
    // @ts-ignore
    if (redis.status === "reconnecting")
      console.log("Reconnecting to Redis Session Store...")
    else console.log("Error reconnecting to Redis Session Store")
  })

  // Listen to the 'connect' event to Redis
  // @ts-ignore
  redis.on("connect", (err) => {
    if (!err) console.log("Connected to Redis Session Store")
  })

  const opt = {
    storeClient: redis,
    keyPrefix: "rateLimit",
    points: 50,
    duration: 1,
  }

  const optStrict = {
    storeClient: redis,
    keyPrefix: "rateLimitStrict",
    points: 20,
    duration: 1,
  }

  rateLimiterRedis = new RateLimiterRedis(opt)
  rateLimitStrict = new RateLimiterRedis(optStrict)
}

export { redis, rateLimiterRedis, rateLimitStrict }
