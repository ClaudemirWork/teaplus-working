/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignora erros de TypeScript durante build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora erros de ESLint durante build
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
