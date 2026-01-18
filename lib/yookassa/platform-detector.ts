// Определение платформы для выбора метода оплаты

export type Platform = 'telegram' | 'vk' | 'browser' | 'pwa'

export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'browser'
  
  // Telegram Web App
  if ((window as any).Telegram?.WebApp) {
    return 'telegram'
  }
  
  // VK Mini App
  if ((window as any).vk?.init) {
    return 'vk'
  }
  
  // PWA (standalone)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'pwa'
  }
  
  return 'browser'
}
