import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-mono font-black">404</h1>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold">
            Link Not Found or Expired
          </h2>
          <p className="text-sm text-foreground/60 font-mono max-w-md mx-auto">
            This link has expired or does not exist. Links automatically expire after 2-5 minutes and all data is permanently deleted.
          </p>
          <div className="pt-4">
            <Link href="/create">
              <Button className="font-mono">
                Create New Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

