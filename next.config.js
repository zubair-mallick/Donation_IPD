/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: true, // ✅ Enable Server Actions for Clerk
  }, typescript: {
    ignoreBuildErrors: true, // Skips type checking during the build
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
