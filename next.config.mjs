/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      '/**': ['./prisma/dev.db'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'asbrandoils.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.lekhafoods.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lekhafoods.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
