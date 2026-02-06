import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

function generateRandomPassword(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function POST(request: NextRequest) {
  try {
    // Initialize redis client inside the handler
    const redisClient = redis()

    const body = await request.json()
    const { envs, password, expirationMinutes } = body

    if (!envs || typeof envs !== 'string') {
      return NextResponse.json(
        { error: 'Environment variables are required' },
        { status: 400 }
      )
    }

    if (expirationMinutes !== 2 && expirationMinutes !== 5) {
      return NextResponse.json(
        { error: 'Expiration must be 2 or 5 minutes' },
        { status: 400 }
      )
    }

    // Generate unique ID for the link
    const id = nanoid(12)

    // Handle password
    let hashedPassword: string | null = null
    let finalPassword: string | null = null

    if (password && password.trim() !== '') {
      // User provided password (4-8 digits)
      if (password.length < 4 || password.length > 8) {
        return NextResponse.json(
          { error: 'Password must be between 4 and 8 characters' },
          { status: 400 }
        )
      }
      // Hash the password
      hashedPassword = await bcrypt.hash(password, 10)
      finalPassword = password
    } else {
      // Generate random password (4-8 alphanumeric)
      const randomLength = Math.floor(Math.random() * 5) + 4 // 4-8
      finalPassword = generateRandomPassword(randomLength)
      hashedPassword = await bcrypt.hash(finalPassword, 10)
    }

    // Store envs and password hash in Redis with expiration
    const expirationSeconds = expirationMinutes * 60
    
    try {
      await redisClient.set(
        `env:${id}`,
        JSON.stringify({
          envs,
          passwordHash: hashedPassword,
        }),
        {
          ex: expirationSeconds,
        }
      )
    } catch (redisError) {
      console.error('Redis set error:', redisError)
      throw new Error(`Redis error: ${redisError instanceof Error ? redisError.message : 'Unknown error'}`)
    }

    return NextResponse.json({
      id,
      password: finalPassword,
      expirationMinutes,
      url: `${request.nextUrl.origin}/view/${id}`,
    })
  } catch (error) {
    console.error('Error creating env link:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isDev = process.env.NODE_ENV === 'development'
    
    // Check for permission errors and provide helpful message
    let userFriendlyError = errorMessage
    if (errorMessage.includes('NOPERM') || errorMessage.includes('permissions') || errorMessage.includes('permission')) {
      userFriendlyError = 'Redis permission error: Make sure you are using the REST API token (not the redis:// password). Get your REST API token from the Upstash dashboard under "REST API" section. The password in redis:// URL is different from the REST API token.'
    }
    
    return NextResponse.json(
      { 
        error: isDev 
          ? `Failed to create env link: ${userFriendlyError}` 
          : 'Failed to create env link. Please check your Redis configuration.',
        details: isDev ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

