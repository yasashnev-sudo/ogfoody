"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, Mail, Smartphone } from "lucide-react"
import { usePWA } from "@/hooks/usePWA"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Home as HomeIcon, Plus } from 'lucide-react'
import { IOSMenuIcon, IOSShareIcon, IOSAddToHomeIcon } from '@/components/icons/ios-icons'

export function Footer() {
  const { isStandalone, isIOS } = usePWA()
  const [showIOSModal, setShowIOSModal] = useState(false)
  return (
    <footer className="bg-white border-t-2 border-black mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Контакты */}
          <div>
            <h3 className="font-black text-black mb-3">Контакты</h3>
            <div className="space-y-2 text-sm">
              <a 
                href="tel:+79219176619" 
                className="flex items-center gap-2 text-muted-foreground hover:text-[#9D00FF] transition-colors"
              >
                <Phone className="w-4 h-4" />
                +7 (921) 917-66-19
              </a>
              <a 
                href="mailto:hello@ogfoody.ru" 
                className="flex items-center gap-2 text-muted-foreground hover:text-[#9D00FF] transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@ogfoody.ru
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Ежедневно с 10:00 до 22:00
              </p>
            </div>
          </div>

          {/* Документы */}
          <div>
            <h3 className="font-black text-black mb-3">Документы</h3>
            <div className="space-y-2 text-sm">
              <Link 
                href="/offer" 
                className="block text-muted-foreground hover:text-[#9D00FF] transition-colors"
              >
                Публичная оферта
              </Link>
              <Link 
                href="/policy" 
                className="block text-muted-foreground hover:text-[#9D00FF] transition-colors"
              >
                Политика конфиденциальности
              </Link>
            </div>
          </div>

          {/* О компании */}
          <div>
            <h3 className="font-black text-black mb-3">OGFooDY</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Домашняя еда на каждый день
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Доставка готовых обедов на 2 дня в Санкт-Петербурге
            </p>
            
            {/* Информация о приложении (если не установлено) - кликабельная */}
            {!isStandalone && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="w-full text-left flex items-start gap-2 hover:opacity-80 transition-opacity"
                >
                  <Smartphone className="w-4 h-4 text-[#9D00FF] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-black mb-1">
                      Установите приложение
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isIOS 
                        ? "С приложением удобнее — нажмите для инструкции"
                        : "С приложением удобнее — быстрый доступ к сервису"
                      }
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Реквизиты */}
        <div className="pt-6 border-t-2 border-black">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-black mb-2">Реквизиты:</p>
            <p>ИП Ясашнев Сергей Владимирович</p>
            <p>ИНН 780624071235</p>
            <p>ОГРНИП 318784700273802</p>
            <p>Адрес: Лиговский пр., д. 289 А, г. Санкт-Петербург</p>
          </div>
        </div>

        {/* Копирайт */}
        <div className="pt-4 border-t border-gray-200 mt-4">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} OGFooDY. Все права защищены.
          </p>
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
              {isIOS ? "Инструкция для iOS 26" : "Установите приложение для быстрого доступа"}
            </DialogDescription>
          </DialogHeader>

          {isIOS ? (
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
          ) : (
            <div className="px-4 pb-4">
              <div className="bg-white border-2 border-black rounded-lg p-4 shadow-brutal">
                <p className="text-sm text-gray-700 mb-3">
                  Для установки приложения на Android или Desktop используйте кнопку установки в браузере или следуйте инструкциям вашего браузера.
                </p>
                <p className="text-xs text-gray-600">
                  Приложение обеспечит быстрый доступ к сервису прямо с главного экрана.
                </p>
              </div>
            </div>
          )}

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
    </footer>
  )
}
