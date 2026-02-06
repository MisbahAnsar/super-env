import { Redis } from '@upstash/redis'

let redis: Redis | null = null

function getRedisClient(): Redis {
  if (redis) {
    return redis
  }

  // Helper function to strip quotes from env variables
  const stripQuotes = (str: string | undefined): string => {
    if (!str) return ''
    return str.replace(/^["']|["']$/g, '').trim()
  }

  // Check for Upstash environment variables first (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN)
  // These are the standard Upstash environment variable names
  // Priority: UPSTASH_REDIS_REST_URL > REDIS_URL
  const upstashUrl = stripQuotes(process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL)
  // Priority: UPSTASH_REDIS_REST_TOKEN > REDIS_TOKEN
  const upstashToken = stripQuotes(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN || '')

  if (!upstashUrl) {
    throw new Error('REDIS_URL or UPSTASH_REDIS_REST_URL environment variable is not set. Please set one of these variables.')
  }

  // Upstash Redis REST API configuration
  // Supports multiple formats:
  // 1. UPSTASH_REDIS_REST_URL=https://xxx.upstash.io + UPSTASH_REDIS_REST_TOKEN=xxx (standard Upstash format)
  // 2. REDIS_URL=https://xxx.upstash.io + REDIS_TOKEN=xxx (custom format)
  // 3. REDIS_URL=redis://default:token@host:port (connection string format - will convert to REST API)
  let redisUrl = upstashUrl
  let redisToken = upstashToken

  // Try to parse if it's a redis:// URL format
  try {
    const url = new URL(upstashUrl)
    if (url.protocol === 'redis:') {
      // IMPORTANT: Do NOT use the password from redis:// URL for REST API
      // The redis:// password is for Redis protocol, not REST API
      // We only extract the hostname to convert to REST API URL format
      // The REST API token should come from REDIS_TOKEN or UPSTASH_REDIS_REST_TOKEN
      
      // Convert to REST API URL format (Upstash REST API uses https)
      // For Upstash, the REST endpoint is https://hostname (no port needed)
      redisUrl = `https://${url.hostname}`
    } else if (url.protocol === 'https:' || url.protocol === 'http:') {
      // Already in REST API format, use as is
      redisUrl = upstashUrl
    }
  } catch (e) {
    // If parsing fails, assume it's already in REST API format (https://...)
    // But check if it looks like a redis:// URL string
    if (upstashUrl.startsWith('redis://')) {
      // Try to extract hostname from redis:// URL
      const match = upstashUrl.match(/redis:\/\/(?:[^:]+:[^@]+@)?([^:]+)/)
      if (match && match[1]) {
        redisUrl = `https://${match[1]}`
      }
      // DO NOT extract token from redis:// URL - use REDIS_TOKEN instead
    }
  }

  // IMPORTANT: Never extract token from redis:// URL password field
  // The redis:// password is for Redis protocol authentication, not REST API
  // REST API requires a separate token from REDIS_TOKEN or UPSTASH_REDIS_REST_TOKEN

  if (!redisToken) {
    throw new Error(
      'REDIS_TOKEN or UPSTASH_REDIS_REST_TOKEN is required. ' +
      'Please set REDIS_TOKEN environment variable with your Upstash REST API token. ' +
      'Note: The password in redis:// URL is NOT the REST API token. ' +
      'You need to get the REST API token from your Upstash dashboard.'
    )
  }

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Redis] Final URL:', redisUrl)
    console.log('[Redis] Token present:', !!redisToken)
    console.log('[Redis] Token length:', redisToken.length)
    console.log('[Redis] Token starts with:', redisToken.substring(0, 5) + '...')
    console.log('[Redis] Using token from:', process.env.UPSTASH_REDIS_REST_TOKEN ? 'UPSTASH_REDIS_REST_TOKEN' : process.env.REDIS_TOKEN ? 'REDIS_TOKEN' : 'unknown')
  }

  try {
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })
  } catch (error) {
    console.error('[Redis] Failed to create client:', error)
    throw new Error(`Failed to initialize Redis client: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return redis
}

export { getRedisClient as redis }

