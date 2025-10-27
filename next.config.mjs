import path from "path";
import fs from "fs";

const nextConfig = {
  distDir: "dist",
  productionBrowserSourceMaps: process.env.NODE_ENV === "production",
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {},
  images: {
    formats: ['image/webp', 'image/png', 'image/jpeg'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/:path*',
      },
    ];
  },
  webpack: (config, options) => {
    config.devtool =
      process.env.NODE_ENV === "production" ? "source-map" : false;
    config.optimization = {
      ...config.optimization,
      minimize: false,
    };
    config.plugins = config.plugins || [];
    config.module = config.module || { rules: [] };
    config.module.rules = config.module.rules || [];

    const fileLoaderRule = config.module.rules.find(
      (rule) =>
        typeof rule === "object" &&
        rule !== null &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg"),
    );
    if (fileLoaderRule && typeof fileLoaderRule === "object") {
      fileLoaderRule.exclude = /\.svg$/i;
    }
    config.module.rules.push(
      {
        test: /\.svg$/i,
        resourceQuery: /url/,
        type: "asset/resource",
      },
      //      {
      //        test: /\.svg$/i,
      //        issuer: /\.[jt]sx?$/,
      //        resourceQuery: { not: [/url/] },
      //        use: ["@svgr/webpack"],
      //      }
    );

    return config;
  },
};

export default nextConfig;
