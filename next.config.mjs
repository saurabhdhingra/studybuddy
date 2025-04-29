/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Add any remote image patterns if needed
    ],
  },
  // Modern optimization features
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
