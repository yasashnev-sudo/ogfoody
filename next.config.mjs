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
    // Отключаем кеширование API запросов - все данные из БД должны быть свежими
    runtimeCaching: [
      {
        urlPattern: /^\/api\//,
        handler: 'NetworkOnly', // Всегда идем в сеть, не кешируем
        options: {
          cacheName: 'api-network-only',
          cacheableResponse: {
            statuses: [], // Не кешируем даже успешные ответы
          },
        },
      },
      // Кешируем только статические ресурсы (изображения, шрифты и т.д.)
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|otf)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
          },
        },
      },
    ],
  },
})

export default pwaConfig(nextConfig)
