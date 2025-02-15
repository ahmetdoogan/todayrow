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
  
  // --- ŞURADAN İTİBAREN EKLEDİK ---
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn'] 
    }
  }
};

module.exports = nextConfig;
