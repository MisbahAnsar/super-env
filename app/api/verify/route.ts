import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Initialize redis client inside the handler
    const redisClient = redis()

    const body = await request.json()
    const { id, password } = body

    if (!id || !password) {
      return NextResponse.json(
        { error: 'ID and password are required' },
        { status: 400 }
      )
    }

    // Get the stored data
    const data = await redisClient.get(`env:${id}`)

    if (!data) {
      // Link expired or doesn't exist - return 404
      return NextResponse.json(
        { error: 'Link not found or expired' },
        { status: 404 }
      )
    }

    const parsedData = typeof data === 'string' ? JSON.parse(data) : data
    const { envs, passwordHash } = parsedData

    // Verify password
    const isValid = await bcrypt.compare(password, passwordHash)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Password is correct, return the envs
    return NextResponse.json({
      success: true,
      envs,
    })
  } catch (error) {
    console.error('Error verifying password:', error)
    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    )
  }
}

