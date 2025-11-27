import type { NextConfig } from 'next';
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Only apply PWA plugin for production builds to avoid duplicate GenerateSW runs in dev watch mode.
const config = (withPWA as unknown as (config: NextConfig) => NextConfig)(nextConfig);

export default config;
