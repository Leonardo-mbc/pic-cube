const webpack = require('webpack');

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
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.API_ENDPOINT': JSON.stringify(process.env.API_ENDPOINT),
      })
    );
    return config;
  },
};

module.exports = nextConfig;
