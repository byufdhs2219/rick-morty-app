/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mengaktifkan image optimization dari domain Rick and Morty API
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
      },
    ],
    // Format yang lebih efisien
    formats: ['image/webp', 'image/avif'],
  },
  
  // Optimasi untuk LCP
  compress: true,
  
  // Enable SWC untuk faster compilation
  reactStrictMode: true,
}

module.exports = nextConfig
