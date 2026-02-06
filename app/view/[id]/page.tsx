import { notFound } from 'next/navigation'
import { redis } from '@/lib/redis'
import ViewPageClient from './page-client'

export default async function ViewPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  // Handle both Promise and direct params (Next.js 15+ uses Promise)
  const resolvedParams = params instanceof Promise ? await params : params
  const { id } = resolvedParams

  if (!id || id.trim() === '') {
    notFound()
  }

  let redisClient
  try {
    // Initialize redis client
    redisClient = redis()
  } catch (error) {
    // Redis initialization failed - show 404
    // Don't log in production to avoid exposing errors
    if (process.env.NODE_ENV === 'development') {
      console.error('Redis initialization error:', error)
    }
    notFound()
  }

  try {
    // Check if the link exists and hasn't expired
    const data = await redisClient.get(`env:${id}`)

    if (!data) {
      // Link expired or doesn't exist - show 404
      // This is expected behavior, notFound() will handle it
      notFound()
    }

    // Link exists, render the client component for password input
    return <ViewPageClient id={id} />
  } catch (error) {
    // Only log in development to reduce noise
    if (process.env.NODE_ENV === 'development') {
      console.error('Error checking link:', error)
    }
    // On error, show 404
    notFound()
  }
}

