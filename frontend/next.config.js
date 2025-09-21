/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    return [
      {
        source: '/api/:path*',
        destination: apiUrl + '/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig