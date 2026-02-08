'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Github, Star } from 'lucide-react'

export default function Header() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    // Fetch GitHub stars
    const fetchStars = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/MisbahAnsar/super-env')
        if (response.ok) {
          const data = await response.json()
          setStars(data.stargazers_count)
        }
      } catch (error) {
        // Silently fail - stars are optional
        console.error('Failed to fetch GitHub stars:', error)
      }
    }

    fetchStars()
  }, [])

  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 logo-default-select">
            <div className="w-6 h-6 bg-foreground dither-pattern flex items-center justify-center text-2xl text-background font-mono font-bold">
              ◆
            </div>
            <span className="text-sm font-mono font-bold tracking-tighter">SUPER-ENV</span>
          </Link>

          {/* Right side - GitHub button with stars */}
          <div className="flex items-center gap-3">
            <Link 
              href="/create" 
              className="px-3 py-1.5 bg-foreground text-background text-xs font-mono font-bold hover:opacity-80 transition-opacity"
            >
              CREATE
            </Link>
            <a
              href="https://github.com/MisbahAnsar/super-env"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 border border-foreground/20 text-foreground text-xs font-mono font-bold hover:bg-foreground/5 transition-colors"
            >
              <Github className="size-4" />
              <span>GitHub</span>
              {stars !== null && (
                <span className="flex items-center gap-1 text-foreground/70">
                  <Star className="size-3 fill-current" />
                  {stars}
                </span>
              )}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
