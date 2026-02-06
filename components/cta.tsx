'use client'

import Link from 'next/link'

export default function CTA() {
  return (
    <section id="pricing" className="py-20 px-4 bg-foreground text-background border-b border-foreground/20">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-3xl sm:text-4xl font-mono font-black">Share Envs Securely, Free Forever</h2>
        
        <p className="text-sm font-mono opacity-80">
          No accounts. No storage. No permanent data. Just secure, temporary links that self-destruct.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/create" className="px-6 py-2.5 bg-background text-foreground text-xs font-mono font-bold hover:bg-background/90 transition-colors dither-pattern">
            CREATE LINK NOW
          </Link>
          <a href="#features" className="px-6 py-2.5 border border-background/50 text-background text-xs font-mono font-bold hover:border-background transition-colors">
            LEARN MORE
          </a>
        </div>

        <div className="pt-6 text-xs font-mono opacity-60 space-y-1">
          <p>✓ Completely free</p>
          <p>✓ No registration required</p>
          <p>✓ Data auto-deletes after expiration</p>
        </div>
      </div>
    </section>
  )
}
