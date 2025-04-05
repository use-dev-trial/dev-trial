import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/challenges',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
