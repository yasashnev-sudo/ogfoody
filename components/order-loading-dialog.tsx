"use client"

import { ChefHat } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface OrderLoadingDialogProps {
  open: boolean
  text?: string // 🎯 UX УЛУЧШЕНИЕ: Кастомный текст
}

export function OrderLoadingDialog({ open, text }: OrderLoadingDialogProps) {
  if (!open) return null

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-md border-0 p-0 bg-transparent shadow-none" 
        onInteractOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>{text || 'Создание заказа'}</DialogTitle>
        </VisuallyHidden>
        
        <div className="bg-background w-full rounded-xl p-8 text-center animate-bounce-scale shadow-2xl">
          {/* Animated Icon with Chef Hat */}
          <div className="relative mx-auto mb-6">
            {/* Pulsing background circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-[#FFEA00]/20 rounded-full animate-pulse opacity-75" 
                   style={{ animationDuration: '1.5s' }} />
            </div>
            
            {/* Main logo */}
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Image
                src="/logo-small.png"
                alt="OGFooDY Logo"
                width={80}
                height={80}
                className="rounded-full object-cover"
                priority
              />
              
              {/* Animated Chef Hat on top with brutal shadow */}
              <div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce"
                style={{ 
                  animationDuration: '1s',
                  filter: 'drop-shadow(2px 2px 0px #000000)'
                }}
              >
                <ChefHat className="w-10 h-10 text-[#FFEA00]" strokeWidth={3} fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Text content with staggered animation */}
          <h2 className="text-2xl font-bold mb-3 animate-slide-up-fade" style={{ animationDelay: '0.15s' }}>
            {text || 'Создаем заказ'}
          </h2>
          
          <p className="text-muted-foreground animate-slide-up-fade" style={{ animationDelay: '0.25s' }}>
            Готовим для вас что-то вкусное
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

