"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TermsModalProps {
  onClose: () => void
  onAccept?: () => void
  showAcceptButton?: boolean
}

export function TermsModal({ onClose, onAccept, showAcceptButton = false }: TermsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-background rounded-2xl w-full max-w-lg max-h-[85vh] shadow-xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <h3 className="font-semibold">Пользовательское соглашение</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          <section>
            <h4 className="font-semibold mb-2">1. Общие положения</h4>
            <p className="text-muted-foreground leading-relaxed">
              1.1. Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между ООО «СВИТЧ ФУД»
              (далее — Компания) и пользователем сервиса SWITCH (далее — Пользователь).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              1.2. Использование сервиса означает полное и безоговорочное принятие условий настоящего Соглашения.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              1.3. Компания оставляет за собой право изменять условия Соглашения без предварительного уведомления
              Пользователя.
            </p>
          </section>

          <section>
            <h4 className="font-semibold mb-2">2. Предмет соглашения</h4>
            <p className="text-muted-foreground leading-relaxed">
              2.1. Компания предоставляет Пользователю услуги по доставке готовой домашней еды на условиях, определенных
              в настоящем Соглашении.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              2.2. Заказ формируется на 2 дня и доставляется в вечернее время (с 17:00 до 22:00) в выбранный
              Пользователем день.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              2.3. Меню обновляется еженедельно. Компания не гарантирует постоянное наличие всех позиций меню.
            </p>
          </section>

          <section>
            <h4 className="font-semibold mb-2">3. Оформление и отмена заказа</h4>
            <p className="text-muted-foreground leading-relaxed">
              3.1. Заказ можно оформить не ранее чем за день до даты доставки и не позднее следующего понедельника
              включительно.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              3.2. Отмена или изменение заказа возможны до дня доставки. В день доставки отмена невозможна.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              3.3. Суббота является нерабочим днем. Доставка в субботу не осуществляется.
            </p>
          </section>

          <section>
            <h4 className="font-semibold mb-2">4. Оплата</h4>
            <p className="text-muted-foreground leading-relaxed">
              4.1. Оплата производится онлайн банковской картой или с использованием накопленных бонусных баллов.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              4.2. Бонусными баллами можно оплатить до 50% стоимости заказа.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              4.3. Начисление бонусных баллов происходит после оплаты заказа согласно уровню программы лояльности.
            </p>
          </section>

          <section>
            <h4 className="font-semibold mb-2">5. Программа лояльности</h4>
            <p className="text-muted-foreground leading-relaxed">5.1. Программа лояльности включает три уровня:</p>
            <ul className="text-muted-foreground mt-2 space-y-1 ml-4">
              <li>• Бронзовый (до 20 000 ₽ покупок) — 3% кэшбэк</li>
              <li>• Серебряный (от 20 000 ₽ покупок) — 5% кэшбэк</li>
              <li>• Золотой (от 50 000 ₽ покупок) — 7% кэшбэк</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">
              5.2. Баллы начисляются после успешной оплаты заказа и могут быть использованы для частичной оплаты
              следующих заказов.
            </p>
          </section>

          <section>
            <h4 className="font-semibold mb-2">6. Качество и хранение</h4>
            <p className="text-muted-foreground leading-relaxed">
              6.1. Вся продукция изготавливается из свежих ингредиентов в день доставки.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              6.2. Рекомендуемый срок хранения — 48 часов в холодильнике при температуре от +2°C до +6°C.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              6.3. При обнаружении проблем с качеством просим связаться с нами в течение 24 часов после доставки.
            </p>
          </section>

          <section>
            <h4 className="font-semibold mb-2">7. Персональные данные</h4>
            <p className="text-muted-foreground leading-relaxed">
              7.1. Компания обрабатывает персональные данные Пользователя в соответствии с Федеральным законом №152-ФЗ
              «О персональных данных».
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              7.2. Данные используются исключительно для оказания услуг и не передаются третьим лицам без согласия
              Пользователя.
            </p>
          </section>

          <section>
            <h4 className="font-semibold mb-2">8. Контакты</h4>
            <p className="text-muted-foreground leading-relaxed">
              ООО «СВИТЧ ФУД»
              <br />
              Телефон: +7 (495) 123-45-67
              <br />
              Email: hello@switch-food.ru
              <br />
              Адрес: г. Москва, ул. Примерная, д. 1
            </p>
          </section>

          <p className="text-xs text-muted-foreground pt-4 border-t">Последнее обновление: 20 декабря 2025 г.</p>
        </div>

        {showAcceptButton && (
          <div className="p-4 border-t border-border shrink-0">
            <Button onClick={onAccept} className="w-full">
              Принимаю условия
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
