"use client"

import { Truck, UtensilsCrossed, CalendarClock, Hourglass, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Order } from "@/lib/types"
import { addDays, startOfDay, isSameDay, isAfter, isBefore, format } from "date-fns"
import { ru } from "date-fns/locale"

interface DailyStatusProps {
  orders: Order[]
  availableDates?: Date[] // Array of available delivery dates
  onOrderClick?: (date: Date) => void // Now accepts the selected date
  onFoodCardClick?: () => void
  isAuthenticated?: boolean // Flag to determine if user is authenticated
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

// Helper: Format date with day of week for replenishment UI (e.g., "14 ЯНВАРЯ (СР)")
const formatDateWithDayOfWeek = (date: Date): string => {
  const months = [
    "ЯНВАРЯ",
    "ФЕВРАЛЯ",
    "МАРТА",
    "АПРЕЛЯ",
    "МАЯ",
    "ИЮНЯ",
    "ИЮЛЯ",
    "АВГУСТА",
    "СЕНТЯБРЯ",
    "ОКТЯБРЯ",
    "НОЯБРЯ",
    "ДЕКАБРЯ",
  ]
  const dayAbbr = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]
  return `${date.getDate()} ${months[date.getMonth()]} (${dayAbbr[date.getDay()]})`
}

// Helper: Format short date with day of week for button (e.g., "14 ЯНВ (СР)")
const formatShortDateWithDayOfWeek = (date: Date): string => {
  const months = ["ЯНВ", "ФЕВ", "МАР", "АПР", "МАЯ", "ИЮН", "ИЮЛ", "АВГ", "СЕН", "ОКТ", "НОЯ", "ДЕК"]
  const dayAbbr = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]
  return `${date.getDate()} ${months[date.getMonth()]} (${dayAbbr[date.getDay()]})`
}

// Helper: Check if there's an order for a specific date
const hasOrderForDate = (orders: Order[], date: Date): boolean => {
  const checkDate = startOfDay(date)

  return orders.some((order) => {
    const orderDate = startOfDay(new Date(order.startDate))
    return isSameDay(orderDate, checkDate)
  })
}

// Helper: Find next available delivery date (prefer Sunday if today is empty, but skip if already ordered)
const findNextAvailableDate = (availableDates?: Date[], orders: Order[] = []): Date | null => {
  if (!availableDates || availableDates.length === 0) {
    return null
  }

  const today = startOfDay(new Date())

  // If today is empty, prefer Sunday (day 0) for delivery
  // First, try to find the next Sunday that doesn't have an order yet
  const nextSunday = availableDates.find((date) => {
    const checkDate = startOfDay(date)
    const isSunday = checkDate.getDay() === 0
    const isFutureOrToday = isSameDay(checkDate, today) || isAfter(checkDate, today)
    const hasNoOrder = !hasOrderForDate(orders, checkDate)
    return isSunday && isFutureOrToday && hasNoOrder
  })

  if (nextSunday) {
    return startOfDay(nextSunday)
  }

  // If no free Sunday found, find the first available date that is >= today and has no order
  const nextDate = availableDates.find((date) => {
    const checkDate = startOfDay(date)
    const isFutureOrToday = isSameDay(checkDate, today) || isAfter(checkDate, today)
    const hasNoOrder = !hasOrderForDate(orders, checkDate)
    return isFutureOrToday && hasNoOrder
  })

  return nextDate ? startOfDay(nextDate) : null
}

/**
 * Calculate Replenishment Date based on food streak logic
 * Golden Rule: Food delivered on Day X covers meals for Day X+1 and Day X+2
 * 
 * @param orders - Array of user orders
 * @param availableDates - Array of available delivery dates
 * @returns Object with targetDate and lastEatingDay (or null if no food streak)
 */
