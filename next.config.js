/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@splinetool/react-spline'],
  i18n: {
    locales: ['tr', 'en'],
    defaultLocale: 'tr'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ]
  },
  // AŞAĞIDAKİ KISMI EKLEYİN ⬇️
  terserOptions: {
    compress: {
      drop_console: true, // Tüm console.log'ları kaldırır (warn/error hariç)
    },
  },
};

module.exports = nextConfig;