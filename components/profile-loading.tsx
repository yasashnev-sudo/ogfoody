"use client"

import { User, Loader2 } from "lucide-react"

interface ProfileLoadingProps {
  open: boolean
}

export function ProfileLoading({ open }: ProfileLoadingProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-background w-full max-w-sm mx-4 rounded-xl p-8 text-center animate-slide-up-fade border-4 border-black shadow-brutal">
        {/* Animated Loading Icon */}
        <div className="relative mx-auto mb-4">
          {/* Rotating outer ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-[#FFEA00]/30 rounded-full" />
          </div>
          
          {/* Spinning loader */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-20 h-20 text-[#FFEA00] animate-spin" strokeWidth={2} />
          </div>
          
          {/* Main icon - User Profile */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-[#FFEA00] to-[#FFD700] rounded-full flex items-center justify-center mx-auto shadow-brutal animate-pulse border-2 border-black">
            <User className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text content */}
        <h2 className="text-xl font-black mb-2">Загружаем профиль...</h2>
        <p className="text-muted-foreground text-sm font-medium">
          Подготавливаем анкету с вашими данными
        </p>

        {/* Loading dots animation */}
        <div className="flex items-center justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-[#FFEA00] rounded-full animate-bounce border border-black" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#FFEA00] rounded-full animate-bounce border border-black" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#FFEA00] rounded-full animate-bounce border border-black" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}


import { User, Loader2 } from "lucide-react"

interface ProfileLoadingProps {
  open: boolean
}

export function ProfileLoading({ open }: ProfileLoadingProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-background w-full max-w-sm mx-4 rounded-xl p-8 text-center animate-slide-up-fade border-4 border-black shadow-brutal">
        {/* Animated Loading Icon */}
        <div className="relative mx-auto mb-4">
          {/* Rotating outer ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-[#FFEA00]/30 rounded-full" />
          </div>
          
          {/* Spinning loader */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-20 h-20 text-[#FFEA00] animate-spin" strokeWidth={2} />
          </div>
          
          {/* Main icon - User Profile */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-[#FFEA00] to-[#FFD700] rounded-full flex items-center justify-center mx-auto shadow-brutal animate-pulse border-2 border-black">
            <User className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text content */}
        <h2 className="text-xl font-black mb-2">Загружаем профиль...</h2>
        <p className="text-muted-foreground text-sm font-medium">
          Подготавливаем анкету с вашими данными
        </p>

        {/* Loading dots animation */}
        <div className="flex items-center justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-[#FFEA00] rounded-full animate-bounce border border-black" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#FFEA00] rounded-full animate-bounce border border-black" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#FFEA00] rounded-full animate-bounce border border-black" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}



