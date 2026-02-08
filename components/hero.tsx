'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Hero() {
  const [displayCode, setDisplayCode] = useState('')
  const codeLines = [
    '> env.generate_link()',
    '> password.hash()',
    '> redis.store(ttl=300)',
    '> link.expires()',
    '> data.deleted() ✓'
  ]

  useEffect(() => {
    let currentLine = 0
    let currentChar = 0
    const interval = setInterval(() => {
      if (currentLine < codeLines.length) {
        const line = codeLines[currentLine]
        if (currentChar < line.length) {
          setDisplayCode(prev => prev + line[currentChar])
          currentChar++
        } else {
          setDisplayCode(prev => prev + '\n')
          currentLine++
          currentChar = 0
        }
      } else {
        currentLine = 0
        currentChar = 0
        setDisplayCode('')
      }
    }, 40)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background border-b border-border">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12">
        {/* Left side - Text */}
        <div className="flex-1 space-y-6">
          <div className="inline-block px-2 py-1 bg-foreground text-background text-xs font-mono font-bold">
            SECURE ENV SHARING
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-mono font-black leading-tight text-foreground">
            Share Envs That Self-Destruct
          </h1>
          
          <p className="text-sm text-foreground/70 font-mono max-w-md leading-relaxed">
            Instead of sharing envs on social platforms, generate a secure link that expires in 2-5 minutes. After that, all data is permanently deleted.
          </p>

          <div className="flex gap-3 pt-2">
            <Link href="/create" className="px-4 py-2 bg-foreground text-background text-xs font-mono font-bold hover:opacity-80 transition-opacity dither-pattern">
              GET STARTED
            </Link>
            <a href="#features" className="px-4 py-2 border border-foreground text-foreground text-xs font-mono font-bold hover:bg-foreground/5 transition-colors">
              LEARN MORE
            </a>
          </div>
        </div>

        {/* Right side - Animated code terminal */}
        <div className="flex-1 relative">
          <div className="bg-foreground/95 text-background p-3 font-mono text-xs leading-6 overflow-hidden dither-pattern scan-lines min-h-64">
            <div className="text-green-400/70 font-bold mb-2">&gt; super-env v1.0.0</div>
            <div className="text-white/70 mb-3">{"[ACTIVE] Generating secure link..."}</div>
            <code className="whitespace-pre-wrap break-words text-green-400/60">
              {displayCode}
              <span className="animate-pulse">_</span>
            </code>
          </div>
          
          {/* Accent lines */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-foreground opacity-40"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-foreground opacity-40"></div>
        </div>
      </div>
    </section>
  )
}
