'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { X, Download, Share2, SquarePlus, MoreHorizontal, ArrowRight, CheckCircle2, Home, Plus } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)

  useEffect(() => {
    // Проверяем iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIOSDevice)

    // Проверяем, запущено ли приложение в standalone режиме (уже установлено)
    // Важно: display-mode: standalone - самый надежный способ определить установленное приложение
    // navigator.standalone может быть true даже если приложение удалено, но ярлык остался
    const checkStandalone = () => {
      // Основная проверка: display-mode: standalone - приложение установлено и запущено
      const isStandaloneDisplay = window.matchMedia('(display-mode: standalone)').matches
      
      // Для iOS: navigator.standalone может быть true только когда открыто через ярлык
      // Но это не значит, что приложение установлено - ярлык может остаться после удаления
      // Поэтому используем только display-mode как основную проверку
      const isIOSStandalone = isIOSDevice && (window.navigator as any).standalone === true
      
      // Для Android: проверяем referrer
      const isAndroidStandalone = document.referrer.includes('android-app://')
      
      // Приложение считается установленным ТОЛЬКО если:
      // 1. display-mode: standalone (самый надежный способ) - приложение точно установлено и запущено
      // 2. ИЛИ (iOS через ярлык И display-mode не browser) - это значит открыто через установленное приложение
      // 3. ИЛИ Android через referrer
      const isStandaloneMode = isStandaloneDisplay || 
        (isIOSStandalone && !window.matchMedia('(display-mode: browser)').matches) ||
        isAndroidStandalone
      
      setIsStandalone(isStandaloneMode)
      
      // Если установлено, скрываем баннер
      if (isStandaloneMode) {
        setIsVisible(false)
        setIsDismissed(true)
        return true
      }
      return false
    }

    // Первая проверка
    const isAlreadyInstalled = checkStandalone()
    
    // Если уже установлено, не продолжаем
    if (isAlreadyInstalled) {
      return
    }

    // Проверяем, был ли промпт уже отклонен (в localStorage)
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10)
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
      // Показываем снова через 7 дней
      if (daysSinceDismissed < 7) {
        setIsDismissed(true)
        return
      }
    }

    // Проверяем периодически (на случай если пользователь установил приложение)
    const interval = setInterval(() => {
      checkStandalone()
    }, 1000)

    // Слушаем событие beforeinstallprompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Для iOS показываем баннер через небольшую задержку
    if (isIOSDevice) {
      const timer = setTimeout(() => {
        // Проверяем еще раз перед показом
        if (!checkStandalone()) {
          setIsVisible(true)
        }
      }, 3000) // Показываем через 3 секунды после загрузки

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('PWA установлено успешно')
        setIsVisible(false)
      } else {
        console.log('Пользователь отклонил установку')
      }

      setDeferredPrompt(null)
    } catch (error) {
      console.error('Ошибка при установке PWA:', error)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  const handleIOSBannerClick = () => {
    setShowIOSModal(true)
  }

  // Не показываем баннер сверху - он теперь в InfoBanner
  // Оставляем только модальное окно для инструкций
  return null

  // Для iOS - кликабельный баннер сверху (ОТКЛЮЧЕН - теперь в InfoBanner)
  if (false && isIOS) {
    return (
      <>
        <div 
          className="fixed top-0 left-0 right-0 z-40 bg-[#FFEA00] border-b-3 border-black shadow-brutal animate-slide-down-fade cursor-pointer"
          onClick={handleIOSBannerClick}
        >
          <div className="max-w-7xl mx-auto px-3 py-2">
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-7 h-7 flex items-center justify-center rounded-md bg-white border-2 border-black shadow-brutal flex-shrink-0">
                  <Share2 className="w-4 h-4 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-black leading-tight">
                    <span className="underline">С приложением удобнее</span> — установите на главный экран
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDismiss()
                }}
                className="w-6 h-6 flex items-center justify-center rounded-md border-2 border-black bg-white hover:bg-gray-100 transition-colors brutal-hover flex-shrink-0"
                aria-label="Закрыть"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Модальное окно с подробной инструкцией */}
        <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="px-4 pt-4 pb-2">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-lg bg-[#FFEA00] flex items-center justify-center border-3 border-black shadow-brutal">
                  <Home className="w-8 h-8 text-black" />
                </div>
              </div>
              <DialogTitle className="text-xl font-black text-black text-center mb-1">
                Установите OGFooDY
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-700 text-center">
                Инструкция для iOS 26
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 px-4 pb-4">
              {/* Шаг 1 - Три точки (меню) */}
              <div className="bg-white border-2 border-black rounded-lg p-3 shadow-brutal">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#FFEA00] border-2 border-black flex items-center justify-center flex-shrink-0 font-black text-sm">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base mb-1.5 text-black leading-tight">Найдите кнопку меню</h3>
                    <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                      В правом нижнем углу адресной строки Safari найдите кнопку с тремя точками:
                    </p>
                    <div className="flex items-center justify-center gap-2 bg-gray-50 border-2 border-black rounded-md p-2">
                      <MoreHorizontal className="w-6 h-6 text-black" />
                      <ArrowRight className="w-4 h-4 text-black" />
                      <span className="font-bold text-sm text-black">Меню</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Шаг 2 - Поделиться */}
              <div className="bg-white border-2 border-black rounded-lg p-3 shadow-brutal">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#FFEA00] border-2 border-black flex items-center justify-center flex-shrink-0 font-black text-sm">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base mb-1.5 text-black leading-tight">Нажмите "Поделиться"</h3>
                    <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                      В открывшемся меню найдите и нажмите на опцию "Поделиться":
                    </p>
                    <div className="flex items-center justify-center gap-2 bg-gray-50 border-2 border-black rounded-md p-2">
                      <Share2 className="w-6 h-6 text-black" />
                      <ArrowRight className="w-4 h-4 text-black" />
                      <span className="font-bold text-sm text-black">Поделиться</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Шаг 3 - Добавить на экран Домой */}
              <div className="bg-white border-2 border-black rounded-lg p-3 shadow-brutal">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#FFEA00] border-2 border-black flex items-center justify-center flex-shrink-0 font-black text-sm">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base mb-1.5 text-black leading-tight">Выберите "Добавить на экран «Домой»"</h3>
                    <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                      В меню "Поделиться" найдите опцию с иконкой квадрата с плюсом:
                    </p>
                    <div className="flex items-center justify-center gap-2 bg-gray-50 border-2 border-black rounded-md p-2">
                      <SquarePlus className="w-6 h-6 text-black" />
                      <ArrowRight className="w-4 h-4 text-black" />
                      <span className="font-bold text-sm text-black">Добавить на экран «Домой»</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5 italic">
                      Если не видите, прокрутите меню вниз
                    </p>
                  </div>
                </div>
              </div>

              {/* Шаг 4 - Подтверждение */}
              <div className="bg-white border-2 border-black rounded-lg p-3 shadow-brutal">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#FFEA00] border-2 border-black flex items-center justify-center flex-shrink-0 font-black text-sm">
                    4
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base mb-1.5 text-black leading-tight">Подтвердите установку</h3>
                    <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                      Нажмите кнопку "Добавить" в правом верхнем углу экрана
                    </p>
                    <div className="bg-gray-50 border-2 border-black rounded-md p-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5 text-black" />
                        <span className="text-xs font-bold text-black">Добавить</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5">
                      Приложение появится на главном экране
                    </p>
                  </div>
                </div>
              </div>

              {/* Готово */}
              <div className="bg-[#FFEA00] border-3 border-black rounded-lg p-3 shadow-brutal">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-black flex-shrink-0" />
                  <div>
                    <p className="font-black text-base text-black leading-tight">Готово!</p>
                    <p className="text-xs text-black/80 leading-relaxed">
                      Приложение появится на главном экране
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="px-4 pb-4 pt-2">
              <Button
                onClick={() => {
                  setShowIOSModal(false)
                  handleDismiss()
                }}
                className="w-full bg-[#FFEA00] text-black border-2 border-black shadow-brutal brutal-hover font-black text-sm py-2.5"
              >
                Понятно, спасибо!
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Для Android/Desktop - большой промпт снизу
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up-fade">
      <div className="max-w-md mx-auto bg-white border-4 border-black shadow-brutal rounded-xl p-4 sm:p-6">
        {/* Кнопка закрытия */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-gray-100 transition-colors brutal-hover"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Кнопка установки для Android/Desktop */}
        <div className="space-y-4 pr-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FFEA00] border-2 border-black shadow-brutal flex-shrink-0">
              <Download className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Установите OGFooDY</h3>
              <p className="text-sm text-gray-700">
                Установите приложение для быстрого доступа к сервису
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleInstallClick}
              className="flex-1 bg-[#FFEA00] text-black border-2 border-black shadow-brutal brutal-hover font-bold"
            >
              <Download className="w-4 h-4 mr-2" />
              УСТАНОВИТЬ ПРИЛОЖЕНИЕ
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="border-2 border-black"
            >
              Позже
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
