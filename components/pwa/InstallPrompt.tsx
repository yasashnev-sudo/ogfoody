'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { X, Download, Share2, SquarePlus, MoreVertical, ArrowRight, CheckCircle2 } from 'lucide-react'

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
    // Проверяем, запущено ли приложение в standalone режиме (уже установлено)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      
      setIsStandalone(isStandaloneMode)
      
      // Если установлено, скрываем баннер
      if (isStandaloneMode) {
        setIsVisible(false)
        setIsDismissed(true)
      }
    }

    checkStandalone()

    // Проверяем периодически (на случай если пользователь установил приложение)
    const interval = setInterval(checkStandalone, 1000)

    // Проверяем iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIOSDevice)

    // Если уже установлено, не показываем промпт
    if (isStandalone) {
      return () => clearInterval(interval)
    }

    // Проверяем, был ли промпт уже отклонен (в localStorage)
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10)
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
      // Показываем снова через 7 дней
      if (daysSinceDismissed < 7) {
        setIsDismissed(true)
        return () => clearInterval(interval)
      }
    }

    // Слушаем событие beforeinstallprompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Для iOS показываем баннер через небольшую задержку
    if (isIOSDevice && !isStandalone) {
      setTimeout(() => {
        setIsVisible(true)
      }, 3000) // Показываем через 3 секунды после загрузки
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isStandalone])

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

  // Не показываем, если уже установлено, отклонено или не видимо
  if (isStandalone || isDismissed || !isVisible) {
    return null
  }

  // Для iOS - кликабельный баннер сверху
  if (isIOS) {
    return (
      <>
        <div 
          className="fixed top-0 left-0 right-0 z-40 bg-[#FFEA00] border-b-4 border-black shadow-brutal animate-slide-down-fade cursor-pointer"
          onClick={handleIOSBannerClick}
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-white border-2 border-black shadow-brutal flex-shrink-0">
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-black leading-tight">
                    <span className="underline">Нажмите здесь</span> чтобы установить приложение на главный экран
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDismiss()
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-gray-100 transition-colors brutal-hover flex-shrink-0"
                aria-label="Закрыть"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Модальное окно с подробной инструкцией */}
        <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-xl bg-[#FFEA00] flex items-center justify-center border-4 border-black shadow-brutal">
                  <Home className="w-10 h-10 text-black" />
                </div>
              </div>
              <DialogTitle className="text-2xl font-black text-black text-center mb-2">
                Установите OGFooDY на главный экран
              </DialogTitle>
              <DialogDescription className="text-base text-gray-700 text-center mb-6">
                Инструкция для iOS 26. Следуйте простым шагам ниже
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Шаг 1 - Три точки (меню) */}
              <div className="bg-white border-2 border-black rounded-xl p-4 shadow-brutal">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FFEA00] border-2 border-black flex items-center justify-center flex-shrink-0 font-black text-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg mb-2 text-black">Найдите кнопку меню (три точки)</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      В правом нижнем углу адресной строки Safari найдите кнопку с тремя точками:
                    </p>
                    <div className="flex items-center justify-center gap-2 bg-gray-50 border-2 border-black rounded-lg p-3">
                      <MoreVertical className="w-8 h-8 text-black" />
                      <ArrowRight className="w-5 h-5 text-black" />
                      <span className="font-bold text-black">Меню</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Это кнопка меню Safari в адресной строке
                    </p>
                  </div>
                </div>
              </div>

              {/* Шаг 2 - Поделиться */}
              <div className="bg-white border-2 border-black rounded-xl p-4 shadow-brutal">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FFEA00] border-2 border-black flex items-center justify-center flex-shrink-0 font-black text-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg mb-2 text-black">Нажмите на "Поделиться"</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      В открывшемся меню найдите и нажмите на опцию "Поделиться":
                    </p>
                    <div className="flex items-center justify-center gap-2 bg-gray-50 border-2 border-black rounded-lg p-3">
                      <Share2 className="w-8 h-8 text-black" />
                      <ArrowRight className="w-5 h-5 text-black" />
                      <span className="font-bold text-black">Поделиться</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Иконка: квадрат со стрелкой вверх
                    </p>
                  </div>
                </div>
              </div>

              {/* Шаг 3 - Добавить на экран Домой */}
              <div className="bg-white border-2 border-black rounded-xl p-4 shadow-brutal">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FFEA00] border-2 border-black flex items-center justify-center flex-shrink-0 font-black text-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg mb-2 text-black">Выберите "Добавить на экран «Домой»"</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      В меню "Поделиться" найдите опцию с иконкой квадрата с плюсом:
                    </p>
                    <div className="flex items-center justify-center gap-2 bg-gray-50 border-2 border-black rounded-lg p-3">
                      <SquarePlus className="w-8 h-8 text-black" />
                      <ArrowRight className="w-5 h-5 text-black" />
                      <span className="font-bold text-black">Добавить на экран «Домой»</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 italic">
                      Если не видите эту опцию, прокрутите меню вниз
                    </p>
                  </div>
                </div>
              </div>

              {/* Шаг 4 - Подтверждение */}
              <div className="bg-white border-2 border-black rounded-xl p-4 shadow-brutal">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FFEA00] border-2 border-black flex items-center justify-center flex-shrink-0 font-black text-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg mb-2 text-black">Подтвердите установку</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Нажмите кнопку "Добавить" в правом верхнем углу экрана
                    </p>
                    <div className="bg-gray-50 border-2 border-black rounded-lg p-3 text-center">
                      <p className="text-sm font-bold text-black">Появится кнопка "Добавить"</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Приложение будет установлено на главный экран
                    </p>
                  </div>
                </div>
              </div>

              {/* Готово */}
              <div className="bg-[#FFEA00] border-4 border-black rounded-xl p-4 shadow-brutal">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-black flex-shrink-0" />
                  <div>
                    <p className="font-black text-lg text-black">Готово!</p>
                    <p className="text-sm text-black/80">
                      Приложение появится на главном экране вашего iPhone или iPad
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                onClick={() => {
                  setShowIOSModal(false)
                  handleDismiss()
                }}
                className="w-full bg-[#FFEA00] text-black border-2 border-black shadow-brutal brutal-hover font-black"
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
                Установите приложение для быстрого доступа и работы офлайн
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
