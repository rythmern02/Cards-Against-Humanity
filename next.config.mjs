/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'www.cardsagainsthumanity.fun', 'cardsagainsthumanity.fun'],
    },
  },
}

export default nextConfig;