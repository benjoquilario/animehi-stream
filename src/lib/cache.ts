function handleError(error: any, context: string) {
  let errorMessage = "An error occurred"

  if (error.message && error.message.includes("Access-Control-Allow-Origin")) {
    errorMessage = "A CORS error occurred"
  }

  switch (context) {
    case "data":
      errorMessage = "Error fetching data"
      break
    case "anime episodes":
      errorMessage = "Error fetching anime episodes"
      break
  }

  if (error.response) {
    const status = error.response.status
    if (status >= 500) {
      errorMessage += ": Server error"
    } else if (status >= 400) {
      errorMessage += ": Client error"
    }
    errorMessage += `: ${error.response.data.message || "Unknown error"}`
  } else if (error.message) {
    errorMessage += `: ${error.message}`
  }

  console.error(`${errorMessage}`, error)
  throw new Error(errorMessage)
}

function generateCacheKey(...args: string[]) {
  return args.join("-")
}

interface CacheItem {
  value: any // Replace 'any' with a more specific type if possible
  timestamp: number
}

function createOptimizedSessionStorageCache(
  maxSize: number,
  maxAge: number,
  cacheKey: string
) {
  const cache = new Map<string, CacheItem>(
    JSON.parse(sessionStorage.getItem(cacheKey) || "[]")
  )
  const keys = new Set<string>(cache.keys())

  function isItemExpired(item: CacheItem) {
    return Date.now() - item.timestamp > maxAge
  }

  function updateSessionStorage() {
    sessionStorage.setItem(
      cacheKey,
      JSON.stringify(Array.from(cache.entries()))
    )
  }

  return {
    get(key: string) {
      if (cache.has(key)) {
        const item = cache.get(key)
        if (!isItemExpired(item!)) {
          keys.delete(key)
          keys.add(key)
          return item!.value
        }
        cache.delete(key)
        keys.delete(key)
      }
      return undefined
    },
    set(key: string, value: any) {
      if (cache.size >= maxSize) {
        const oldestKey = keys.values().next().value
        cache.delete(oldestKey)
        keys.delete(oldestKey)
      }
      keys.add(key)
      cache.set(key, { value, timestamp: Date.now() })
      updateSessionStorage()
    },
  }
}

const CACHE_SIZE = 20
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const PROXY_URL = ""

function createCache(cacheKey: string) {
  return createOptimizedSessionStorageCache(CACHE_SIZE, CACHE_MAX_AGE, cacheKey)
}

async function fetchFromProxy(url: string, cache: any, cacheKey: string) {
  try {
    // Attempt to retrieve the cached response using the cacheKey
    const cachedResponse = cache.get(cacheKey)
    if (cachedResponse) {
      return cachedResponse // Return the cached response if available
    }

    // Adjust request parameters based on PROXY_URL's availability
    const requestConfig = PROXY_URL
      ? { params: { url } } // If PROXY_URL is defined, send the original URL as a parameter
      : {} // If PROXY_URL is not defined, make a direct request

    // Proceed with the network request
    const response = await fetch(PROXY_URL ? "" : url)

    const data = await response.json()

    // After obtaining the response, verify it for errors or empty data
    if (
      response.status !== 200 ||
      (data.statusCode && data.statusCode >= 400)
    ) {
      const errorMessage = data.message || "Unknown server error"
      throw new Error(
        `Server error: ${data.statusCode || response.status} ${errorMessage}`
      )
    }

    // Assuming response data  valid, store it in the cache
    cache.set(cacheKey, data)

    return data
  } catch (error) {
    handleError(error, "data")
    throw error
  }
}
