import withPWA from '@ducanh2912/next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Добавляем пустую конфигурацию Turbopack для совместимости
  turbopack: {},
}

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
})

export default pwaConfig(nextConfig)
