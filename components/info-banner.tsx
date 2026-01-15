"use client"

import { useState } from "react"
import { X, MapPin, Calendar, LogIn, Smartphone, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePWA } from "@/hooks/usePWA"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { SquarePlus, MoreHorizontal, ArrowRight, CheckCircle2, Home, Plus } from 'lucide-react'

interface InfoBannerProps {
  isAuthenticated: boolean
  onAuthClick: () => void
  onClose: () => void
}

export function InfoBanner({ isAuthenticated, onAuthClick, onClose }: InfoBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const { isStandalone, isIOS } = usePWA()

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  const handlePWAInstallClick = () => {
    if (isIOS) {
      setShowIOSModal(true)
    }
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6 relative shadow-sm">
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Закрыть"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="pr-8">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Мы доставляем по всему Санкт-Петербургу
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Проверьте ваш район при оформлении заказа
            </p>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="space-y-4">
            {/* Баннер о приложении (если не установлено) */}
            {!isStandalone && (
              <div 
                className="bg-[#FFEA00] rounded-lg p-4 border-2 border-black shadow-brutal cursor-pointer hover:shadow-lg transition-shadow"
                onClick={handlePWAInstallClick}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-md bg-white border-2 border-black flex-shrink-0">
                    <Share2 className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-black leading-tight">
                      <span className="underline">С приложением удобнее</span> — установите на главный экран
                    </p>
                    <p className="text-xs text-black/70 mt-1">
                      {isIOS ? "Нажмите для инструкции" : "Быстрый доступ и работа офлайн"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Сообщение для входа */}
            <div className="bg-white/70 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <LogIn className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-800 leading-relaxed mb-2">
                    <span className="font-medium">Уже зарегистрированы?</span> Войдите в свой аккаунт для быстрого оформления
                  </p>
                  <Button
                    onClick={onAuthClick}
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-blue-50 border-blue-300 text-blue-700 font-medium"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Войти
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="bg-white/70 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-800 leading-relaxed">
                Выберите дату в календаре, чтобы создать новый заказ или изменить существующий
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно с инструкцией по установке для iOS */}
      {isIOS && (
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
                onClick={() => setShowIOSModal(false)}
                className="w-full bg-[#FFEA00] text-black border-2 border-black shadow-brutal brutal-hover font-black text-sm py-2.5"
              >
                Понятно, спасибо!
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}




