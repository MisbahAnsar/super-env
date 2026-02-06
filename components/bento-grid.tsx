'use client'

export default function BentoGrid() {
  const cards = [
    {
      title: '2-5 Minute Expiration',
      description: 'Choose how long your link stays active. After expiration, data is permanently deleted.',
      icon: '⏱',
      size: 'lg'
    },
    {
      title: 'Password Protected',
      description: 'Secure access with custom or auto-generated passwords',
      icon: '🔒',
      size: 'sm'
    },
    {
      title: 'No Storage',
      description: 'Data never saved permanently',
      icon: '🗑',
      size: 'sm'
    },
    {
      title: 'Redis Upstash',
      description: 'Powered by Redis Upstash for fast, secure temporary storage',
      icon: '⚡',
      size: 'md'
    },
    {
      title: 'Hashed Security',
      description: 'All passwords are securely hashed before storage',
      icon: '🔐',
      size: 'md'
    },
    {
      title: 'One-Time Access',
      description: 'Share securely without permanent traces',
      icon: '🔑',
      size: 'sm'
    }
  ]

  return (
    <section id="features" className="py-16 px-4 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-mono font-black mb-3">Key Features</h2>
          <p className="text-sm text-foreground/60 font-mono">Secure environment variable sharing with automatic expiration</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-max">
          {cards.map((card, idx) => {
            const sizeClasses = {
              sm: 'sm:col-span-1 lg:col-span-1',
              md: 'sm:col-span-1 lg:col-span-2',
              lg: 'sm:col-span-2 lg:col-span-2 row-span-2'
            }

            return (
              <div
                key={idx}
                className={`
                  ${sizeClasses[card.size as keyof typeof sizeClasses]}
                  bg-white border border-foreground/20 p-4 group hover:border-foreground/40 
                  transition-all duration-200 relative overflow-hidden
                `}
              >
                {/* Dither background on hover */}
                <div className="absolute inset-0 dither-pattern opacity-0 group-hover:opacity-10 transition-opacity" />

                <div className="relative z-10">
                  <div className="text-2xl sm:text-3xl mb-3 font-mono opacity-40">{card.icon}</div>
                  <h3 className="text-xs sm:text-sm font-mono font-bold mb-1.5">{card.title}</h3>
                  <p className="text-xs text-foreground/60 font-mono leading-relaxed">{card.description}</p>

                  {/* Corner accents */}
                  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
