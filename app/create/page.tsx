'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copy, Check, Loader2 } from 'lucide-react'

export default function CreatePage() {
  const router = useRouter()
  const [envs, setEnvs] = useState('')
  const [password, setPassword] = useState('')
  const [expirationMinutes, setExpirationMinutes] = useState<2 | 5>(2)
  const [loading, setLoading] = useState(false)
  const [createdLink, setCreatedLink] = useState<{ url: string; password: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          envs,
          password: password.trim() || undefined,
          expirationMinutes,
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        alert('Server error. Please check your Redis configuration.')
        return
      }

      const data = await response.json()

      if (!response.ok) {
        // Show detailed error in development, generic in production
        const errorMsg = data.error || 'Failed to create link'
        const details = data.details ? `\n\nDetails: ${data.details}` : ''
        alert(errorMsg + details)
        console.error('API Error:', data)
        return
      }

      setCreatedLink({
        url: data.url,
        password: data.password,
      })
    } catch (error) {
      console.error('Error creating link:', error)
      alert('Failed to create link. Please check your Redis configuration and try again.')
    } finally {
      setLoading(false)
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
            Create Secure Env Link
          </h1>
          <p className="text-sm text-foreground/60 font-mono">
            Share your environment variables securely. Links expire in 2-5 minutes and are automatically deleted.
          </p>
        </div>

        {!createdLink ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono font-bold mb-2">
                Environment Variables
              </label>
              <Textarea
                value={envs}
                onChange={(e) => setEnvs(e.target.value)}
                placeholder="DATABASE_URL=postgresql://...&#10;API_KEY=sk-...&#10;SECRET_KEY=..."
                className="min-h-48 font-mono text-xs"
                required
              />
              <p className="text-xs text-foreground/50 font-mono mt-2">
                Paste your environment variables here (one per line)
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold mb-2">
                Password (Optional)
              </label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="4-8 characters (leave empty for auto-generated)"
                className="font-mono"
                maxLength={8}
              />
              <p className="text-xs text-foreground/50 font-mono mt-2">
                Set a custom password or leave empty to generate one automatically
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold mb-2">
                Expiration Time
              </label>
              <Select
                value={expirationMinutes.toString()}
                onValueChange={(value) => setExpirationMinutes(parseInt(value) as 2 | 5)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading || !envs.trim()}
              className="w-full font-mono"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Secure Link'
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-6 border border-foreground/20 p-6 rounded-md">
            <div>
              <h2 className="text-lg font-mono font-bold mb-4">Link Created Successfully!</h2>
              <p className="text-xs text-foreground/60 font-mono mb-4">
                Your link will expire in {expirationMinutes} minutes. Share it securely.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold mb-2">
                Share Link
              </label>
              <div className="flex gap-2">
                <Input
                  value={createdLink.url}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(createdLink.url)}
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold mb-2">
                Password (Required to access)
              </label>
              <div className="flex gap-2">
                <Input
                  value={createdLink.password}
                  readOnly
                  className="font-mono text-xs font-bold"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(createdLink.password)}
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-foreground/50 font-mono mt-2 text-red-500">
                ⚠️ Save this password! It won't be shown again.
              </p>
            </div>

            <Button
              onClick={() => {
                setCreatedLink(null)
                setEnvs('')
                setPassword('')
              }}
              variant="outline"
              className="w-full font-mono"
            >
              Create Another Link
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

