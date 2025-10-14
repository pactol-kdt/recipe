/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname, // ✅ Force the correct project root
  },
};

export default nextConfig;
