import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET() {
  try {
    // Test Redis connection
    const pong = await redis.ping()
    
    // Test Redis set/get
    await redis.set('test-key', 'Hello Redis!')
    const value = await redis.get('test-key')
    
    return NextResponse.json({
      status: 'success',
      redis: {
        ping: pong,
        test: value,
        connected: redis.isOpen
      }
    })
  } catch (error) {
    console.error('Redis test error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      connected: redis.isOpen
    }, { status: 500 })
  }
}
