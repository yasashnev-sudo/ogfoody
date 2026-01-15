"use client"

import { useState } from "react"
import {
  Package,
  Users,
  Clock,
  CalendarIcon,
  Copy,
  AlertTriangle,
  CreditCard,
  Star,
  MessageSquare,
  AlertCircle,
  RotateCcw,
  Loader2,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { isMealAvailable, isExtraAvailable } from "@/lib/meals-data"
import type { Order, UserProfile, Review, DayMeals, BreakfastSelection, FullMealSelection, PortionSize } from "@/lib/types"
import { getMealWeight } from "@/lib/types"

interface OrderHistoryProps {
  orders: Order[]
  onCancelOrder: (order: Order) => void // ✅ ИСПРАВЛЕНО: передаем объект Order, а не ID
  onRepeatOrder: (order: Order, targetDate: Date) => Promise<void> // ✅ ИЗМЕНЕНО: теперь async
  onPayOrder: (order: Order, total: number) => void
  onReviewOrder: (order: Order) => void
  availableDates: Date[]
  userProfile: UserProfile | null
  reviews: Review[]
}

const formatDisplayDate = (date: Date): string => {
  const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
  return `${date.getDate()} ${months[date.getMonth()]}`
}

const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
}

const toDate = (value: Date | string): Date => {
  if (value instanceof Date) return value
  if (typeof value === "string") {
    if (value.includes("T")) return new Date(value)
    if (value.includes("-")) {
      const [year, month, day] = value.split("-").map(Number)
      return new Date(year, month - 1, day)
    }
  }
  return new Date(value)
}

const ensureBreakfastStructure = (breakfast: BreakfastSelection | null | undefined): BreakfastSelection => {
  if (!breakfast) return { dish: null }
  return { dish: breakfast.dish ?? null }
}

const ensureFullMealStructure = (meal: FullMealSelection | null | undefined): FullMealSelection => {
  if (!meal) return { salad: null, soup: null, main: null }
  return {
    salad: meal.salad ?? null,
    soup: meal.soup ?? null,
    main: meal.main ?? null,
  }
}

const checkOrderAvailability = (order: Order): { available: boolean; unavailableItems: string[] } => {
  const unavailableItems: string[] = []

  order.persons.forEach((person) => {
    ;["day1", "day2"].forEach((day) => {
      const dayMeals = person[day as "day1" | "day2"] as DayMeals
      if (!dayMeals) return

      const breakfast = ensureBreakfastStructure(dayMeals.breakfast)
      const lunch = ensureFullMealStructure(dayMeals.lunch)
      const dinner = ensureFullMealStructure(dayMeals.dinner)

      // Проверяем завтрак
      if (breakfast.dish && !isMealAvailable(breakfast.dish.name)) {
        if (!unavailableItems.includes(breakfast.dish.name)) {
          unavailableItems.push(breakfast.dish.name)
        }
      }

      // Проверяем обед
      if (lunch.salad && !isMealAvailable(lunch.salad.name)) {
        if (!unavailableItems.includes(lunch.salad.name)) unavailableItems.push(lunch.salad.name)
      }
      if (lunch.soup && !isMealAvailable(lunch.soup.name)) {
        if (!unavailableItems.includes(lunch.soup.name)) unavailableItems.push(lunch.soup.name)
      }
      if (lunch.main) {
        if (!isMealAvailable(lunch.main.name)) {
          if (!unavailableItems.includes(lunch.main.name)) unavailableItems.push(lunch.main.name)
        }
        if (lunch.main.garnish && !isMealAvailable(lunch.main.garnish.name)) {
          if (!unavailableItems.includes(lunch.main.garnish.name)) unavailableItems.push(lunch.main.garnish.name)
        }
      }

      // Проверяем ужин
      if (dinner.salad && !isMealAvailable(dinner.salad.name)) {
        if (!unavailableItems.includes(dinner.salad.name)) unavailableItems.push(dinner.salad.name)
      }
      if (dinner.soup && !isMealAvailable(dinner.soup.name)) {
        if (!unavailableItems.includes(dinner.soup.name)) unavailableItems.push(dinner.soup.name)
      }
      if (dinner.main) {
        if (!isMealAvailable(dinner.main.name)) {
          if (!unavailableItems.includes(dinner.main.name)) unavailableItems.push(dinner.main.name)
        }
        if (dinner.main.garnish && !isMealAvailable(dinner.main.garnish.name)) {
          if (!unavailableItems.includes(dinner.main.garnish.name)) unavailableItems.push(dinner.main.garnish.name)
        }
      }
    })
  })

  order.extras?.forEach((extra) => {
    if (!isExtraAvailable(extra.name)) {
      if (!unavailableItems.includes(extra.name)) {
        unavailableItems.push(extra.name)
      }
    }
  })

  return { available: unavailableItems.length === 0, unavailableItems }
}

