/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Note: The "Environments: .env" message is Next.js's normal behavior
  // It indicates that environment variables are being loaded from .env file
  // This is expected and necessary for the app to work (Redis configuration)
  // Note: Source map warnings are from Turbopack and are non-critical
  // They don't affect functionality, just development experience
}

export default nextConfig
