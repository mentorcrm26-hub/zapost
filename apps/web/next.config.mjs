/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@zapost/contracts', '@zapost/tokens'],
}

export default nextConfig
