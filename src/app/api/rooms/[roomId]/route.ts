import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params

    // Try to get messages from Redis cache first
    const cachedMessages = await redis.lRange(`room:${roomId}:messages`, 0, 49)
    
    if (cachedMessages.length > 0) {
      const messages = cachedMessages.reverse().map(msg => JSON.parse(msg))
      return NextResponse.json(messages)
    }

    // If not in cache, get from database
    const messages = await prisma.message.findMany({
      where: {
        roomId: roomId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    // Cache messages in Redis
    if (messages.length > 0) {
      const messagesToCache = messages.reverse().map(msg => JSON.stringify(msg))
      for (const message of messagesToCache) {
        await redis.lPush(`room:${roomId}:messages`, message)
      }
      await redis.lTrim(`room:${roomId}:messages`, 0, 100)
    }

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if user is already a member
    const existingMember = await prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    })

    if (existingMember) {
      return NextResponse.json({ message: 'User already a member' })
    }

    // Add user to room
    const member = await prisma.roomMember.create({
      data: {
        userId,
        roomId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error joining room:', error)
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 })
  }
}
