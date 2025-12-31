/** @type {import('next').NextConfig} */
const nextConfig = {
  // أضف هذه الإعدادات للسماح بالطلبات الخارجية
  images: {
    domains: ['engafi05-001-site1.stempurl.com'],
  },
  // هذا الجزء لن يحذف روابطك ولكنه سيعيد توجيهها داخلياً
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: 'http://engafi05-001-site1.stempurl.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;