"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CancelOrderDialogProps {
  open: boolean
  onClose: () => void
  wasPaid?: boolean
}

export function CancelOrderDialog({ open, onClose, wasPaid }: CancelOrderDialogProps) {
  if (!open) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      style={{ animationDuration: '0.3s' }}
    >
      <div 
        className="bg-background w-full max-w-sm mx-4 rounded-xl p-8 text-center animate-bounce-scale shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Icon */}
        <div className="relative mx-auto mb-6">
          {/* Pulsing background circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full animate-pulse opacity-75" 
                 style={{ animationDuration: '1.5s' }} />
          </div>
          {/* Main icon */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text content with staggered animation */}
        <h2 className="text-2xl font-bold mb-3 animate-slide-up-fade" style={{ animationDelay: '0.15s' }}>
          Заказ отменён
        </h2>
        
        <p className="text-muted-foreground mb-1 animate-slide-up-fade" style={{ animationDelay: '0.25s' }}>
          {wasPaid 
            ? "Оплаченный заказ успешно отменён"
            : "Заказ успешно отменён"
          }
        </p>
        
        {wasPaid && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pop-in" style={{ animationDelay: '0.35s' }}>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              💳 Деньги вернутся на карту в течение 3 рабочих дней
            </p>
          </div>
        )}

        <Button 
          onClick={onClose}
          className="mt-6 w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white animate-pop-in btn-press shadow-lg"
          style={{ animationDelay: '0.4s' }}
        >
          Понятно
        </Button>
      </div>
    </div>
  )
}

