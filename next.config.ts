/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/remote/:path*',
        destination: 'http://engafi05-001-site1.stempurl.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;