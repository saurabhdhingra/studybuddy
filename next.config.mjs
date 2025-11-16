/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
},
// For older Next.js versions or additional issues, you might also need this:
webpack: (config, { isServer }) => {
    if (isServer) {
        config.externals.push('pdf-parse');
    }
    return config;
},
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
