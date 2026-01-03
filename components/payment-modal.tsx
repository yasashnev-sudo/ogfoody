"use client"

import { useState } from "react"
import { X, CreditCard, Coins, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Order, UserProfile } from "@/lib/types"

interface PaymentModalProps {
  order: Order
  total: number
  userProfile: UserProfile | null
  onClose: () => void
  onPaymentComplete: (order: Order, pointsUsed: number) => void
}

export function PaymentModal({ order, total, userProfile, onClose, onPaymentComplete }: PaymentModalProps) {
  const [usePoints, setUsePoints] = useState(false)
  const [pointsToUse, setPointsToUse] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const availablePoints = userProfile?.loyaltyPoints || 0
  const maxPointsToUse = Math.min(availablePoints, Math.floor(total * 0.5))
  const finalTotal = total - pointsToUse

  const handlePointsChange = (value: number) => {
    const clamped = Math.max(0, Math.min(value, maxPointsToUse))
    setPointsToUse(clamped)
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Имитация обработки платежа
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setPaymentSuccess(true)

    setTimeout(() => {
      onPaymentComplete(order, pointsToUse)
    }, 1500)
  }

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-background w-full max-w-sm mx-4 rounded-xl p-8 text-center animate-slide-up-fade">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">Оплата прошла успешно!</h2>
          <p className="text-muted-foreground">Ваш заказ подтвержден</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 animate-fade-in">
      <div className="bg-background w-full md:max-w-md md:rounded-xl rounded-t-xl overflow-hidden animate-slide-up-fade">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Оплата заказа</h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isProcessing}>
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
                      else setPointsToUse(maxPointsToUse)
                    }}
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
                  <input
                    type="range"
                    min="0"
                    max={maxPointsToUse}
                    value={pointsToUse}
                    onChange={(e) => handlePointsChange(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
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
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-background rounded-lg border-2 border-primary cursor-pointer">
                <div className="w-4 h-4 rounded-full border-4 border-primary" />
                <span>Банковская карта</span>
              </label>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Нажимая "Оплатить", вы соглашаетесь с условиями оферты
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <Button onClick={handlePayment} className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Оплатить {finalTotal} ₽
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
