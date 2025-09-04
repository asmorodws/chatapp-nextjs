import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new ServerIO(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // Debug ping handler
      socket.on('ping', (data) => {
        console.log('Ping received from', socket.id, data)
        socket.emit('pong', { ...data, serverTime: Date.now() })
      })

      socket.on('join-room', async (roomId: string, userId: string) => {
        socket.join(roomId)
        console.log(`User ${userId} joined room ${roomId}`)
        
        // Cache user in Redis
        try {
          await redis.setEx(`user:${socket.id}`, 3600, JSON.stringify({ userId, roomId }))
        } catch (error) {
          console.error('Redis cache error:', error)
        }
        
        // Broadcast to room that user joined
        socket.to(roomId).emit('user-joined', { userId, socketId: socket.id })
      })

      socket.on('send-message', async (data: {
        roomId: string
        userId: string
        content: string
      }) => {
        try {
          // Save message to database
          const message = await prisma.message.create({
            data: {
              content: data.content,
              userId: data.userId,
              roomId: data.roomId
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

          // Cache message in Redis for quick access
          try {
            await redis.lPush(`room:${data.roomId}:messages`, JSON.stringify(message))
            await redis.lTrim(`room:${data.roomId}:messages`, 0, 100) // Keep only last 100 messages
          } catch (error) {
            console.error('Redis cache error:', error)
          }

          // Broadcast message to room
          io.to(data.roomId).emit('new-message', message)
        } catch (error) {
          console.error('Error sending message:', error)
          socket.emit('error', 'Failed to send message')
        }
      })

      socket.on('typing', (data: { roomId: string, userId: string, isTyping: boolean }) => {
        socket.to(data.roomId).emit('user-typing', data)
      })

      socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id)
        
        // Get user data from Redis
        try {
          const userData = await redis.get(`user:${socket.id}`)
          if (userData) {
            const { userId, roomId } = JSON.parse(userData)
            socket.to(roomId).emit('user-left', { userId, socketId: socket.id })
            await redis.del(`user:${socket.id}`)
          }
        } catch (error) {
          console.error('Redis cleanup error:', error)
        }
      })
    })
  }
  res.end()
}

export default SocketHandler
