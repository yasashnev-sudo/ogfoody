"use client"

import Link from "next/link"
import { Phone, Mail } from "lucide-react"

export function Footer() {
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
            <p className="text-xs text-muted-foreground">
              Доставка готовых обедов на 2 дня в Санкт-Петербурге
            </p>
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
    </footer>
  )
}
