'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export default function DebugSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connectionStatus, setConnectionStatus] = useState('Initializing...')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev.slice(-10), `[${timestamp}] ${message}`])
  }

  useEffect(() => {
    addLog('Creating socket connection...')
    
    const socketInstance = io('http://localhost:3000', {
      path: '/api/socket',
      addTrailingSlash: false,
      transports: ['polling'], // Force polling untuk menghindari websocket issues
      timeout: 10000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })

    socketInstance.on('connect', () => {
      addLog('✅ Connected to Socket.IO server')
      setConnectionStatus('Connected')
    })

    socketInstance.on('disconnect', (reason) => {
      addLog(`❌ Disconnected: ${reason}`)
      setConnectionStatus(`Disconnected (${reason})`)
    })

    socketInstance.on('connect_error', (error) => {
      addLog(`⚠️ Connection Error: ${error.message}`)
      setConnectionStatus(`Error: ${error.message}`)
    })

    socketInstance.on('reconnect', () => {
      addLog('🔄 Reconnected')
      setConnectionStatus('Reconnected')
    })

    socketInstance.on('reconnect_error', (error) => {
      addLog(`🔄❌ Reconnect Error: ${error.message}`)
    })

    socketInstance.on('pong', (data) => {
      addLog(`🏓 Pong received: ${JSON.stringify(data)}`)
    })

    setSocket(socketInstance)

    return () => {
      addLog('Cleaning up socket connection...')
      socketInstance.close()
    }
  }, [])

  const testConnection = () => {
    if (socket) {
      addLog('Testing connection...')
      socket.emit('ping', { timestamp: Date.now() })
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Socket.IO Debug Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Panel */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Connection Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-mono ${
                  connectionStatus.includes('Connected') ? 'text-green-600' : 
                  connectionStatus.includes('Error') || connectionStatus.includes('Disconnected') ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  {connectionStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Socket ID:</span>
                <span className="font-mono">{socket?.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Connected:</span>
                <span className="font-mono">{socket?.connected ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport:</span>
                <span className="font-mono">{socket?.io.engine.transport.name || 'N/A'}</span>
              </div>
            </div>
            
            <button 
              onClick={testConnection}
              disabled={!socket?.connected}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              Test Connection
            </button>
          </div>

          {/* Configuration Panel */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Configuration</h2>
            <div className="space-y-2 text-sm">
              <div><strong>URL:</strong> http://localhost:3000</div>
              <div><strong>Path:</strong> /api/socket</div>
              <div><strong>Transports:</strong> polling (forced)</div>
              <div><strong>Timeout:</strong> 10000ms</div>
              <div><strong>Force New:</strong> true</div>
            </div>
          </div>

          {/* Logs Panel */}
          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Connection Logs</h2>
            <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
              {logs.length === 0 && <div>No logs yet...</div>}
            </div>
            <button 
              onClick={() => setLogs([])}
              className="mt-2 bg-gray-500 text-white py-1 px-3 rounded text-sm hover:bg-gray-600"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
