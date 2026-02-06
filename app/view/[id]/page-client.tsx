'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Copy, Check } from 'lucide-react'

export default function ViewPageClient({ id }: { id: string }) {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [envs, setEnvs] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerifying(true)
    setError(null)

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          password,
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        setError('Server error. Please check your Redis configuration.')
        return
      }

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          // Link expired during verification - redirect to 404
          router.refresh()
          return
        }
        setError(data.error || 'Invalid password')
        return
      }

      setEnvs(data.envs)
    } catch (error) {
      console.error('Error verifying password:', error)
      setError('Failed to verify password. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-mono font-black mb-3">
            View Environment Variables
          </h1>
          <p className="text-sm text-foreground/60 font-mono">
            Enter the password to access the shared environment variables
          </p>
        </div>

        {envs ? (
          // Show envs if password was verified successfully
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono font-bold">
                  Environment Variables
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(envs)}
                  className="font-mono"
                >
                  {copied ? (
                    <>
                      <Check className="size-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={envs}
                readOnly
                className="min-h-64 font-mono text-xs"
              />
            </div>

            <div className="border border-yellow-500/50 bg-yellow-500/10 p-4 rounded-md">
              <p className="text-xs font-mono text-yellow-600 dark:text-yellow-400">
                ⚠️ This link will expire soon. The data will be permanently deleted.
              </p>
            </div>

            <Button
              onClick={() => router.push('/create')}
              variant="outline"
              className="w-full font-mono"
            >
              Create New Link
            </Button>
          </div>
        ) : (
          // Show password form
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-xs font-mono font-bold mb-2">
                Password
              </label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="font-mono"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="text-sm text-red-500 font-mono">{error}</div>
            )}

            <Button
              type="submit"
              disabled={verifying || !password.trim()}
              className="w-full font-mono"
            >
              {verifying ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'View Environment Variables'
              )}
            </Button>
          </form>
        )}
      </div>
      <Footer />
    </main>
  )
}

