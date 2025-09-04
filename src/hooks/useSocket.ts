'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = io('http://localhost:3000', {
      path: '/api/socket',
      addTrailingSlash: false,
      transports: ['polling'], // Force polling untuk menghindari websocket issues dengan Next.js
      timeout: 10000,
      forceNew: true,
    })

    socketInstance.on('connect', () => {
      console.log('Connected to socket server')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.close()
    }
  }, [])

  return { socket, isConnected }
}
