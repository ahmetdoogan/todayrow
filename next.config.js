/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@splinetool/react-spline'],
  i18n: {
    locales: ['tr', 'en'],
    defaultLocale: 'tr'
  }
};

module.exports = nextConfig;