const calculateReplenishmentDate = (
  orders: Order[],
  availableDates?: Date[]
): { targetDate: Date | null; lastEatingDay: Date | null; hasGap: boolean } => {
  const today = startOfDay(new Date())

  // Step 1: Map all orders to their "Eating Days"
  // Order with startDate: Day X provides food for Day X+1 and Day X+2
  const eatingDays = new Set<number>()

  orders.forEach((order) => {
    const deliveryDate = startOfDay(new Date(order.startDate))
    const day1 = startOfDay(addDays(deliveryDate, 1))
    const day2 = startOfDay(addDays(deliveryDate, 2))

    // Only consider future or today dates
    if (isSameDay(day1, today) || isAfter(day1, today)) {
      eatingDays.add(day1.getTime())
    }
    if (isSameDay(day2, today) || isAfter(day2, today)) {
      eatingDays.add(day2.getTime())
    }
  })

  if (eatingDays.size === 0) {
    // Scenario B: No food / Gap
    const nearestDate = availableDates
      ? availableDates
          .map((d) => startOfDay(d))
          .find((date) => isSameDay(date, today) || isAfter(date, today))
      : null
    return {
      targetDate: nearestDate,
      lastEatingDay: null,
      hasGap: true,
    }
  }

  // Step 2: Find the continuous streak starting from today
  const sortedEatingDays = Array.from(eatingDays)
    .map((time) => new Date(time))
    .sort((a, b) => a.getTime() - b.getTime())

  // Check if today is in the streak
  const todayInStreak = sortedEatingDays.some((date) => isSameDay(date, today))
  if (!todayInStreak) {
    // Gap detected - no food today
    const nearestDate = availableDates
      ? availableDates
          .map((d) => startOfDay(d))
          .find((date) => isSameDay(date, today) || isAfter(date, today))
      : null
    return {
      targetDate: nearestDate,
      lastEatingDay: null,
      hasGap: true,
    }
  }

  // Step 3: Find the last consecutive eating day starting from today
  let lastEatingDay: Date | null = null
  let expectedNextDay = today

  for (const eatingDay of sortedEatingDays) {
    // Check if this eating day is part of the continuous streak
    if (isSameDay(eatingDay, expectedNextDay)) {
      lastEatingDay = eatingDay
      expectedNextDay = addDays(eatingDay, 1) // Next day in streak should be tomorrow
    } else if (isAfter(eatingDay, expectedNextDay)) {
      // Gap found in streak - we expected a day but got a later one
      break
    }
    // If eatingDay is before expectedNextDay, skip it (shouldn't happen with sorted array)
  }

  if (!lastEatingDay) {
    // Should not happen, but fallback
    const nearestDate = availableDates
      ? availableDates
          .map((d) => startOfDay(d))
          .find((date) => isSameDay(date, today) || isAfter(date, today))
      : null
    return {
      targetDate: nearestDate,
      lastEatingDay: null,
      hasGap: true,
    }
  }

  // Step 4: Determine Target Delivery Date
  // Scenario A: TargetDate = LastEatingDay (delivery must be on the same day as last eating day)
  let targetDate = startOfDay(lastEatingDay)

  // Validate against availableDates
  if (availableDates && availableDates.length > 0) {
    const normalizedAvailableDates = availableDates.map((d) => startOfDay(d))
    const isTargetAvailable = normalizedAvailableDates.some((date) => isSameDay(date, targetDate))

    if (!isTargetAvailable) {
      // Target date is not available (holiday/Saturday), find next possible date
      const nextAvailable = normalizedAvailableDates.find(
        (date) => isSameDay(date, targetDate) || isAfter(date, targetDate)
      )
      if (nextAvailable) {
        targetDate = nextAvailable
      } else {
        // No available date after target, use nearest from today
        const nearestDate = normalizedAvailableDates.find(
          (date) => isSameDay(date, today) || isAfter(date, today)
        )
        if (nearestDate) {
          targetDate = nearestDate
        }
      }
    }
  }

  return {
    targetDate,
    lastEatingDay,
    hasGap: false,
  }
}

