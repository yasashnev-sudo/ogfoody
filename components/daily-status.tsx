"use client"

import { Truck, UtensilsCrossed, CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Order } from "@/lib/types"

interface DailyStatusProps {
  orders: Order[]
  availableDates?: Date[] // Array of available delivery dates
  onOrderClick?: (date: Date) => void // Now accepts the selected date
  onFoodCardClick?: () => void
}

// Helper: Format day of week in Russian (nominative case, uppercase)
const getDayOfWeek = (date: Date): string => {
  const days = ["ВОСКРЕСЕНЬЕ", "ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА", "СУББОТА"]
  return days[date.getDay()]
}

// Helper: Format date in Russian (e.g., "15 янв")
const formatShortDate = (date: Date): string => {
  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
  return `${date.getDate()} ${months[date.getMonth()]}`
}

// Helper: Format date in Russian with full month name in genitive case (e.g., "8 января")
const formatDateGenitive = (date: Date): string => {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ]
  return `${date.getDate()} ${months[date.getMonth()]}`
}

// Helper: Check if there's an order for a specific date
const hasOrderForDate = (orders: Order[], date: Date): boolean => {
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)

  return orders.some((order) => {
    const orderDate = new Date(order.startDate)
    orderDate.setHours(0, 0, 0, 0)
    return orderDate.getTime() === checkDate.getTime()
  })
}

// Helper: Find next available delivery date (prefer Sunday if today is empty, but skip if already ordered)
const findNextAvailableDate = (availableDates?: Date[], orders: Order[] = []): Date | null => {
  if (!availableDates || availableDates.length === 0) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // If today is empty, prefer Sunday (day 0) for delivery
  // First, try to find the next Sunday that doesn't have an order yet
  const nextSunday = availableDates.find((date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    const isSunday = checkDate.getDay() === 0
    const isFutureOrToday = checkDate.getTime() >= today.getTime()
    const hasNoOrder = !hasOrderForDate(orders, checkDate)
    return isSunday && isFutureOrToday && hasNoOrder
  })

  if (nextSunday) {
    return new Date(nextSunday)
  }

  // If no free Sunday found, find the first available date that is >= today and has no order
  const nextDate = availableDates.find((date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    const isFutureOrToday = checkDate.getTime() >= today.getTime()
    const hasNoOrder = !hasOrderForDate(orders, checkDate)
    return isFutureOrToday && hasNoOrder
  })

  return nextDate ? new Date(nextDate) : null
}

export function DailyStatus({ orders, availableDates, onOrderClick, onFoodCardClick }: DailyStatusProps) {
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
            <h3 className="text-base sm:text-lg font-black text-black uppercase mb-1">СЕГОДНЯ У ВАС ЕСТЬ ЕДА</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Загляните в холодильник</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty day - Smart timeline version
  // Check if there are any orders
  const hasAnyOrders = orders.length > 0

  // If there are orders, find the last day when food will be available (deliveryDate + 2 days)
  let lastFoodDate: Date | null = null
  if (hasAnyOrders) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    orders.forEach((order) => {
      const deliveryDate = new Date(order.startDate)
      deliveryDate.setHours(0, 0, 0, 0)

      // Food lasts for 2 days after delivery (day 0 = delivery, day 1 and day 2 = food days)
      const foodEndDate = new Date(deliveryDate)
      foodEndDate.setDate(foodEndDate.getDate() + 2)

      // Only consider future dates
      if (foodEndDate.getTime() >= today.getTime()) {
        if (!lastFoodDate || foodEndDate.getTime() > lastFoodDate.getTime()) {
          lastFoodDate = foodEndDate
        }
      }
    })
  }

  // Find next available date for ordering
  const nextAvailableDate = findNextAvailableDate(availableDates, orders)
  const hasNextDate = nextAvailableDate !== null

  // Determine what to show
  if (hasAnyOrders && lastFoodDate) {
    // Case: Has orders, show when food will end
    return (
      <div className="bg-gray-100 rounded-xl border-2 border-dashed border-black shadow-brutal p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal shrink-0">
              <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5px]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base md:text-lg font-black text-black leading-tight mb-1">
                {formatDateGenitive(lastFoodDate).toUpperCase()} У ВАС ЗАКОНЧИТСЯ ЕДА!
              </h3>
            </div>
          </div>
          {onOrderClick && hasNextDate && (
            <Button
              onClick={() => {
                onOrderClick(nextAvailableDate)
              }}
              className="bg-black text-white hover:bg-black/90 border-2 border-black shadow-brutal font-black text-xs sm:text-sm px-3 sm:px-4 py-2 h-auto w-full sm:w-auto shrink-0"
            >
              ЗАКАЗАТЬ!
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Case: No orders, show "no food" message
  return (
    <div className="bg-gray-100 rounded-xl border-2 border-dashed border-black shadow-brutal p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal shrink-0">
            <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5px]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-black text-black leading-tight mb-1">
              У ВАС ПОКА ЧТО НЕТ ЕДЫ!
            </h3>
          </div>
        </div>
        {onOrderClick && hasNextDate && (
          <Button
            onClick={() => {
              onOrderClick(nextAvailableDate)
            }}
            className="bg-black text-white hover:bg-black/90 border-2 border-black shadow-brutal font-black text-xs sm:text-sm px-3 sm:px-4 py-2 h-auto w-full sm:w-auto shrink-0"
          >
            ЗАКАЗАТЬ НА БЛИЖАЙШУЮ ДАТУ!
          </Button>
        )}
      </div>
    </div>
  )
}

