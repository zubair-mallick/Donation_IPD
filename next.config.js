/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: true, // ✅ Enable Server Actions for Clerk
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
