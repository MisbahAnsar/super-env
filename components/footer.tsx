'use client'

import { Twitter, Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-foreground/50">
          <p>&copy; 2026 Super Env. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a 
              href="https://x.com/Misba8069" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="size-5" />
            </a>
            <a 
              href="https://github.com/MisbahAnsar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="size-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/misbah-ansari-52657428a/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-5" />
            </a>
            <a 
              href="mailto:misbaansari444@gmail.com"
              className="hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
