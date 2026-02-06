'use client'

export default function Features() {
  const features = [
    {
      number: '01',
      title: 'Temporary Links',
      description: 'Generate secure links that expire in 2-5 minutes. Choose your expiration time when creating the link.'
    },
    {
      number: '02',
      title: 'Password Protection',
      description: 'Set a custom password (4-8 characters) or use an auto-generated one. All passwords are securely hashed.'
    },
    {
      number: '03',
      title: 'Auto-Deletion',
      description: 'After expiration, all data is permanently deleted from Redis. Nothing is saved or stored permanently.'
    },
    {
      number: '04',
      title: 'Secure Storage',
      description: 'Environment variables are stored as hashed data in Redis Upstash, accessible only with the correct password.'
    }
  ]

  return (
    <section id="security" className="py-16 px-4 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-mono font-black">How It Works</h2>
        </div>

        <div className="space-y-6">
          {features.map((feature, idx) => (
            <div key={idx} className="border-b border-border/50 pb-6 last:border-b-0 group">
              <div className="flex gap-4 sm:gap-8">
                <div className="text-2xl sm:text-3xl font-mono font-black text-foreground/30 group-hover:text-foreground/50 transition-colors min-w-12">
                  {feature.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-mono font-bold mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-foreground/60 font-mono">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
