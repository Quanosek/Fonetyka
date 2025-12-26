import withPWAInit from '@ducanh2912/next-pwa'
import type { NextConfig } from 'next'

// PWA config
const withPWA = withPWAInit({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
})

// Next.js config
const nextConfig: NextConfig = {
  devIndicators: false,
}

export default withPWA(nextConfig)
