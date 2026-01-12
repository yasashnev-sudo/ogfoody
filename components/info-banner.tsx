"use client"

import { useState } from "react"
import { X, MapPin, Calendar, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InfoBannerProps {
  isAuthenticated: boolean
  onAuthClick: () => void
  onClose: () => void
}

export function InfoBanner({ isAuthenticated, onAuthClick, onClose }: InfoBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    onClose()
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
              Доставка в большинстве районов — <span className="font-semibold text-green-700">бесплатная</span>!
            </p>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="bg-white/70 rounded-lg p-4 mb-4 border border-blue-100">
            <div className="flex items-start gap-3 mb-3">
              <Calendar className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-800 leading-relaxed">
                <span className="font-medium">Для новых клиентов:</span> Выберите дату доставки в календаре, чтобы оформить заказ
              </p>
            </div>
            
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
    </div>
  )
}



