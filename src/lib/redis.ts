import { createClient } from 'redis'

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined
}

export const redis = globalForRedis.redis ?? createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

// Initialize Redis connection
const connectRedis = async () => {
  if (!redis.isOpen) {
    try {
      await redis.connect()
      console.log('Redis connected successfully')
    } catch (error) {
      console.error('Redis connection error:', error)
    }
  }
}

connectRedis()
