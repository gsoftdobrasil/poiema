/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true, // Necessário para static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Desabilitar middleware para static export
  // O middleware será usado apenas em desenvolvimento
  experimental: {
    middleware: false,
  },
};

module.exports = nextConfig;