/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@splinetool/react-spline'],
  i18n: {
    locales: ['tr', 'en'],
    defaultLocale: 'tr'
  },
  images: {
    domains: ['www.google.com', 'lh3.googleusercontent.com']
  }
};

module.exports = nextConfig;