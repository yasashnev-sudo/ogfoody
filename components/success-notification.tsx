"use client"

import { useEffect } from "react"
import { X, CheckCircle2 } from "lucide-react"

interface SuccessNotificationProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  duration?: number // в миллисекундах, 0 = не закрывать автоматически
}

export function SuccessNotification({ open, onClose, title, description, duration = 3000 }: SuccessNotificationProps) {
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [open, duration, onClose])

  if (!open) return null

  return (
    <div className="fixed top-4 right-4 z-[10000] animate-slide-in-from-right">
      <div className="bg-white border-2 border-black shadow-brutal rounded-xl p-4 min-w-[300px] max-w-[400px]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center border-2 border-black flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white stroke-[3px]" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-lg text-black mb-1">{title}</h3>
            {description && (
              <p className="text-sm text-gray-700">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center flex-shrink-0 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
