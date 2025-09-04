'use client'

import { useState, useEffect, useRef } from 'react'
import { useSocket } from '@/hooks/useSocket'

interface Message {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    username: string
  }
}

interface ChatRoomProps {
  roomId: string
  userId: string
}

export default function ChatRoom({ roomId, userId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket) return

    // Join room
    socket.emit('join-room', roomId, userId)

    // Load existing messages
    fetch(`/api/rooms/${roomId}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(console.error)

    // Listen for new messages
    socket.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    // Listen for typing events
    socket.on('user-typing', (data: { userId: string, isTyping: boolean }) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          return prev.includes(data.userId) ? prev : [...prev, data.userId]
        } else {
          return prev.filter(id => id !== data.userId)
        }
      })
    })

    return () => {
      socket.off('new-message')
      socket.off('user-typing')
    }
  }, [socket, roomId, userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    socket.emit('send-message', {
      roomId,
      userId,
      content: newMessage.trim()
    })

    setNewMessage('')
    setIsTyping(false)
    socket.emit('typing', { roomId, userId, isTyping: false })
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    
    if (!socket) return

    if (!isTyping) {
      setIsTyping(true)
      socket.emit('typing', { roomId, userId, isTyping: true })
    }

    // Stop typing after 1 second of inactivity
    setTimeout(() => {
      setIsTyping(false)
      socket.emit('typing', { roomId, userId, isTyping: false })
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full max-h-full bg-white">
      {/* Connection status */}
      <div className={`p-3 text-sm font-medium transition-colors flex-shrink-0 ${
        isConnected 
          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
          : 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
      }`}>
        <div className="flex items-center justify-center">
          {isConnected ? (
            <>
              <span className="mr-2">🟢</span>
              <span>Connected & Ready</span>
            </>
          ) : (
            <>
              <span className="mr-2">🔴</span>
              <span>Connecting...</span>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-indigo-50/30 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.user.id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                message.user.id === userId
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              {message.user.id !== userId && (
                <div className="text-xs font-semibold mb-2 text-indigo-600">
                  👤 {message.user.username}
                </div>
              )}
              <div className="text-sm leading-relaxed">{message.content}</div>
              <div className={`text-xs mt-2 ${
                message.user.id === userId 
                  ? 'text-indigo-100' 
                  : 'text-gray-500'
              }`}>
                ⏰ {new Date(message.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600">
                ⌨️ {typingUsers.length === 1 
                  ? 'Someone is typing...'
                  : `${typingUsers.length} people are typing...`
                }
              </div>
            </div>
          </div>
        )}

        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-500 text-lg font-medium">No messages yet</p>
            <p className="text-gray-400 text-sm mt-2">Start the conversation!</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 bg-white shadow-sm flex-shrink-0">
        <form onSubmit={sendMessage} className="space-y-3">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 shadow-sm"
              disabled={!isConnected}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !isConnected}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-full text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🚀 Send
            </button>
          </div>
          <div className="text-xs text-gray-400 text-center">
            💡 Press Enter to send • Stay connected for real-time chat
          </div>
        </form>
      </div>
    </div>
  )
}