export function DailyStatus({
  orders,
  availableDates,
  onOrderClick,
  onFoodCardClick,
  isAuthenticated = false,
}: DailyStatusProps) {
  const today = startOfDay(new Date())

  // Check if today is a delivery day (order start date)
  const hasDeliveryToday = orders.some((order) => {
    const deliveryDate = startOfDay(new Date(order.startDate))
    return isSameDay(deliveryDate, today)
  })

  // Check if today has food (day1 or day2 after delivery)
  const hasFoodToday = orders.some((order) => {
    const deliveryDate = startOfDay(new Date(order.startDate))
    const day1 = startOfDay(addDays(deliveryDate, 1))
    const day2 = startOfDay(addDays(deliveryDate, 2))
    return isSameDay(day1, today) || isSameDay(day2, today)
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

  // Empty day logic - Different for authenticated vs guest users
  if (isAuthenticated) {
    // AUTHENTICATED USER LOGIC: Replenishment Logic
    const { targetDate, lastEatingDay, hasGap } = calculateReplenishmentDate(orders, availableDates)

    if (lastEatingDay && !hasGap) {
      // State: Food Streak Active
      // User has food and it will end on lastEatingDay
      return (
        <div className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal shrink-0">
                <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#9D00FF] stroke-[2.5px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-black text-black leading-tight mb-1">
                  ВАШ ЗАПАС ЕДЫ ЗАКАНЧИВАЕТСЯ {formatDateWithDayOfWeek(lastEatingDay)}.
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                  Оформите доставку на этот день, чтобы обеспечить питание на следующие 2 дня.
                </p>
              </div>
            </div>
            {onOrderClick && targetDate && (
              <Button
                onClick={() => {
                  onOrderClick(targetDate)
                }}
                className="bg-[#FFEA00] text-black hover:bg-[#FFEA00]/90 border-2 border-black shadow-brutal font-black text-xs sm:text-sm px-3 sm:px-4 py-2 h-auto w-full sm:w-auto shrink-0"
              >
                СДЕЛАТЬ ЗАКАЗ
              </Button>
            )}
          </div>
        </div>
      )
    } else {
      // State: No Food / Empty
      const nearestDate = targetDate || findNextAvailableDate(availableDates, orders)
      return (
        <div className="bg-gray-100 rounded-xl border-2 border-dashed border-black shadow-brutal p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal shrink-0">
                <CalendarClock className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5px]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-black text-black leading-tight mb-1">
                  ВАШ ХОЛОДИЛЬНИК ПУСТ.
                </h3>
                {nearestDate && (
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Ближайшая доставка: {formatDateWithDayOfWeek(nearestDate)}
                  </p>
                )}
              </div>
            </div>
            {onOrderClick && nearestDate && (
              <Button
                onClick={() => {
                  onOrderClick(nearestDate)
                }}
                className="bg-black text-white hover:bg-black/90 border-2 border-black shadow-brutal font-black text-xs sm:text-sm px-3 sm:px-4 py-2 h-auto w-full sm:w-auto shrink-0"
              >
                ЗАКАЗАТЬ НА {formatShortDateWithDayOfWeek(nearestDate)}
              </Button>
            )}
          </div>
        </div>
      )
    }
  }

  // GUEST USER LOGIC: Original logic (backward compatible)
  const hasAnyOrders = orders.length > 0

  // If there are orders, find the last day when food will be available (deliveryDate + 2 days)
  let lastFoodDate: Date | null = null
  if (hasAnyOrders) {
    orders.forEach((order) => {
      const deliveryDate = startOfDay(new Date(order.startDate))
      // Food lasts for 2 days after delivery (day 0 = delivery, day 1 and day 2 = food days)
      const foodEndDate = startOfDay(addDays(deliveryDate, 2))

      // Only consider future dates
      if (isSameDay(foodEndDate, today) || isAfter(foodEndDate, today)) {
        if (!lastFoodDate || isAfter(foodEndDate, lastFoodDate)) {
          lastFoodDate = foodEndDate
        }
      }
    })
  }

  // Find next available date for ordering
  const nextAvailableDate = findNextAvailableDate(availableDates, orders)

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
          {onOrderClick && (
            <Button
              onClick={() => {
                if (nextAvailableDate) {
                  onOrderClick(nextAvailableDate)
                } else {
                  // If no available date, try to find any date from availableDates
                  const anyDate = availableDates?.find((date) => {
                    const checkDate = startOfDay(date)
                    return isSameDay(checkDate, today) || isAfter(checkDate, today)
                  })
                  if (anyDate) {
                    onOrderClick(startOfDay(anyDate))
                  }
                }
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
        {onOrderClick && (
          <Button
            onClick={() => {
              if (nextAvailableDate) {
                onOrderClick(nextAvailableDate)
              } else {
                // If no available date, try to find any date from availableDates
                const anyDate = availableDates?.find((date) => {
                  const checkDate = startOfDay(date)
                  return isSameDay(checkDate, today) || isAfter(checkDate, today)
                })
                if (anyDate) {
                  onOrderClick(startOfDay(anyDate))
                }
              }
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

