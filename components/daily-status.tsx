"use client"

import { Truck, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Order } from "@/lib/types"

interface DailyStatusProps {
  orders: Order[]
  onOrderClick?: () => void
  onFoodCardClick?: () => void
}

export function DailyStatus({ orders, onOrderClick, onFoodCardClick }: DailyStatusProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if today is a delivery day (order start date)
  const hasDeliveryToday = orders.some((order) => {
    const deliveryDate = new Date(order.startDate)
    deliveryDate.setHours(0, 0, 0, 0)
    return deliveryDate.getTime() === today.getTime()
  })

  // Check if today has food (day1 or day2 after delivery)
  const hasFoodToday = orders.some((order) => {
    const deliveryDate = new Date(order.startDate)
    deliveryDate.setHours(0, 0, 0, 0)

    const day1 = new Date(deliveryDate)
    day1.setDate(day1.getDate() + 1)

    const day2 = new Date(deliveryDate)
    day2.setDate(day2.getDate() + 2)

    return today.getTime() === day1.getTime() || today.getTime() === day2.getTime()
  })

  // Determine status
  if (hasDeliveryToday) {
    return (
      <div className="bg-[#FFEA00] rounded-xl border-2 border-black shadow-brutal p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal shrink-0">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-black text-black mb-1">ЖДИ КУРЬЕРА СЕГОДНЯ</h3>
            <p className="text-xs sm:text-sm text-black/80 font-bold">Интервал: 19:00 - 23:00</p>
          </div>
        </div>
      </div>
    )
  }

  if (hasFoodToday) {
    return (
      <div
        onClick={onFoodCardClick}
        className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-4 sm:p-5 cursor-pointer hover:shadow-[3px_3px_0px_0px_#000000] transition-shadow"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <UtensilsCrossed className="w-6 h-6 sm:w-8 sm:h-8 text-[#9D00FF] stroke-[2.5px] shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-black text-black uppercase mb-1">СЕГОДНЯ ТЫ СЫТЫЙ</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Загляни в холодильник</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty day
  return (
    <div className="bg-gray-100 rounded-xl border-2 border-dashed border-black shadow-brutal p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg font-black text-black leading-tight">
            СЕГОДНЯ У ВАС В ХОЛОДИЛЬНИКЕ ПУСТО
          </h3>
        </div>
        {onOrderClick && (
          <Button
            onClick={onOrderClick}
            className="bg-black text-white hover:bg-black/90 border-2 border-black shadow-brutal font-black text-xs sm:text-sm px-3 sm:px-4 py-2 h-auto w-full sm:w-auto shrink-0"
          >
            ИСПРАВИТЬ ПОЛОЖЕНИЕ
          </Button>
        )}
      </div>
    </div>
  )
}

