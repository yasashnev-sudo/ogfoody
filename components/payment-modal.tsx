"use client"

import { useState } from "react"
import { X, CreditCard, Coins, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Order, UserProfile } from "@/lib/types"

interface PaymentModalProps {
  order: Order
  total: number
  userProfile: UserProfile | null
  onClose: () => void
  onPaymentComplete: (order: Order, pointsUsed: number, paymentMethod: "card" | "sbp" | "cash") => void
  allowCash?: boolean // ✅ Разрешить выбор наличных (по умолчанию true)
}

export function PaymentModal({ order, total, userProfile, onClose, onPaymentComplete, allowCash = true }: PaymentModalProps) {
  const [usePoints, setUsePoints] = useState(false)
  const [pointsToUse, setPointsToUse] = useState(0)
  
  // ✅ УПРОЩЕНО: Только два варианта - онлайн или наличные
  const isChangingFromCash = order.paymentMethod === 'cash' && !order.paid
  const [paymentType, setPaymentType] = useState<"online" | "cash">("online")

  const availablePoints = userProfile?.loyaltyPoints || 0
  const maxPointsToUse = Math.min(availablePoints, Math.floor(total * 0.5))
  const finalTotal = total - pointsToUse

  const handlePointsChange = (value: number) => {
    const clamped = Math.max(0, Math.min(value, maxPointsToUse))
    setPointsToUse(clamped)
  }

  const handlePayment = async () => {
    if (paymentType === "online") {
      // ✅ Создаем платеж через ЮKassa и редиректим
      try {
        // Сохраняем использованные баллы в localStorage (для возврата после оплаты)
        if (pointsToUse > 0 && order.id) {
          localStorage.setItem(`points_used_${order.id}`, String(pointsToUse))
        }

        const response = await fetch('/api/payments/yookassa/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            amount: finalTotal,
            description: `Заказ #${order.id}`,
            returnUrl: `${window.location.origin}/payment/success?orderId=${order.id}`
          })
        })

        if (!response.ok) {
          const error = await response.json()
          console.error('❌ Payment creation failed:', error)
          alert('Ошибка создания платежа. Попробуйте еще раз.')
          return
        }

        const { confirmationUrl } = await response.json()
        
        // Редирект на страницу оплаты ЮKassa
        window.location.href = confirmationUrl
      } catch (error) {
        console.error('❌ Payment error:', error)
        alert('Ошибка при создании платежа. Попробуйте еще раз.')
      }
    } else {
      // ✅ Наличные - вызываем callback как раньше
      onPaymentComplete(order, pointsToUse, "cash")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 animate-fade-in">
      <div className="bg-background w-full md:max-w-md md:rounded-xl rounded-t-xl overflow-hidden animate-slide-up-fade">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Оплата заказа</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Сумма заказа</span>
              <span className="font-medium">{total} ₽</span>
            </div>
            {pointsToUse > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Оплата баллами</span>
                <span>-{pointsToUse} ₽</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold">К оплате</span>
              <span className="text-xl font-bold text-primary">{finalTotal} ₽</span>
            </div>
          </div>

          {availablePoints > 0 && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="font-medium">Списать баллы</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePoints}
                    onChange={(e) => {
                      setUsePoints(e.target.checked)
                      if (!e.target.checked) setPointsToUse(0)
                      else setPointsToUse(Math.floor(maxPointsToUse / 2)) // ✅ ИСПРАВЛЕНО 2026-01-14: Устанавливаем на середину
                    }}
                    data-testid="payment-use-points-checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>

              {usePoints && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Доступно: {availablePoints} баллов</span>
                    <span className="text-sm text-muted-foreground">Макс: {maxPointsToUse} ₽</span>
                  </div>
                  {/* ✅ ИСПРАВЛЕНО 2026-01-14: Улучшен UX ползунка для iPhone - увеличена область клика */}
                  <div className="py-3 px-1 -mx-1"> {/* Увеличиваем область клика через padding */}
                    <input
                      type="range"
                      min="0"
                      max={maxPointsToUse}
                      value={pointsToUse}
                      onChange={(e) => handlePointsChange(Number(e.target.value))}
                      data-testid="payment-points-slider"
                      className="w-full range-slider-mobile"
                    />
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-lg font-bold text-primary">{pointsToUse}</span>
                    <span className="text-muted-foreground"> баллов</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="font-medium">Способ оплаты</span>
            </div>
            
            {/* ✅ ДОБАВЛЕНО: Пояснение при изменении способа оплаты */}
            {isChangingFromCash && (
              <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💳 Выберите онлайн-оплату для мгновенного подтверждения заказа
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              {/* ✅ ОПЦИЯ 1: Оплатить сейчас (онлайн) */}
              <label 
                className={`flex items-center gap-3 p-4 bg-background rounded-lg border-2 cursor-pointer transition-colors ${
                  paymentType === "online" ? "border-primary" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setPaymentType("online")}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  paymentType === "online" ? "border-primary bg-primary" : "border-muted-foreground"
                }`}>
                  {paymentType === "online" && <div className="w-full h-full rounded-full bg-primary" />}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Оплатить сейчас</div>
                  <div className="text-sm text-muted-foreground">
                    Банковская карта, СБП, электронные кошельки
                  </div>
                </div>
              </label>
              
              {/* ✅ ОПЦИЯ 2: Наличные (если разрешено) */}
              {allowCash && (
                <label 
                  className={`flex items-center gap-3 p-4 bg-background rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentType === "cash" ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setPaymentType("cash")}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    paymentType === "cash" ? "border-primary bg-primary" : "border-muted-foreground"
                  }`}>
                    {paymentType === "cash" && <div className="w-full h-full rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">Оплатить наличными курьеру</div>
                    <div className="text-sm text-muted-foreground">
                      Баллы начислятся через 24 часа после доставки
                    </div>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            {paymentType === "cash" 
              ? "Нажимая кнопку, вы подтверждаете заказ и соглашаетесь с условиями оферты"
              : 'Нажимая "Оплатить", вы соглашаетесь с условиями оферты'
            }
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <Button 
            onClick={handlePayment} 
            data-testid="payment-submit-btn"
            className="w-full btn-press transition-all duration-200"
          >
            {paymentType === "online" ? (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Оплатить — {finalTotal} ₽
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Подтвердить заказ — {finalTotal} ₽
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
