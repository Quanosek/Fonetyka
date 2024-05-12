/** @type {import('next').NextConfig} */

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  // pwa options
  disable: process.env.NODE_ENV === "development",
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWA({
  // Next.js config
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60,
  },
});
