'use client'

import { useState } from 'react'
import UserAuth from '@/components/UserAuth'
import RoomList from '@/components/RoomList'
import ChatRoom from '@/components/ChatRoom'

interface User {
  id: string
  username: string
  email: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  const handleUserLogin = (user: User) => {
    setUser(user)
  }

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId)
  }

  const handleLogout = () => {
    setUser(null)
    setSelectedRoomId(null)
  }

  if (!user) {
    return <UserAuth onUserLogin={handleUserLogin} />
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar with room list */}
      <RoomList 
        onRoomSelect={handleRoomSelect} 
        selectedRoomId={selectedRoomId || undefined}
      />
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {selectedRoomId ? '💬 Chat Room' : '🚀 Realtime Chat App'}
            </h1>
            <p className="text-sm text-gray-600">
              Welcome, <span className="font-medium text-indigo-600">{user.username}</span>!
            </p>
          </div>
          <div className="flex space-x-2">
            <a
              href="/debug"
              target="_blank"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              🔧 Debug
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              👋 Logout
            </button>
          </div>
        </div>
        
        {/* Chat content */}
        <div className="flex-1 min-h-0">
          {selectedRoomId ? (
            <ChatRoom 
              roomId={selectedRoomId}
              userId={user.id}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-3">
                  Welcome to Realtime Chat
                </h2>
                <p className="text-gray-600 mb-6">
                  Connect with others in real-time! Select a room from the sidebar to start chatting or create a new one.
                </p>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2">✨ Features:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🔄 Real-time messaging</li>
                    <li>⌨️ Typing indicators</li>
                    <li>👥 Multiple chat rooms</li>
                    <li>📱 Responsive design</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
