import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Initialize redis client inside the handler
    const redisClient = redis()

    // Handle both Promise and direct params (Next.js 15+ uses Promise)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      )
    }

    // Check if the link exists and hasn't expired
    const data = await redisClient.get(`env:${id}`)

    if (!data) {
      return NextResponse.json(
        { error: 'Link not found or expired' },
        { status: 404 }
      )
    }

    const parsedData = typeof data === 'string' ? JSON.parse(data) : data

    // Return that password is required (don't expose envs yet)
    return NextResponse.json({
      exists: true,
      requiresPassword: true,
    })
  } catch (error) {
    console.error('Error viewing env link:', error)
    return NextResponse.json(
      { error: 'Failed to view env link' },
      { status: 500 }
    )
  }
}

