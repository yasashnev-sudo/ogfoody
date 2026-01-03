"use client"

import { useState } from "react"
import {
  Package,
  Users,
  Clock,
  CalendarIcon,
  Check,
  Copy,
  AlertTriangle,
  CreditCard,
  Star,
  MessageSquare,
  Banknote,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { isMealAvailable, isExtraAvailable } from "@/lib/meals-data"
import type { Order, UserProfile, Review, DayMeals, BreakfastSelection, FullMealSelection } from "@/lib/types"

interface OrderHistoryProps {
  orders: Order[]
  onCancelOrder: (startDate: Date) => void
  onRepeatOrder: (order: Order, targetDate: Date) => void
  onPayOrder: (order: Order, total: number) => void
  onMarkCashOrderAsPaid: (order: Order) => void
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
  onMarkCashOrderAsPaid,
  onReviewOrder,
  availableDates,
  userProfile,
  reviews,
}: OrderHistoryProps) {
  const [repeatMenuOpen, setRepeatMenuOpen] = useState<string | null>(null)
  const [cancelConfirmOrder, setCancelConfirmOrder] = useState<Order | null>(null)

  const activeOrders = orders.filter((o) => !o.cancelled)

  const sortedOrders = [...activeOrders].sort((a, b) => {
    return toDate(b.startDate).getTime() - toDate(a.startDate).getTime()
  })

  const calculateOrderTotal = (order: Order) => {
    let total = 0
    order.persons.forEach((person) => {
      ;["day1", "day2"].forEach((day) => {
        const dayMeals = person[day as "day1" | "day2"] as DayMeals
        if (!dayMeals) return

        const breakfast = ensureBreakfastStructure(dayMeals.breakfast)
        const lunch = ensureFullMealStructure(dayMeals.lunch)
        const dinner = ensureFullMealStructure(dayMeals.dinner)

        // Завтрак
        if (breakfast.dish) {
          total += breakfast.dish.price * (breakfast.dish.portion || 1)
        }

        // Обед
        if (lunch.salad) total += lunch.salad.price * (lunch.salad.portion || 1)
        if (lunch.soup) total += lunch.soup.price * (lunch.soup.portion || 1)
        if (lunch.main) {
          total += lunch.main.price * (lunch.main.portion || 1)
          if (lunch.main.garnish) total += lunch.main.garnish.price * (lunch.main.garnish.portion || 1)
        }

        // Ужин
        if (dinner.salad) total += dinner.salad.price * (dinner.salad.portion || 1)
        if (dinner.soup) total += dinner.soup.price * (dinner.soup.portion || 1)
        if (dinner.main) {
          total += dinner.main.price * (dinner.main.portion || 1)
          if (dinner.main.garnish) total += dinner.main.garnish.price * (dinner.main.garnish.portion || 1)
        }
      })
    })
    order.extras?.forEach((extra) => {
      total += extra.price * extra.quantity
    })
    return total
  }

  const canCancelOrder = (startDate: Date | string, order?: Order) => {
    // Если заказ уже доставлен, нельзя отменить
    if (order?.delivered) {
      return false
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const orderDate = toDate(startDate)
    orderDate.setHours(0, 0, 0, 0)
    
    // Можно отменить заказ, если дата доставки еще не прошла (включая сегодня)
    // Это работает для всех заказов, включая оплаченные
    // Для оплаченных заказов можно отменить до даты доставки включительно
    const dateIsValid = orderDate.getTime() >= today.getTime()
    
    return dateIsValid
  }

  const canReviewOrder = (order: Order, orderKey: string) => {
    return order.delivered && !reviews.find((r) => r.orderId === orderKey)
  }

  const getOrderReview = (orderKey: string) => {
    return reviews.find((r) => r.orderId === orderKey)
  }

  const getFreeDates = () => {
    const orderDates = new Set(activeOrders.map((o) => formatDateKey(toDate(o.startDate))))
    return availableDates.filter((d) => !orderDates.has(formatDateKey(d)))
  }

  const handleCancelClick = (order: Order) => {
    setCancelConfirmOrder(order)
  }

  const confirmCancelPaidOrder = () => {
    if (cancelConfirmOrder) {
      onCancelOrder(toDate(cancelConfirmOrder.startDate))
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

    const getPortionText = (p: number) => (p === 1 ? "обычная" : p === 2 ? "двойная" : "тройная")

    return (
      <div className="space-y-1 pl-2">
        {breakfast.dish && (
          <div className="flex items-start gap-1 flex-wrap">
            <span className="text-muted-foreground">Завтрак:</span>
            <span>{breakfast.dish.name}</span>
            <span className="text-muted-foreground text-[10px]">({getPortionText(breakfast.dish.portion || 1)})</span>
          </div>
        )}
        {(lunch.salad || lunch.soup || lunch.main) && (
          <div className="flex items-start gap-1 flex-wrap">
            <span className="text-muted-foreground">Обед:</span>
            <span>{[lunch.salad?.name, lunch.soup?.name, lunch.main?.name].filter(Boolean).join(", ")}</span>
            {lunch.main?.garnish && (
              <span className="text-muted-foreground text-[10px]">+ {lunch.main.garnish.name}</span>
            )}
          </div>
        )}
        {(dinner.salad || dinner.soup || dinner.main) && (
          <div className="flex items-start gap-1 flex-wrap">
            <span className="text-muted-foreground">Ужин:</span>
            <span>{[dinner.salad?.name, dinner.soup?.name, dinner.main?.name].filter(Boolean).join(", ")}</span>
            {dinner.main?.garnish && (
              <span className="text-muted-foreground text-[10px]">+ {dinner.main.garnish.name}</span>
            )}
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
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setCancelConfirmOrder(null)}>
                Не отменять
              </Button>
              <Button variant="destructive" className="flex-1" onClick={confirmCancelPaidOrder}>
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
          const { available: allItemsAvailable, unavailableItems } = checkOrderAvailability(order)
          const orderReview = getOrderReview(orderKey)
          const canReview = canReviewOrder(order, orderKey)
          const canEdit = !order.paid || order.paymentMethod === "cash"

          return (
            <div key={orderKey} className="bg-card rounded-xl p-4 shadow-sm border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold">Заказ на {formatDisplayDate(orderDate)}</div>
                    <div className="text-xs text-muted-foreground">Набор на 2 дня</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      order.delivered ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                    }`}
                  >
                    {order.delivered ? (
                      <>
                        <Check className="w-3 h-3" />
                        Доставлен
                      </>
                    ) : (
                      <>
                        <Package className="w-3 h-3" />
                        Ожидает
                      </>
                    )}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      order.paid ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {order.paymentMethod === "cash" ? (
                      <>
                        <Banknote className="w-3 h-3" />
                        {order.paid ? "Оплачен" : "Наличными"}
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-3 h-3" />
                        {order.paid ? "Оплачен" : "Не оплачен"}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Доставка:</span>
                  <span className="font-medium">{order.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Персон:</span>
                  <span className="font-medium">{order.persons.length}</span>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                {order.persons.map((person, index) => (
                  <div key={person.id} className="mb-3 last:mb-0">
                    <div className="text-sm font-medium mb-2 text-muted-foreground">Персона {index + 1}</div>
                    <div className="space-y-2 pl-3">
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
                          <div key={day} className="text-xs">
                            <div className="font-medium text-muted-foreground mb-1">
                              День {dayIndex + 1} ({formatDisplayDate(displayDate)})
                            </div>
                            {renderMealInfo(dayMeals)}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {order.extras && order.extras.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="text-sm font-medium mb-2 text-muted-foreground">Дополнения</div>
                    <div className="flex flex-wrap gap-2">
                      {order.extras.map((extra) => (
                        <span key={extra.name} className="text-xs bg-muted px-2 py-1 rounded">
                          {extra.name} x{extra.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
                <span className="font-semibold">Итого:</span>
                <span className="text-xl font-bold text-primary">{total} ₽</span>
              </div>

              {order.paid && order.paymentMethod !== "cash" && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Заказ оплачен. Изменение состава недоступно. При необходимости отмените заказ и создайте новый.
                  </p>
                </div>
              )}

              {orderReview ? (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= orderReview.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">Ваш отзыв</span>
                    </div>
                    {orderReview.text && <p className="text-sm text-muted-foreground">{orderReview.text}</p>}
                  </div>
                </div>
              ) : canReview ? (
                <div className="mt-3 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => onReviewOrder(order)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Оставить отзыв
                  </Button>
                </div>
              ) : null}

              {!order.paid && order.paymentMethod === "cash" && (
                <div className="pt-3 mt-3 border-t border-border">
                  {/* Switch to Card Widget */}
                  <div className="bg-white border-2 border-black rounded-lg p-4 shadow-brutal mb-3">
                    <div className="mb-3">
                      <h3 className="font-black text-black text-base mb-1">ОПЛАТА ПРИ ПОЛУЧЕНИИ</h3>
                      <p className="text-sm text-muted-foreground">Можно оплатить сейчас, чтобы не ждать сдачу.</p>
                    </div>
                    <Button
                      onClick={() => onPayOrder(order, total)}
                      className="w-full bg-[#FFEA00] hover:bg-[#FFF033] border-2 border-black text-black font-black shadow-brutal h-12"
                    >
                      💳 ОПЛАТИТЬ КАРТОЙ
                    </Button>
                  </div>
                  
                  {/* Mark as Paid Button (Alternative) */}
                  <Button
                    onClick={() => onMarkCashOrderAsPaid(order)}
                    variant="outline"
                    className="w-full bg-transparent border border-border hover:bg-muted"
                  >
                    <Banknote className="w-4 h-4 mr-2" />
                    Отметить как оплаченный наличными
                  </Button>
                </div>
              )}

              {!order.paid && !order.paymentMethod && (
                <div className="pt-3 mt-3 border-t border-border">
                  <Button onClick={() => onPayOrder(order, total)} className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Оплатить {total} ₽
                  </Button>
                </div>
              )}

              <div className="border-t border-border pt-3 mt-3">
                {freeDates.length > 0 ? (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => setRepeatMenuOpen(repeatMenuOpen === orderKey ? null : orderKey)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Повторить заказ
                    </Button>

                    {repeatMenuOpen === orderKey && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-3 z-10">
                        <div className="text-sm font-medium mb-2">Выберите дату:</div>

                        {!allItemsAvailable && (
                          <div className="mb-3 p-2 bg-orange-500/10 rounded-lg flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-orange-700">
                              <p className="font-medium">Некоторые позиции недоступны:</p>
                              <p className="text-orange-600">{unavailableItems.join(", ")}</p>
                              <p className="mt-1">Они будут пропущены при повторении</p>
                            </div>
                          </div>
                        )}

                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {freeDates.map((date) => (
                            <button
                              key={formatDateKey(date)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors"
                              onClick={() => {
                                onRepeatOrder(order, date)
                                setRepeatMenuOpen(null)
                              }}
                            >
                              {formatDisplayDate(date)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center">Нет доступных дат для повторения</p>
                )}
              </div>

              {canCancel && (
                <div className="pt-3 mt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelClick(order)}
                    className="w-full bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Отменить заказ
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
