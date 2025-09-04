'use client'

import { useState } from 'react'

interface User {
  id: string
  username: string
  email: string
}

interface UserAuthProps {
  onUserLogin: (user: User) => void
}

export default function UserAuth({ onUserLogin }: UserAuthProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !email.trim()) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim()
        })
      })

      if (response.ok) {
        const user = await response.json()
        onUserLogin(user)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create user')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Error creating user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
          <div className="text-4xl mb-2">🔐</div>
          <h2 className="text-2xl font-bold text-white">Welcome to Chat</h2>
          <p className="text-indigo-100 text-sm mt-1">
            Create your account to get started
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4 rounded">
            <div className="flex">
              <div className="text-red-700 text-sm">⚠️ {error}</div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!username.trim() || !email.trim() || isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  ⏳ Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  ✨ Create Account
                </span>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-xs text-center mb-3">What you'll get:</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center text-gray-600">
                <span className="mr-2">💬</span>
                Real-time chat
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">👥</span>
                Multiple rooms
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">⚡</span>
                Instant messaging
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">🔒</span>
                Secure & private
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
