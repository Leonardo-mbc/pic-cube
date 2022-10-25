const Dotenv = require('dotenv-webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/static/:path*',
        destination: 'http://localhost:8080/:path*',
      },
    ];
  },
  webpack: (config) => {
    config.plugins.push(new Dotenv());
    return config;
  },
};

module.exports = nextConfig;
