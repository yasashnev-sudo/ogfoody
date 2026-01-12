"use client"

import { Loader2, CreditCard } from "lucide-react"

interface PaymentLoadingProps {
  open: boolean
}

export function PaymentLoading({ open }: PaymentLoadingProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-background w-full max-w-sm mx-4 rounded-xl p-8 text-center animate-slide-up-fade">
        {/* Animated Loading Icon */}
        <div className="relative mx-auto mb-4">
          {/* Rotating outer ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
          </div>
          
          {/* Spinning loader */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-20 h-20 text-primary animate-spin" strokeWidth={2} />
          </div>
          
          {/* Main icon */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <CreditCard className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text content */}
        <h2 className="text-xl font-bold mb-2">Идет оплата...</h2>
        <p className="text-muted-foreground text-sm">
          Это займет несколько секунд
        </p>

        {/* Loading dots animation */}
        <div className="flex items-center justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

