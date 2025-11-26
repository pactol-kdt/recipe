import type { NextConfig } from 'next';
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// Cast to sidestep the mismatched NextConfig type bundled in @types/next-pwa.
export default (withPWA as unknown as (config: NextConfig) => NextConfig)(nextConfig);
