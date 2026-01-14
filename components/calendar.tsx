"use client"

import { useState, useEffect } from "react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfDay, addDays, getDay, startOfWeek } from "date-fns"
import { ru } from "date-fns/locale"
import { GripVertical, ChevronLeft, ChevronRight, Truck, CalendarIcon, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Order } from "@/lib/types"
import { canOrderForDate } from "@/lib/menu-utils"

interface CalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  orders?: Order[]
  onMoveOrder?: (fromDate: Date, toDate: Date) => void
  onDateClick?: (date: Date) => void
}

export function Calendar({ orders = [], onDateClick, onSelectDate, onMoveOrder, selectedDate: propSelectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  useEffect(() => {
    console.log("📅 Calendar: получено заказов:", orders.length)
    if (orders.length > 0) {
      console.log("📅 Список заказов в календаре:", orders.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        startDate: o.startDate,
        orderStatus: o.orderStatus,
      })))
    }
  }, [orders])

  // Avoid hydration mismatch by not rendering date-dependent content on server
  if (!isMounted) {
    return (
        <div className="space-y-4">
            <div className="bg-card rounded-3xl border shadow-sm p-4 h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        </div>
    )
  }
  
  const handleDateClick = (date: Date) => {
      // Всегда вызываем onDateClick, чтобы родительский компонент мог показать сообщение
      // если нужно (например, когда есть еда, но нельзя заказать доставку)
      if (onDateClick) onDateClick(date)
      
      // Выбираем дату только если можно заказать или есть существующий заказ
      const order = getOrderForDate(date)
      const canOrder = canOrderForDate(date)
      if (order || canOrder) {
        if (onSelectDate) onSelectDate(date)
      }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  
  // Находим начало недели для первого дня месяца (понедельник)
  // startOfWeek с опцией weekStartsOn: 1 означает, что неделя начинается с понедельника
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfMonth(currentMonth)
  
  // Создаем массив всех дней календаря (включая дни предыдущего месяца для выравнивания)
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const getOrderForDate = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    const order = orders.find((order) => {
      const orderDate = new Date(order.startDate)
      orderDate.setHours(0, 0, 0, 0)
      const match = checkDate.getTime() === orderDate.getTime()
      if (match) {
        console.log(`🔍 getOrderForDate: найден заказ #${order.id} на ${format(date, 'yyyy-MM-dd')}`, {
          orderStartDate: order.startDate,
          checkDate: format(checkDate, 'yyyy-MM-dd'),
          orderDate: format(orderDate, 'yyyy-MM-dd'),
        })
      }
      return match
    })
    
    return order
  }
  
  // Check if there's a delivery (order start date) on this date
  const hasDeliveryForDate = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    const result = orders.some(order => {
      const deliveryDate = new Date(order.startDate)
      deliveryDate.setHours(0, 0, 0, 0)
      const match = checkDate.getTime() === deliveryDate.getTime()
      if (match) {
        console.log(`🚚 Доставка найдена на ${format(date, 'yyyy-MM-dd')}: заказ #${order.id}`)
      }
      return match
    })
    
    return result
  }

  // Check if there's food (eating days: day1 and day2 after delivery)
  const hasFoodForDate = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    return orders.some(order => {
      const deliveryDate = new Date(order.startDate)
      deliveryDate.setHours(0, 0, 0, 0)
      
      const day1 = new Date(deliveryDate)
      day1.setDate(day1.getDate() + 1)
      
      const day2 = new Date(deliveryDate)
      day2.setDate(day2.getDate() + 2)
      
      return checkDate.getTime() === day1.getTime() || checkDate.getTime() === day2.getTime()
    })
  }

  // Check if this date is the last day of food (day2) for any order
  const isLastDayOfAnyOrder = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    return orders.some(order => {
      const deliveryDate = new Date(order.startDate)
      deliveryDate.setHours(0, 0, 0, 0)
      
      // day2 is the last eating day for this order
      const day2 = new Date(deliveryDate)
      day2.setDate(day2.getDate() + 2)
      day2.setHours(0, 0, 0, 0)
      
      return checkDate.getTime() === day2.getTime()
    })
  }

  // Check if there's food on the next day (chain continues without gap)
  // Plus button should show if there's NO food on next day (gap exists)
  const hasNextOrder = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    // PRIORITY 1: Check if there's delivery on this day (new order continues chain)
    if (hasDeliveryForDate(date)) {
      return true
    }
    
    // PRIORITY 2: Check if there's FOOD on the next day (no gap - chain continues)
    // If there's food on next day, the chain continues. If no food, there's a gap and plus should show
    const nextDay = new Date(checkDate)
    nextDay.setDate(nextDay.getDate() + 1)
    nextDay.setHours(0, 0, 0, 0)
    
    return hasFoodForDate(nextDay)
  }

  // Find the latest date where yellow plus should show (for wiggle animation)
  const getLatestPlusDate = () => {
    let latestDate: Date | null = null
    
    calendarDays.forEach(date => {
      const isCurrentMonth = isSameMonth(date, currentMonth)
      const hasFood = hasFoodForDate(date)
      const isLastDayOfOrder = isLastDayOfAnyOrder(date)
      const hasDelivery = hasDeliveryForDate(date)
      const hasNextOrderForLastDay = hasNextOrder(date)
      const shouldShowPlus = hasFood && isLastDayOfOrder && !hasDelivery && !hasNextOrderForLastDay && isCurrentMonth
      
      if (shouldShowPlus) {
        if (!latestDate || date.getTime() > latestDate.getTime()) {
          latestDate = date
        }
      }
    })
    
    return latestDate
  }
  
  const latestPlusDate = getLatestPlusDate()

  const renderDayCell = (date: Date, index: number) => {
    const isSelected = propSelectedDate ? isSameDay(date, propSelectedDate) : false
    const isCurrentMonth = isSameMonth(date, currentMonth)
    const isDateToday = isToday(date)
    const hasDelivery = hasDeliveryForDate(date)
    const hasFood = hasFoodForDate(date)
    const isLastDayOfOrder = isLastDayOfAnyOrder(date)
    const hasNextOrderForLastDay = hasNextOrder(date)
    
    // ✅ ИСПРАВЛЕНО 2026-01-14: Плюсик показывается ТОЛЬКО на последнем заказе (самом позднем)
    // CRITICAL: Yellow + button shows ONLY on last day of any order WITH food, NO delivery, and NO next order (gap exists)
    // Must have: hasFood AND isLastDayOfOrder AND !hasDelivery AND !hasNextOrderForLastDay
    const isLatestPlus = latestPlusDate && isSameDay(date, latestPlusDate)
    // ✅ ИСПРАВЛЕНО: Показываем плюсик только на самом последнем заказе
    const shouldShowYellowPlus = isLatestPlus && isCurrentMonth
    
    const canOrder = canOrderForDate(date)
    const isSaturday = getDay(date) === 6
    const isAvailableForNewOrder = canOrder && !isSaturday

    // Determine background based on food status (MASTER STATE)
    const getBackgroundClass = () => {
      if (!isCurrentMonth) return ""
      if (isSelected) return "border-2 border-black bg-[#9D00FF] text-white shadow-brutal"
      
      // PRIORITY 1: Does User Have Food Today? (YES = Purple, NO = White)
      if (hasFood) {
        // Eating days - Purple background (MASTER STATE)
        return "border-2 border-black bg-[#9D00FF] text-white shadow-brutal cursor-pointer brutal-hover"
      }
      
      // No food - White/Transparent background
      if (isAvailableForNewOrder) {
        return "hover:bg-[#FFEA00]/20 cursor-pointer"
      }
      
      return "opacity-40 cursor-not-allowed"
    }
    
    // ✅ ИСПРАВЛЕНО 2026-01-14: Более явная фиолетовая заливка для текущей даты
    const getTodayHighlight = () => {
      // Показываем только если это сегодня, нет еды, не выбрана, и это текущий месяц
      if (isDateToday && !hasFood && !isSelected && isCurrentMonth) {
        return "bg-[#9D00FF]/20 rounded-lg" // ✅ Более явная заливка (20% вместо 10%) и скругленные углы
      }
      return ""
    }

    return (
      <div
        key={date.toISOString()}
        onClick={() => isCurrentMonth && handleDateClick(date)}
        className={cn(
          "relative min-h-[3rem] sm:min-h-[4rem] flex items-center justify-center transition-all p-1",
          !isCurrentMonth && "opacity-30",
          getBackgroundClass(),
          getTodayHighlight(), // ✅ ИСПРАВЛЕНО 2026-01-14: Слабо-фиолетовая заливка для текущей даты
          !isCurrentMonth && "cursor-not-allowed",
        )}
      >
        {/* Overlay Icons (Action Layer) */}
        
        {/* Scenario A: Delivery Scheduled for Tonight */}
        {hasDelivery && isCurrentMonth && (
          // Delivery icon in corner with brutal-hover animation
          <button 
            className="absolute top-1 right-1 w-6 h-6 sm:w-7 sm:h-7 bg-white border-2 border-black rounded-lg flex items-center justify-center z-20 shadow-brutal brutal-hover cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              handleDateClick(date)
            }}
          >
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black stroke-[2.5px]" />
          </button>
        )}

        {/* Scenario B: No Delivery + Is Last Day of Food Streak + No Next Order */}
        {/* Show yellow + only if: is last day AND no delivery today AND no order continues chain */}
        {/* CRITICAL: Double-check - if hasDelivery OR hasNextOrderForLastDay, do NOT show + */}
        {shouldShowYellowPlus && (
          // Yellow Round Button with "+" (top-right corner, doesn't cover date)
          // Only the LATEST plus wiggles (last day before gap)
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (isCurrentMonth) {
                // Pass the original date to onDateClick
                // handleDateClick will handle Saturday logic and show warning, then switch to Sunday
                if (onDateClick) onDateClick(date)
                // Don't call onSelectDate here - let handleDateClick handle it after showing warning
              }
            }}
            className={cn(
              "absolute top-1 right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFEA00] border-2 border-black flex items-center justify-center z-20 shadow-brutal hover:bg-[#FFF033] transition-colors font-black btn-press",
              isLatestPlus && "animate-wiggle"
            )}
            title={
              getDay(date) === 6 
                ? "Заказать на воскресенье (доставка в воскресенье вечером, по субботам доставок нет)"
                : "Заказать на сегодня (доставка вечером)"
            }
          >
            <span className="text-lg sm:text-xl text-black leading-none">+</span>
          </button>
        )}

        {/* Content: Date Number */}
        {isCurrentMonth && (
          <>
            {hasFood ? (
              // Eating Days - White text on purple background
              <span className="text-xs sm:text-sm font-bold leading-none text-white z-10">
                {format(date, "d")}
              </span>
            ) : (
              // Empty Days - Black text on white background
              <span className={cn(
                "text-xs sm:text-sm font-bold leading-none z-10",
                !isCurrentMonth && "text-muted-foreground",
                "text-black"
              )}>
                {format(date, "d")}
              </span>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full">
      <div className="bg-white rounded-xl border-2 border-black shadow-brutal p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-secondary rounded-full h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="font-black text-base sm:text-lg uppercase tracking-tight">
            {format(currentMonth, "LLLL yyyy", { locale: ru }).toUpperCase()}
          </h2>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-secondary rounded-full h-8 w-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
            <div key={day} className="text-center text-[10px] sm:text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => renderDayCell(date, index))}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pt-4 border-t-2 border-black justify-center">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center shadow-brutal">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[2.5px]" />
                </div>
                <span className="text-xs sm:text-sm font-black text-black">Доставка</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#9D00FF] rounded-lg border-2 border-black shadow-brutal" />
                <span className="text-xs sm:text-sm font-black text-black">Есть еда</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#9D00FF] rounded-lg border-2 border-black relative flex items-center justify-center shadow-brutal">
                  <div className="absolute top-0.5 right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#FFEA00] border-2 border-black flex items-center justify-center shadow-brutal">
                    <span className="text-[10px] sm:text-xs font-black text-black leading-none">+</span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-black">Заказать, чтобы не голодать</span>
            </div>
        </div>
      </div>
    </div>
  )
}
