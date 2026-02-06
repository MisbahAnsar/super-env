import Header from '@/components/header'
import Hero from '@/components/hero'
import BentoGrid from '@/components/bento-grid'
import Features from '@/components/features'
import CTA from '@/components/cta'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <BentoGrid />
      <Features />
      <CTA />
      <Footer />
    </main>
  )
}