export function OrderHistory({
  orders,
  onCancelOrder,
  onRepeatOrder,
  onPayOrder,
  onReviewOrder,
  availableDates,
  userProfile,
  reviews,
}: OrderHistoryProps) {
  const [repeatMenuOpen, setRepeatMenuOpen] = useState<string | null>(null)
  const [cancelConfirmOrder, setCancelConfirmOrder] = useState<Order | null>(null)
  // ✅ НОВОЕ: Loading state для кнопки "Повторить"
  const [repeatLoading, setRepeatLoading] = useState<string | null>(null)

  const activeOrders = orders.filter((o) => o.orderStatus !== "cancelled")

  const sortedOrders = [...activeOrders].sort((a, b) => {
    return toDate(b.startDate).getTime() - toDate(a.startDate).getTime()
  })

  const calculateOrderTotal = (order: Order) => {
    // Используем total из заказа, если он есть
    if (order.total && typeof order.total === "number" && order.total > 0) {
      return order.total
    }
    
    // Иначе вычисляем вручную
    let total = 0
    order.persons.forEach((person) => {
      ;["day1", "day2"].forEach((day) => {
        const dayMeals = person[day as "day1" | "day2"] as DayMeals
        if (!dayMeals) return

        const breakfast = ensureBreakfastStructure(dayMeals.breakfast)
        const lunch = ensureFullMealStructure(dayMeals.lunch)
        const dinner = ensureFullMealStructure(dayMeals.dinner)

        // Завтрак
        if (breakfast.dish && breakfast.dish.prices) {
          const portion = breakfast.dish.portion || "single"
          if (portion === "medium" && breakfast.dish.prices.medium) {
            total += breakfast.dish.prices.medium
          } else if (portion === "large" && breakfast.dish.prices.large) {
            total += breakfast.dish.prices.large
          } else {
            total += breakfast.dish.prices.single || 0
          }
        }

        // Обед
        if (lunch.salad && lunch.salad.prices) {
          const portion = lunch.salad.portion || "single"
          if (portion === "medium" && lunch.salad.prices.medium) {
            total += lunch.salad.prices.medium
          } else if (portion === "large" && lunch.salad.prices.large) {
            total += lunch.salad.prices.large
          } else {
            total += lunch.salad.prices.single || 0
          }
        }
        if (lunch.soup && lunch.soup.prices) {
          const portion = lunch.soup.portion || "single"
          if (portion === "medium" && lunch.soup.prices.medium) {
            total += lunch.soup.prices.medium
          } else if (portion === "large" && lunch.soup.prices.large) {
            total += lunch.soup.prices.large
          } else {
            total += lunch.soup.prices.single || 0
          }
        }
        if (lunch.main && lunch.main.prices) {
          const portion = lunch.main.portion || "single"
          if (portion === "medium" && lunch.main.prices.medium) {
            total += lunch.main.prices.medium
          } else if (portion === "large" && lunch.main.prices.large) {
            total += lunch.main.prices.large
          } else {
            total += lunch.main.prices.single || 0
          }
          if (lunch.main.garnish) {
            if (!lunch.main.garnish.prices) {
              console.warn("⚠️ lunch.main.garnish.prices is undefined", lunch.main.garnish)
            } else {
              const garnishPortion = lunch.main.garnish.portion || "single"
              if (garnishPortion === "medium" && lunch.main.garnish.prices.medium) {
                total += lunch.main.garnish.prices.medium
              } else if (garnishPortion === "large" && lunch.main.garnish.prices.large) {
                total += lunch.main.garnish.prices.large
              } else {
                total += lunch.main.garnish.prices.single || 0
              }
            }
          }
        }

        // Ужин
        if (dinner.salad && dinner.salad.prices) {
          const portion = dinner.salad.portion || "single"
          if (portion === "medium" && dinner.salad.prices.medium) {
            total += dinner.salad.prices.medium
          } else if (portion === "large" && dinner.salad.prices.large) {
            total += dinner.salad.prices.large
          } else {
            total += dinner.salad.prices.single || 0
          }
        }
        if (dinner.soup && dinner.soup.prices) {
          const portion = dinner.soup.portion || "single"
          if (portion === "medium" && dinner.soup.prices.medium) {
            total += dinner.soup.prices.medium
          } else if (portion === "large" && dinner.soup.prices.large) {
            total += dinner.soup.prices.large
          } else {
            total += dinner.soup.prices.single || 0
          }
        }
        if (dinner.main && dinner.main.prices) {
          const portion = dinner.main.portion || "single"
          if (portion === "medium" && dinner.main.prices.medium) {
            total += dinner.main.prices.medium
          } else if (portion === "large" && dinner.main.prices.large) {
            total += dinner.main.prices.large
          } else {
            total += dinner.main.prices.single || 0
          }
          if (dinner.main.garnish) {
            if (!dinner.main.garnish.prices) {
              console.warn("⚠️ dinner.main.garnish.prices is undefined", dinner.main.garnish)
            } else {
              const garnishPortion = dinner.main.garnish.portion || "single"
              if (garnishPortion === "medium" && dinner.main.garnish.prices.medium) {
                total += dinner.main.garnish.prices.medium
              } else if (garnishPortion === "large" && dinner.main.garnish.prices.large) {
                total += dinner.main.garnish.prices.large
              } else {
                total += dinner.main.garnish.prices.single || 0
              }
            }
          }
        }
      })
    })
    order.extras?.forEach((extra) => {
      total += extra.price * extra.quantity
    })
    return total
  }

  const canCancelOrder = (startDate: Date | string, order?: Order) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const orderDate = toDate(startDate)
    orderDate.setHours(0, 0, 0, 0)
    
    // ✅ ИЗМЕНЕНО 2026-01-13: Клиент НЕ может отменить заказ на сегодняшний день
    // Можно отменить только заказы на будущие даты (завтра и позже)
    const dateIsValid = orderDate.getTime() > today.getTime()
    
    return dateIsValid
  }

  const isTodayOrder = (startDate: Date | string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const orderDate = toDate(startDate)
    orderDate.setHours(0, 0, 0, 0)
    
    return orderDate.getTime() === today.getTime()
  }

  const handleContactSupport = (orderNumber?: string) => {
    const message = orderNumber 
      ? `У меня вопрос по заказу №${orderNumber}`
      : `У меня вопрос по заказу`
    
    // Открываем WhatsApp с предзаполненным сообщением
    const whatsappUrl = `https://wa.me/74951234567?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const canReviewOrder = (order: Order, orderKey: string) => {
    // Проверяем, есть ли уже отзыв для этого заказа
    // Используем приведение к строке для надежного сравнения
    const hasReview = reviews.some((r) => String(r.orderId) === String(orderKey))
    if (hasReview) {
      return false
    }
    
    // ✅ ИСПРАВЛЕНО 2026-01-14: Можно оставить отзыв после первого дня доставки (более раннее разрешение)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const orderDate = toDate(order.startDate)
    orderDate.setHours(0, 0, 0, 0)
    
    // Можно оставить отзыв, если дата доставки уже прошла (заказ был сегодня или раньше)
    // Это позволяет оставлять отзыв уже после первого дня доставки
    return orderDate.getTime() <= today.getTime()
  }

  const getOrderReview = (orderKey: string) => {
    // Используем приведение к строке для надежного сравнения
    return reviews.find((r) => String(r.orderId) === String(orderKey))
  }

  const getFreeDates = () => {
    const orderDates = new Set(activeOrders.map((o) => formatDateKey(toDate(o.startDate))))
    return availableDates.filter((d) => !orderDates.has(formatDateKey(d)))
  }

  const handleCancelClick = (order: Order) => {
    setCancelConfirmOrder(order)
  }

  const confirmCancelPaidOrder = () => {
    if (cancelConfirmOrder && cancelConfirmOrder.id) {
      onCancelOrder(cancelConfirmOrder) // ✅ ИСПРАВЛЕНО: передаем объект Order, а не только ID
      setCancelConfirmOrder(null)
      // Warning dialog will be shown by handleCancelOrder in parent component
    }
  }

  if (activeOrders.length === 0) {
    return (
      <div className="px-4">
        <div className="bg-card rounded-xl p-8 shadow-sm border border-border text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">У вас пока нет заказов</p>
          <p className="text-sm text-muted-foreground mt-1">Перейдите в календарь, чтобы оформить первый заказ</p>
        </div>
      </div>
    )
  }

  const freeDates = getFreeDates()

  const renderMealInfo = (dayMeals: DayMeals) => {
    const breakfast = ensureBreakfastStructure(dayMeals.breakfast)
    const lunch = ensureFullMealStructure(dayMeals.lunch)
    const dinner = ensureFullMealStructure(dayMeals.dinner)

    const formatDish = (dish: any, withWeight: boolean = true) => {
      if (!dish) return null
      const portion = dish.portion || "single"
      const weight = withWeight && dish.weights ? getMealWeight(dish, portion) : 0
      return weight > 0 ? `${dish.name} (${weight}г)` : dish.name
    }

    const formatMeal = (items: string[]) => items.filter(Boolean).join(", ")

    return (
      <div className="space-y-1.5 text-xs">
        {breakfast.dish && (
          <div>
            <span className="font-bold">🌅 </span>
            {formatDish(breakfast.dish)}
          </div>
        )}
        {(lunch.salad || lunch.soup || lunch.main) && (
          <div>
            <span className="font-bold">☀️ </span>
            {formatMeal([
              lunch.salad ? formatDish(lunch.salad, false) : null,
              lunch.soup ? formatDish(lunch.soup, false) : null,
              lunch.main ? (
                formatDish(lunch.main) + 
                (lunch.main.garnish ? ` + ${formatDish(lunch.main.garnish)}` : '')
              ) : null
            ])}
          </div>
        )}
        {(dinner.salad || dinner.soup || dinner.main) && (
          <div>
            <span className="font-bold">🌙 </span>
            {formatMeal([
              dinner.salad ? formatDish(dinner.salad, false) : null,
              dinner.soup ? formatDish(dinner.soup, false) : null,
              dinner.main ? (
                formatDish(dinner.main) + 
                (dinner.main.garnish ? ` + ${formatDish(dinner.main.garnish)}` : '')
              ) : null
            ])}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="px-4 pb-6">
      {cancelConfirmOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-background rounded-xl p-5 mx-4 max-w-sm w-full shadow-xl animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg">Отменить заказ?</h3>
            </div>
            {cancelConfirmOrder.paid && cancelConfirmOrder.paymentMethod !== "cash" ? (
              <>
                <p className="text-sm text-muted-foreground mb-2">Вы уверены, что хотите отменить оплаченный заказ?</p>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Деньги вернутся на карту в течение 3 рабочих дней.
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                Вы уверены, что хотите отменить этот заказ? Это действие нельзя отменить.
              </p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent border-2 border-black font-bold" onClick={() => setCancelConfirmOrder(null)}>
                Не отменять
              </Button>
              <Button className="flex-1 bg-gray-200 hover:bg-gray-300 border-2 border-black text-black font-bold" onClick={confirmCancelPaidOrder}>
                Отменить заказ
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sortedOrders.map((order) => {
          const total = calculateOrderTotal(order)
          const orderDate = toDate(order.startDate)
          // Проверяем, можно ли отменить заказ
          const canCancel = canCancelOrder(order.startDate, order)
          const day2Date = new Date(orderDate)
          day2Date.setDate(day2Date.getDate() + 1)
          const orderKey = formatDateKey(orderDate)
          // ✅ ИСПРАВЛЕНО: Уникальный key с ID заказа или timestamp
          const uniqueKey = order.id ? `order-${order.id}` : `${orderKey}-${order.startDate}`
          const { available: allItemsAvailable, unavailableItems } = checkOrderAvailability(order)
          const orderReview = getOrderReview(orderKey)
          const canReview = canReviewOrder(order, orderKey)
          const canEdit = !order.paid || order.paymentMethod === "cash"

          return (
            <div key={uniqueKey} className="bg-white rounded-xl p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <div>
                    <div className="font-black text-sm">{formatDisplayDate(orderDate)}</div>
                    <div className="text-[10px] text-gray-600 font-bold">
                      {order.orderNumber ? `№ ${order.orderNumber}` : "Набор на 2 дня"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 text-[11px] font-bold text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {order.deliveryTime}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {order.persons.length}
                </div>
              </div>
              
              {/* Информация об оплате, доставке и баллах */}
              {(order.paid || (order.loyaltyPointsUsed && order.loyaltyPointsUsed > 0) || (order.loyaltyPointsEarned && order.loyaltyPointsEarned > 0) || (order.deliveryFee !== undefined && order.deliveryFee !== null) || (order.promoCode && order.promoDiscount !== undefined && order.promoDiscount > 0)) && (
                <div className="bg-purple-50 rounded-lg p-2 border border-black mb-2 text-[11px] space-y-1">
                  {order.paid && (
                    <div className="flex items-center gap-1">
                      <span className="font-bold">
                        {order.paymentMethod === 'card' && '💳 Карта'}
                        {order.paymentMethod === 'sbp' && '📱 СБП'}
                        {order.paymentMethod === 'cash' && '💵 Наличные'}
                        {order.paymentMethod === 'online' && '🌐 Онлайн'}
                        {!order.paymentMethod && '✓ Оплачен'}
                      </span>
                    </div>
                  )}
                  {order.deliveryFee !== undefined && order.deliveryFee !== null && (
                    <div className="flex items-center justify-between" data-test="delivery-fee-block">
                      <span className="text-orange-700">🚚 Доставка:</span>
                      <span className="font-black text-orange-700">
                        {order.deliveryFee > 0 ? `+${order.deliveryFee}₽` : 'Бесплатно'}
                      </span>
                    </div>
                  )}
                  {order.promoCode && order.promoDiscount !== undefined && order.promoDiscount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#9D00FF]">🏷️ Промокод {order.promoCode}:</span>
                      <span className="font-black text-[#9D00FF]">
                        -{order.promoDiscount}₽
                      </span>
                    </div>
                  )}
                  {order.loyaltyPointsUsed !== undefined && order.loyaltyPointsUsed > 0 && (
                    <div className="flex items-center justify-between" data-test="loyalty-used-block">
                      <span className="text-purple-700">Списано:</span>
                      <span className="font-black text-purple-700">-{order.loyaltyPointsUsed}₽</span>
                    </div>
                  )}
                  {order.loyaltyPointsEarned && order.loyaltyPointsEarned > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-green-700">Начислено:</span>
                      <span className="font-black text-green-700">+{order.loyaltyPointsEarned}🎁</span>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {order.persons.map((person, index) => (
                  <div key={person.id} className="bg-gray-50 rounded-lg p-2 border border-black">
                    <div className="text-[10px] font-black text-gray-600 mb-1.5">
                      ПЕРСОНА {index + 1}
                    </div>
                    <div className="space-y-2">
                      {["day1", "day2"].map((day, dayIndex) => {
                        const dayMeals = person[day as "day1" | "day2"] as DayMeals
                        if (!dayMeals) return null

                        const breakfast = ensureBreakfastStructure(dayMeals.breakfast)
                        const lunch = ensureFullMealStructure(dayMeals.lunch)
                        const dinner = ensureFullMealStructure(dayMeals.dinner)

                        const hasMeals =
                          breakfast.dish ||
                          lunch.salad ||
                          lunch.soup ||
                          lunch.main ||
                          dinner.salad ||
                          dinner.soup ||
                          dinner.main

                        if (!hasMeals) return null

                        const displayDate = dayIndex === 0 ? orderDate : day2Date

                        return (
                          <div key={day} className="bg-white rounded p-2 border border-gray-300">
                            <div className="font-bold text-[10px] mb-1 text-gray-500">
                              День {dayIndex + 1} · {formatDisplayDate(displayDate)}
                            </div>
                            {renderMealInfo(dayMeals)}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {order.extras && order.extras.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-2 border border-black">
                    <div className="text-[10px] font-black text-gray-600 mb-1">ДОПОЛНЕНИЯ</div>
                    <div className="flex flex-wrap gap-1">
                      {order.extras.map((extra) => (
                        <span key={extra.name} className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-black">
                          {extra.name} ×{extra.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#9D00FF] rounded-lg p-2 mt-2 border-2 border-black flex items-center justify-between">
                <span className="font-black text-white text-xs">ИТОГО:</span>
                <span className="text-xl font-black text-white">{total} ₽</span>
              </div>

              {orderReview ? (
                <div className="mt-2">
                  <div className="bg-amber-50 rounded-lg p-2 border border-black text-xs">
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= orderReview.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {orderReview.text && <p className="text-[11px] text-gray-700">{orderReview.text}</p>}
                  </div>
                </div>
              ) : canReview ? (
                <div className="mt-2">
                  <Button
                    size="sm"
                    className="w-full bg-amber-400 hover:bg-amber-500 border border-black text-black font-black text-xs h-8"
                    onClick={() => onReviewOrder(order)}
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    ОТЗЫВ
                  </Button>
                </div>
              ) : null}

              {!order.paid && (
                <div className="mt-2">
                  <Button
                    onClick={() => onPayOrder(order, total)}
                    size="sm"
                    className="w-full bg-[#FFEA00] hover:bg-[#FFF033] border border-black text-black font-black text-xs h-8"
                  >
                    💳 ОПЛАТИТЬ {total} ₽
                  </Button>
                </div>
              )}

              <div className="mt-2 flex gap-2">
                {freeDates.length > 0 && (
                  <div className="relative flex-1">
                    <Button
                      size="sm"
                      onClick={() => setRepeatMenuOpen(repeatMenuOpen === orderKey ? null : orderKey)}
                      className="w-full bg-white hover:bg-gray-50 border border-black text-black font-bold text-xs h-8"
                      disabled={repeatLoading === orderKey}
                      data-testid="repeat-order-btn"
                    >
                      {repeatLoading === orderKey ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Загрузка...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3 h-3 mr-1" />
                          ПОВТОРИТЬ ЗАКАЗ
                        </>
                      )}
                    </Button>

                    {repeatMenuOpen === orderKey && (
                      <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border-2 border-black rounded-lg shadow-lg p-3 z-10 min-w-[280px] max-w-[95vw]">
                        <div className="text-[10px] font-black mb-2 text-gray-600">📅 ВЫБЕРИТЕ ДАТУ ДОСТАВКИ:</div>
                        {!allItemsAvailable && (
                          <div className="mb-2 p-2 bg-orange-100 rounded-lg border border-orange-500 text-[10px]">
                            <div className="flex items-start gap-1">
                              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="font-bold">Внимание!</div>
                                <div className="text-orange-700">Недоступные позиции будут пропущены</div>
                              </div>
                            </div>
                          </div>
                        )}
                        {freeDates.length === 0 ? (
                          <div className="text-[10px] text-gray-500 text-center py-2">
                            Нет доступных дат
                          </div>
                        ) : (
                          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {freeDates.map((date) => {
                              const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
                              const dayName = dayNames[date.getDay()]
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              const dateTime = new Date(date)
                              dateTime.setHours(0, 0, 0, 0)
                              const daysFromNow = Math.floor((dateTime.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                              
                              // Определяем тип даты для визуального выделения
                              const isToday = daysFromNow === 0
                              const isTomorrow = daysFromNow === 1
                              const isThisWeek = daysFromNow >= 2 && daysFromNow <= 7
                              
                              return (
                                <button
                                  key={formatDateKey(date)}
                                  className={`flex-shrink-0 flex flex-col items-center justify-center w-[70px] h-[80px] rounded-lg border-2 transition-all font-bold ${
                                    isToday 
                                      ? 'border-[#FFEA00] bg-[#FFEA00]/20 hover:bg-[#FFEA00]/40' 
                                      : isTomorrow
                                      ? 'border-[#9D00FF] bg-[#9D00FF]/10 hover:bg-[#9D00FF]/20'
                                      : isThisWeek
                                      ? 'border-blue-500 bg-blue-50/50 hover:bg-blue-100'
                                      : 'border-gray-300 bg-white hover:bg-gray-50'
                                  } ${repeatLoading === orderKey ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                  onClick={async () => {
                                    if (repeatLoading === orderKey) return
                                    // ✅ КРИТИЧНО: Устанавливаем loading перед вызовом
                                    setRepeatLoading(orderKey)
                                    try {
                                      await onRepeatOrder(order, date)
                                    } finally {
                                      // ✅ Всегда снимаем loading даже при ошибке
                                      setRepeatLoading(null)
                                      setRepeatMenuOpen(null)
                                    }
                                  }}
                                  disabled={repeatLoading === orderKey}
                                >
                                  {/* День недели */}
                                  <span className="text-[10px] font-black uppercase text-gray-600 mb-1">
                                    {dayName}
                                  </span>
                                  
                                  {/* Число и месяц */}
                                  <span className={`text-base font-black mb-1 ${
                                    isToday || isTomorrow ? 'text-black' : 'text-gray-800'
                                  }`}>
                                    {date.getDate()}
                                  </span>
                                  
                                  {/* Месяц */}
                                  <span className="text-[9px] font-bold text-gray-500">
                                    {formatDisplayDate(date).split(' ')[1]}
                                  </span>
                                  
                                  {/* Бейдж */}
                                  {(isToday || isTomorrow || isThisWeek) && (
                                    <div className={`absolute top-1 right-1 text-[7px] px-1 py-0.5 rounded font-black ${
                                      isToday 
                                        ? 'bg-[#FFEA00] text-black' 
                                        : isTomorrow 
                                        ? 'bg-[#9D00FF] text-white'
                                        : 'bg-blue-500 text-white'
                                    }`}>
                                      {isToday ? 'СЕГОДНЯ' : isTomorrow ? 'ЗАВТРА' : `+${daysFromNow}д`}
                                    </div>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              
                {canCancel ? (
                  <Button
                    size="sm"
                    onClick={() => handleCancelClick(order)}
                    variant="outline"
                    className="flex-1 border-2 border-black text-black font-bold text-xs h-8 hover:bg-gray-100"
                  >
                    🗑️ ОТМЕНИТЬ
                  </Button>
                ) : isTodayOrder(order.startDate) ? (
                  <Button
                    size="sm"
                    onClick={() => handleContactSupport(order.orderNumber)}
                    className="flex-1 bg-green-500 hover:bg-green-600 border-2 border-black text-white font-bold text-xs h-8"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    ПОДДЕРЖКА
                  </Button>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {/* Диалог подтверждения отмены заказа */}
      <AlertDialog open={!!cancelConfirmOrder} onOpenChange={(open) => !open && setCancelConfirmOrder(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить заказ?</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelConfirmOrder?.paid
                ? "Вы уверены, что хотите отменить этот оплаченный заказ? Баллы, начисленные за этот заказ, будут списаны."
                : "Вы уверены, что хотите отменить этот заказ?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Назад</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelPaidOrder}
              className="bg-gray-200 text-black font-bold border-2 border-black hover:bg-gray-300"
            >
              Отменить заказ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
