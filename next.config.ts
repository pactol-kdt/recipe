import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname, // ✅ Force the correct project root
  },
};

// Wrap Next.js config with next-pwa
export default withPWA({
  ...nextConfig,
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // SW only in dev
});
