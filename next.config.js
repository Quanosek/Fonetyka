// @ts-check

import withPWA from "next-pwa";

export default withPWA({
  // PWA settings
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  skipWaiting: true,
})({
  // Next.js settings
  reactStrictMode: true,
});
