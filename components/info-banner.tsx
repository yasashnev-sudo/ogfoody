"use client"

import { useState } from "react"
import { X, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePWA } from "@/hooks/usePWA"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ArrowRight, CheckCircle2, Home as HomeIcon, Plus } from 'lucide-react'
import { IOSMenuIcon, IOSShareIcon, IOSAddToHomeIcon } from '@/components/icons/ios-icons'

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

  // Показываем только баннер о приложении (если не установлено)
  if (isStandalone) {
    return null
  }

  return (
    <>
      <div className="mb-6">
        <div 
          className="bg-[#FFEA00] rounded-xl p-5 border-3 border-black shadow-brutal cursor-pointer hover:shadow-lg transition-shadow"
          onClick={handlePWAInstallClick}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border-3 border-black flex-shrink-0">
              <Share2 className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
              <p className="text-base font-black text-black leading-tight mb-1">
                <span className="underline">С приложением удобнее</span> — установите на главный экран
              </p>
              <p className="text-sm text-black/70">
                {isIOS ? "Нажмите для подробной инструкции" : "Быстрый доступ к сервису"}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClose()
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black bg-white hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно с инструкцией по установке */}
      <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="px-4 pt-4 pb-2">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-lg bg-[#FFEA00] flex items-center justify-center border-3 border-black shadow-brutal">
                  <HomeIcon className="w-8 h-8 text-black" />
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
                      <IOSMenuIcon className="w-6 h-6 text-black" size={24} />
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
                      <IOSShareIcon className="w-6 h-6 text-black" size={24} />
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
                      <IOSAddToHomeIcon className="w-6 h-6 text-black" size={24} />
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
    </>
  )
}




