import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test Socket.IO endpoint
    const response = await fetch('http://localhost:3000/api/socket', {
      method: 'GET',
    })
    
    return NextResponse.json({
      status: 'success',
      socket: {
        endpoint: '/api/socket',
        responseStatus: response.status,
        message: 'Socket.IO endpoint is accessible'
      }
    })
  } catch (error) {
    console.error('Socket test error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
