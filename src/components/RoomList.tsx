'use client'

import { useState, useEffect } from 'react'

interface Room {
  id: string
  name: string
  createdAt: string
  _count: {
    members: number
    messages: number
  }
}

interface RoomListProps {
  onRoomSelect: (roomId: string) => void
  selectedRoomId?: string
}

export default function RoomList({ onRoomSelect, selectedRoomId }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newRoomName.trim() })
      })

      if (response.ok) {
        setNewRoomName('')
        fetchRooms()
      }
    } catch (error) {
      console.error('Error creating room:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
        <h2 className="text-lg font-bold text-white flex items-center">
          🏠 Chat Rooms
        </h2>
        <p className="text-indigo-100 text-sm mt-1">Join conversations</p>
      </div>

      {/* Create room form */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <form onSubmit={createRoom} className="space-y-3">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter room name..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={!newRoomName.trim() || isCreating}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
          >
            {isCreating ? '⏳ Creating...' : '➕ Create Room'}
          </button>
        </form>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`w-full p-4 text-left border-b border-gray-100 hover:bg-indigo-50 transition-colors ${
              selectedRoomId === room.id 
                ? 'bg-indigo-100 border-l-4 border-l-indigo-500 shadow-sm' 
                : 'hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-800 flex items-center">
                💬 {room.name}
              </div>
              {selectedRoomId === room.id && (
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              )}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              👥 {room._count.members} members • 💭 {room._count.messages} messages
            </div>
            <div className="text-xs text-gray-500">
              📅 Created {new Date(room.createdAt).toLocaleDateString()}
            </div>
          </button>
        ))}
        
        {rooms.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <div className="text-4xl mb-3">🏠</div>
            <p className="text-sm">No rooms yet.</p>
            <p className="text-xs text-gray-400 mt-1">Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
