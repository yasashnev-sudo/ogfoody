"use client"

import { useState } from "react"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Order } from "@/lib/types"

interface ReviewModalProps {
  order: Order
  onClose: () => void
  onSubmit: (orderId: string, rating: number, text: string) => void
}

const formatDisplayDate = (date: Date | string): string => {
  const d = date instanceof Date ? date : new Date(date)
  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
  return `${d.getDate()} ${months[d.getMonth()]}`
}

export function ReviewModal({ order, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [text, setText] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = () => {
    const orderDate = order.startDate instanceof Date ? order.startDate : new Date(order.startDate)
    const orderId = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, "0")}-${orderDate.getDate().toString().padStart(2, "0")}`
    onSubmit(orderId, rating, text)
    onClose()
  }

  const orderDate = order.startDate instanceof Date ? order.startDate : new Date(order.startDate)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-background rounded-2xl w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Оставить отзыв</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Заказ на {formatDisplayDate(orderDate)}</p>
            <p className="text-xs text-muted-foreground">{order.persons.length} персон</p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium">
              {rating === 1 && "Ужасно"}
              {rating === 2 && "Плохо"}
              {rating === 3 && "Нормально"}
              {rating === 4 && "Хорошо"}
              {rating === 5 && "Отлично!"}
            </p>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Расскажите подробнее о вашем опыте (необязательно)"
            className="w-full h-24 p-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          <Button onClick={handleSubmit} className="w-full">
            Отправить отзыв
          </Button>
        </div>
      </div>
    </div>
  )
}
